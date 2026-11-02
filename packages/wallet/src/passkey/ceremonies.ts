import type { WalletEnv } from '../config/environment';
import { RP_IDS } from '../config/environment';
import { prfInputV1 } from '../derivation/v1';
import { equalBytes } from '../util/bytes';
import { randomBytes } from '../util/random';
import { CeremonyGate, CeremonyRun } from './ceremony-gate';
import {
  CeremonySupersededError,
  CrossDeviceRegistrationError,
  EmbeddedContextError,
  PasskeyError,
  PrfMismatchError,
  PrfUnavailableError,
  UserActivationMissingError,
  WrongOriginError,
} from './errors';
import { PrfClientInputs, PrfClientResults, WebAuthnJson, bytesToBase64Url, credentialToJSON } from './webauthn-json';

/** Credentials surface the ceremonies drive (the browser's, or a fake in tests). */
export interface CeremonyCredentials {
  create(options: CredentialCreationOptions): Promise<PublicKeyCredential | null>;
  get(options: CredentialRequestOptions): Promise<PublicKeyCredential | null>;
}

/** Window surface the ceremonies inspect. */
export interface CeremonyWindow {
  location: { hostname: string };
  navigator: {
    userAgent: string;
    userActivation?: { isActive: boolean };
    platform?: string;
    maxTouchPoints?: number;
  };
  PublicKeyCredential?: {
    signalUnknownCredential?: (input: { credentialId: string; rpId: string }) => Promise<void>;
  };
}

/** A created passkey that still needs its confirming second tap (§6.3). */
export interface PendingSeedPasskey {
  readonly credentialId: Uint8Array;
  /** Tap 2: the confirming `get()` that proves the credential and yields the PRF output. */
  confirm(): Promise<CreatedSeedPasskey>;
  /** Drops the aborted registration and tells the platform the credential is unknown. */
  abort(): Promise<void>;
}

export interface CreatedSeedPasskey {
  credentialId: Uint8Array;
  userHandle: Uint8Array;
  /** The `create()` result serialized for the API (PRF results stripped). */
  attestation: WebAuthnJson;
  /** The confirming `get()` result serialized for the API (PRF results stripped). */
  assertion: WebAuthnJson;
  prfOutput: Uint8Array;
  attachment: AuthenticatorAttachment | null;
  transports: string[];
}

export interface SeedAssertion {
  credentialId: Uint8Array;
  /** The `get()` result serialized for the API (PRF results stripped). */
  assertion: WebAuthnJson;
  prfOutput?: Uint8Array;
  backupEligible: boolean;
  backedUp: boolean;
}

const TIMEOUT_MS = 300_000;
const CRED_PARAMS: PublicKeyCredentialParameters[] = [
  { type: 'public-key', alg: -7 },
  { type: 'public-key', alg: -257 },
];

function copy(input: BufferSource | null | undefined): Uint8Array<ArrayBuffer> {
  if (!input) return new Uint8Array(0);
  const out = new Uint8Array(input.byteLength);
  out.set(
    input instanceof ArrayBuffer
      ? new Uint8Array(input)
      : new Uint8Array(input.buffer, input.byteOffset, input.byteLength),
  );
  return out;
}

/** Copies caller bytes into a plain ArrayBuffer-backed view, the WebAuthn `BufferSource` shape. */
function source(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(bytes.length);
  out.set(bytes);
  return out;
}

function readPrfFirst(credential: PublicKeyCredential): Uint8Array | undefined {
  const results = credential.getClientExtensionResults() as PrfClientResults;
  const first = results.prf?.results?.first;
  if (first === undefined || first === null) return undefined;
  const bytes = copy(first);
  return bytes.length > 0 ? bytes : undefined;
}

function backupFlags(authenticatorData: ArrayBuffer | undefined): { backupEligible: boolean; backedUp: boolean } {
  const bytes = authenticatorData ? new Uint8Array(authenticatorData) : new Uint8Array();
  const flags = bytes.length > 32 ? bytes[32] : 0;
  return { backupEligible: (flags & 0x08) !== 0, backedUp: (flags & 0x10) !== 0 };
}

function userHandleLabel(now = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `DFX Wallet ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** Browser `navigator.credentials` when both `create` and `get` exist; otherwise a dummy that resolves null. */
function defaultCredentials(): CeremonyCredentials {
  const credentials = (globalThis as { navigator?: { credentials?: { create?: unknown; get?: unknown } } }).navigator
    ?.credentials;
  if (typeof credentials?.create === 'function' && typeof credentials?.get === 'function') {
    return credentials as CeremonyCredentials;
  }
  return { create: async () => null, get: async () => null };
}

/**
 * The wallet's passkey ceremonies. Every option is built locally — only the challenge comes from the
 * server — and exactly one ceremony runs at a time; a newer call or `cancel()` supersedes the running one.
 * No AbortSignal is passed on iOS/iPadOS WebKit (it breaks ceremonies there); superseding still applies.
 */
export class PasskeyCeremonies {
  private readonly gate = new CeremonyGate();

  constructor(
    private readonly env: WalletEnv,
    private readonly credentials: CeremonyCredentials = defaultCredentials(),
    private readonly win: CeremonyWindow = (globalThis as unknown as CeremonyWindow) ?? {
      location: { hostname: '' },
      navigator: { userAgent: '' },
    },
  ) {}

  /** Tap 1 of the registration: creates the credential with the PRF extension and returns the pending passkey. */
  async createCredential(input: {
    challenge: Uint8Array;
    excludeCredentialIds?: Uint8Array[];
  }): Promise<PendingSeedPasskey> {
    this.requireTopLevelOrigin();
    this.requireActivation();

    const label = userHandleLabel();
    const userId = source(randomBytes(32));
    const options: CredentialCreationOptions = {
      publicKey: {
        challenge: source(input.challenge),
        rp: { id: RP_IDS[this.env], name: 'DFX' },
        user: { id: userId, name: label, displayName: label },
        pubKeyCredParams: CRED_PARAMS,
        authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
        attestation: 'none',
        timeout: TIMEOUT_MS,
        excludeCredentials: (input.excludeCredentialIds ?? []).map((id) => ({
          type: 'public-key' as const,
          id: source(id),
        })),
        extensions: { prf: { eval: { first: prfInputV1() } } } as PrfClientInputs,
      },
    };

    const { result, run } = await this.call((signal) => this.credentials.create(this.withSignal(options, signal)));
    const credential = result;
    try {
      run.checkCurrent();
    } catch (error) {
      if (credential) await this.signalUnknownCredential(copy(credential.rawId));
      throw error;
    }
    if (!credential) throw new PasskeyError('no-credential', 'The authenticator returned no credential');

    const rawAttachment = credential.authenticatorAttachment;
    const attachment: AuthenticatorAttachment | null =
      rawAttachment === 'platform' || rawAttachment === 'cross-platform' ? rawAttachment : null;
    const transports: string[] =
      ((credential.response as AuthenticatorAttestationResponse).getTransports?.() as string[] | undefined) ?? [];
    if (attachment === 'cross-platform' || transports.includes('hybrid')) {
      await this.signalUnknownCredential(copy(credential.rawId));
      throw new CrossDeviceRegistrationError();
    }

    const credentialId = copy(credential.rawId);
    // The attestation response carries no user handle; the server gets the id this wallet generated.
    const userHandle = userId;
    const attestation = credentialToJSON(credential);
    const prfFromCreate = readPrfFirst(credential);

    const derivePrf = (id: Uint8Array) => this.derivePrf(id, input.challenge);
    const signalUnknown = (id: Uint8Array) => this.signalUnknownCredential(id);
    return {
      credentialId,
      async confirm(): Promise<CreatedSeedPasskey> {
        const { prfOutput, credential: assertionCredential } = await derivePrf(credentialId);
        if (prfFromCreate && !equalBytes(prfOutput, prfFromCreate)) {
          await signalUnknown(credentialId);
          throw new PrfMismatchError();
        }
        return {
          credentialId,
          userHandle,
          attestation,
          assertion: credentialToJSON(assertionCredential),
          prfOutput,
          attachment,
          transports,
        };
      },
      async abort(): Promise<void> {
        await signalUnknown(credentialId);
      },
    };
  }

  /** A login assertion with PRF output when the authenticator provides it. */
  async assert(input: { challenge?: Uint8Array; credentialId?: Uint8Array }): Promise<SeedAssertion> {
    this.requireTopLevelOrigin();
    this.requireActivation();

    const options: CredentialRequestOptions = {
      publicKey: {
        challenge: source(input.challenge ?? randomBytes(32)),
        rpId: RP_IDS[this.env],
        userVerification: 'required',
        timeout: TIMEOUT_MS,
        ...(input.credentialId
          ? { allowCredentials: [{ type: 'public-key' as const, id: source(input.credentialId) }] }
          : {}),
        extensions: { prf: { eval: { first: prfInputV1() } } } as PrfClientInputs,
      },
    };

    const { result, run } = await this.call((signal) => this.credentials.get(this.withSignal(options, signal)));
    run.checkCurrent();
    const credential = result;
    if (!credential) throw new PasskeyError('no-credential', 'The authenticator returned no assertion');

    return {
      credentialId: copy(credential.rawId),
      assertion: credentialToJSON(credential),
      prfOutput: readPrfFirst(credential),
      ...backupFlags((credential.response as AuthenticatorAssertionResponse).authenticatorData),
    };
  }

  /** Best-effort `signalUnknownCredential` for aborted registrations (§4.2); never throws. */
  async signalUnknownCredential(credentialId: Uint8Array): Promise<void> {
    try {
      await this.win.PublicKeyCredential?.signalUnknownCredential?.({
        credentialId: bytesToBase64Url(credentialId),
        rpId: RP_IDS[this.env],
      });
    } catch {
      // signalling is advisory; a rejection must never break the ceremony
    }
  }

  /** Supersedes the running ceremony without starting a new one. */
  cancel(): void {
    this.gate.cancelActive();
  }

  /** Tap 2 helper: the confirming `get()` restricted to the new credential; PRF output is mandatory. */
  private async derivePrf(
    credentialId: Uint8Array,
    challenge: Uint8Array,
  ): Promise<{ prfOutput: Uint8Array; credential: PublicKeyCredential }> {
    this.requireActivation();
    const options: CredentialRequestOptions = {
      publicKey: {
        challenge: source(challenge),
        rpId: RP_IDS[this.env],
        allowCredentials: [{ type: 'public-key', id: source(credentialId) }],
        userVerification: 'required',
        timeout: TIMEOUT_MS,
        extensions: { prf: { eval: { first: prfInputV1() } } } as PrfClientInputs,
      },
    };
    const { result, run } = await this.call((signal) => this.credentials.get(this.withSignal(options, signal)));
    run.checkCurrent();
    const prfOutput = result ? readPrfFirst(result) : undefined;
    if (!prfOutput || !result) {
      await this.signalUnknownCredential(credentialId);
      throw new PrfUnavailableError();
    }
    return { prfOutput, credential: result };
  }

  /** Runs one gated WebAuthn call: user gesture, superseding, and the platform-appropriate signal. */
  private async call<T>(
    action: (signal: AbortSignal | undefined) => Promise<T>,
  ): Promise<{ result: T; run: CeremonyRun }> {
    const nav = this.win.navigator;
    // iPadOS desktop mode reports a Macintosh user agent. Touch points tell it apart from desktop Safari.
    const ipadDesktop = nav.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1;
    const allowSignal = !ipadDesktop && !/iPhone|iPad|iPod/i.test(nav.userAgent);
    const controller = allowSignal ? new AbortController() : undefined;

    const run = this.gate.begin(() => controller?.abort());
    try {
      const result = await action(controller?.signal);
      return { result, run };
    } catch (error) {
      if (!run.isCurrent()) throw new CeremonySupersededError();
      throw error;
    }
  }

  private withSignal<T extends { signal?: AbortSignal }>(options: T, signal: AbortSignal | undefined): T {
    return signal ? { ...options, signal } : options;
  }

  private requireTopLevelOrigin(): void {
    if (this.win.location.hostname !== RP_IDS[this.env]) {
      throw new WrongOriginError(this.win.location.hostname, RP_IDS[this.env]);
    }
    // `top` is only readable on same-origin pages; a cross-origin access throws and means embedded (NG3).
    try {
      const top = (this.win as unknown as { top?: unknown }).top;
      if (top !== undefined && top !== this.win) throw new EmbeddedContextError();
    } catch (error) {
      if (error instanceof EmbeddedContextError) throw error;
      throw new EmbeddedContextError();
    }
  }

  private requireActivation(): void {
    const activation = this.win.navigator.userActivation;
    if (activation && !activation.isActive) throw new UserActivationMissingError();
  }
}
