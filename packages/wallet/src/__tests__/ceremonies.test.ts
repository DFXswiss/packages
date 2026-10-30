import type { WalletEnv } from '../config/environment';
import { prfInputV1 } from '../derivation/v1';
import { CeremonyCredentials, CeremonyWindow, PasskeyCeremonies } from '../passkey/ceremonies';
import {
  CrossDeviceRegistrationError,
  CeremonySupersededError,
  PrfMismatchError,
  PrfUnavailableError,
} from '../passkey/errors';

const HOSTNAME = 'app.dfx.swiss';
const CREDENTIAL_ID = new Uint8Array([1, 2, 3, 4]);
const USER_HANDLE = new Uint8Array(32).fill(7);
const PRF_A = new Uint8Array(32).fill(0xaa);
const PRF_B = new Uint8Array(32).fill(0xbb);

class FakeCredentials implements CeremonyCredentials {
  readonly created: CredentialCreationOptions[] = [];
  readonly got: CredentialRequestOptions[] = [];
  nextCreate: PublicKeyCredential | null = null;
  nextGet: PublicKeyCredential | null = null;
  createHook?: () => Promise<void>;

  async create(options: CredentialCreationOptions): Promise<PublicKeyCredential | null> {
    this.created.push(options);
    await this.createHook?.();
    return this.nextCreate;
  }

  async get(options: CredentialRequestOptions): Promise<PublicKeyCredential | null> {
    this.got.push(options);
    return this.nextGet;
  }
}

function fakeWindow(overrides: Record<string, unknown> = {}): CeremonyWindow & { signalUnknown: jest.Mock } {
  const signalUnknown = jest.fn();
  return {
    location: { hostname: HOSTNAME },
    navigator: { userAgent: 'TestBrowser/1.0', userActivation: { isActive: true } },
    PublicKeyCredential: { signalUnknownCredential: signalUnknown },
    signalUnknown,
    ...overrides,
  } as CeremonyWindow & { signalUnknown: jest.Mock };
}

function attestationCredential(input: {
  id?: Uint8Array;
  prf?: Uint8Array;
  attachment?: AuthenticatorAttachment | null;
  transports?: string[];
}): PublicKeyCredential {
  const id = input.id ?? CREDENTIAL_ID;
  const prfResults = input.prf ? { prf: { results: { first: input.prf } } } : {};
  return {
    id: 'test-credential',
    rawId: id.slice().buffer,
    type: 'public-key',
    authenticatorAttachment: input.attachment ?? 'platform',
    response: {
      clientDataJSON: new Uint8Array([1]).buffer,
      attestationObject: new Uint8Array([2]).buffer,
      userHandle: USER_HANDLE.slice().buffer,
      getTransports: () => input.transports ?? ['internal'],
    },
    getClientExtensionResults: () => prfResults,
  } as unknown as PublicKeyCredential;
}

function assertionCredential(input: { id?: Uint8Array; prf?: Uint8Array; flags?: number }): PublicKeyCredential {
  const authenticatorData = new Uint8Array(37);
  authenticatorData[32] = input.flags ?? 0;
  return {
    id: 'test-credential',
    rawId: (input.id ?? CREDENTIAL_ID).slice().buffer,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: new Uint8Array([1]).buffer,
      authenticatorData: authenticatorData.buffer,
      signature: new Uint8Array([3]).buffer,
      userHandle: null,
    },
    getClientExtensionResults: () => (input.prf ? { prf: { results: { first: input.prf } } } : {}),
  } as unknown as PublicKeyCredential;
}

function ceremonies(credentials: FakeCredentials, win = fakeWindow(), env: WalletEnv = 'prd'): PasskeyCeremonies {
  return new PasskeyCeremonies(env, credentials, win);
}

describe('createCredential', () => {
  it('builds every option locally; only the challenge comes from the caller', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ prf: PRF_A });
    const challenge = new Uint8Array(32).fill(9);

    await ceremonies(credentials).createCredential({ challenge, excludeCredentialIds: [new Uint8Array([5])] });

    expect(credentials.created).toHaveLength(1);
    const options = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(new Uint8Array(options.challenge)).toEqual(challenge);
    expect(options.rp).toEqual({ id: 'app.dfx.swiss', name: 'DFX' });
    expect(new Uint8Array(options.user.id)).toHaveLength(32);
    expect(options.user.name).toMatch(/^DFX Wallet \d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(options.user.displayName).toEqual(options.user.name);
    expect(options.pubKeyCredParams).toEqual([
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -257 },
    ]);
    expect(options.authenticatorSelection).toEqual({
      residentKey: 'required',
      requireResidentKey: true,
      userVerification: 'required',
    });
    expect(options.attestation).toBe('none');
    expect(options.timeout).toBe(300_000);
    expect(options.excludeCredentials).toEqual([{ type: 'public-key', id: new Uint8Array([5]) }]);
    expect((options.extensions as { prf: { eval: { first: Uint8Array } } }).prf.eval.first).toEqual(prfInputV1());
  });

  it('aborts and signals when the credential was created cross-platform', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ attachment: 'cross-platform', prf: PRF_A });
    const win = fakeWindow();

    await expect(ceremonies(credentials, win).createCredential({ challenge: new Uint8Array(32) })).rejects.toThrow(
      CrossDeviceRegistrationError,
    );
    expect(win.signalUnknown).toHaveBeenCalledWith({ credentialId: CREDENTIAL_ID, rpHint: 'app.dfx.swiss' });
  });

  it('aborts and signals on hybrid transports even with platform attachment', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ attachment: 'platform', transports: ['hybrid'] });
    const win = fakeWindow();

    await expect(ceremonies(credentials, win).createCredential({ challenge: new Uint8Array(32) })).rejects.toThrow(
      CrossDeviceRegistrationError,
    );
    expect(win.signalUnknown).toHaveBeenCalled();
  });

  it('confirm() returns the PRF output of the confirming get()', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ prf: PRF_A });
    const pending = await ceremonies(credentials).createCredential({ challenge: new Uint8Array(32) });

    credentials.nextGet = assertionCredential({ prf: PRF_A });
    const created = await pending.confirm();

    expect(new Uint8Array(created.prfOutput)).toEqual(PRF_A);
    expect(new Uint8Array(created.credentialId)).toEqual(CREDENTIAL_ID);
    // The user handle is the id this wallet generated in the create options.
    const createOptions = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(new Uint8Array(created.userHandle)).toEqual(new Uint8Array(createOptions.user.id as Uint8Array));
    expect(new Uint8Array(createOptions.user.id)).toHaveLength(32);
    expect(created.transports).toEqual(['internal']);
    // The attestation JSON carries the create() result, without PRF bytes.
    expect(created.attestation['clientExtensionResults']).toEqual({});

    const getOptions = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(getOptions.rpId).toBe('app.dfx.swiss');
    expect(getOptions.allowCredentials).toEqual([{ type: 'public-key', id: CREDENTIAL_ID }]);
    expect(new Uint8Array(getOptions.challenge)).toHaveLength(32);
    expect((getOptions.extensions as { prf: { eval: { first: Uint8Array } } }).prf.eval.first).toEqual(prfInputV1());
  });

  it('confirm() throws PrfMismatchError when create and get returned different PRF outputs', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ prf: PRF_A });
    const win = fakeWindow();
    const pending = await ceremonies(credentials, win).createCredential({ challenge: new Uint8Array(32) });

    credentials.nextGet = assertionCredential({ prf: PRF_B });
    await expect(pending.confirm()).rejects.toThrow(PrfMismatchError);
    expect(win.signalUnknown).toHaveBeenCalled();
  });

  it('confirm() throws PrfUnavailableError when the authenticator has no PRF', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({});
    const win = fakeWindow();
    const pending = await ceremonies(credentials, win).createCredential({ challenge: new Uint8Array(32) });

    credentials.nextGet = assertionCredential({});
    await expect(pending.confirm()).rejects.toThrow(PrfUnavailableError);
    expect(win.signalUnknown).toHaveBeenCalled();
  });

  it('confirm() succeeds when only the confirming get() provides PRF', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({});
    const pending = await ceremonies(credentials).createCredential({ challenge: new Uint8Array(32) });

    credentials.nextGet = assertionCredential({ prf: PRF_B });
    await expect(pending.confirm()).resolves.toMatchObject({ prfOutput: PRF_B });
  });

  it('abort() signals the credential as unknown', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ prf: PRF_A });
    const win = fakeWindow();
    const pending = await ceremonies(credentials, win).createCredential({ challenge: new Uint8Array(32) });

    await pending.abort();
    expect(win.signalUnknown).toHaveBeenCalledWith({ credentialId: CREDENTIAL_ID, rpHint: 'app.dfx.swiss' });
  });
});

describe('assert', () => {
  it('returns the assertion with PRF output and backup flags', async () => {
    const credentials = new FakeCredentials();
    credentials.nextGet = assertionCredential({ prf: PRF_A, flags: 0x08 });

    const assertion = await ceremonies(credentials).assert({ credentialId: CREDENTIAL_ID });

    expect(new Uint8Array(assertion.credentialId)).toEqual(CREDENTIAL_ID);
    expect(new Uint8Array(assertion.prfOutput!)).toEqual(PRF_A);
    expect(assertion.backupEligible).toBe(true);
    expect(assertion.backedUp).toBe(false);
    expect(assertion.assertion['clientExtensionResults']).toEqual({});

    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(options.allowCredentials).toEqual([{ type: 'public-key', id: CREDENTIAL_ID }]);
  });

  it('runs discoverable without a credential id and uses a local random challenge', async () => {
    const credentials = new FakeCredentials();
    credentials.nextGet = assertionCredential({ flags: 0x18 });

    const assertion = await ceremonies(credentials).assert({});

    expect(assertion.backupEligible).toBe(true);
    expect(assertion.backedUp).toBe(true);
    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(options.allowCredentials).toBeUndefined();
    expect(new Uint8Array(options.challenge)).toHaveLength(32);
  });

  it('works without PRF output (locked session path, D17)', async () => {
    const credentials = new FakeCredentials();
    credentials.nextGet = assertionCredential({});

    const assertion = await ceremonies(credentials).assert({});
    expect(assertion.prfOutput).toBeUndefined();
  });
});

describe('guards', () => {
  it('refuses the wrong origin', async () => {
    const win = fakeWindow({ location: { hostname: 'evil.example' } });
    await expect(ceremonies(new FakeCredentials(), win).assert({})).rejects.toMatchObject({ code: 'wrong-origin' });
  });

  it('refuses embedded contexts', async () => {
    const win = fakeWindow() as CeremonyWindow & { top?: unknown };
    win.top = {};
    await expect(ceremonies(new FakeCredentials(), win).assert({})).rejects.toMatchObject({ code: 'embedded-context' });
  });

  it('refuses to start without user activation', async () => {
    const win = fakeWindow({ navigator: { userAgent: 'TestBrowser/1.0', userActivation: { isActive: false } } });
    await expect(ceremonies(new FakeCredentials(), win).assert({})).rejects.toMatchObject({
      code: 'user-activation-missing',
    });
  });

  it('refuses the DEV RP ID on the PRD host', async () => {
    await expect(ceremonies(new FakeCredentials(), fakeWindow(), 'dev').assert({})).rejects.toMatchObject({
      code: 'wrong-origin',
    });
  });
});

describe('superseding and signals', () => {
  it('a newer ceremony supersedes the running one', async () => {
    const credentials = new FakeCredentials();
    let release!: (value: void) => void;
    credentials.createHook = () => new Promise<void>((resolve) => (release = resolve));
    credentials.nextGet = assertionCredential({});
    const instance = ceremonies(credentials);

    const first = instance.createCredential({ challenge: new Uint8Array(32) });
    const second = instance.assert({});
    release();

    await expect(first).rejects.toThrow(CeremonySupersededError);
    await expect(second).resolves.toMatchObject({ backupEligible: false });
  });

  it('cancel() supersedes without starting a new ceremony', async () => {
    const credentials = new FakeCredentials();
    let release!: (value: void) => void;
    credentials.createHook = () => new Promise<void>((resolve) => (release = resolve));
    const instance = ceremonies(credentials);

    const pending = instance.createCredential({ challenge: new Uint8Array(32) });
    instance.cancel();
    release();

    await expect(pending).rejects.toThrow(CeremonySupersededError);
  });

  it('passes an AbortSignal outside iOS and none on iOS WebKit', async () => {
    const credentials = new FakeCredentials();
    credentials.nextCreate = attestationCredential({ prf: PRF_A });
    await ceremonies(credentials).createCredential({ challenge: new Uint8Array(32) });
    expect(credentials.created[0].signal).toBeInstanceOf(AbortSignal);

    const iosWindow = fakeWindow({
      navigator: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)',
        userActivation: { isActive: true },
      },
    });
    const iosCredentials = new FakeCredentials();
    iosCredentials.nextCreate = attestationCredential({ prf: PRF_A });
    await ceremonies(iosCredentials, iosWindow).createCredential({ challenge: new Uint8Array(32) });
    expect(iosCredentials.created[0].signal).toBeUndefined();
  });
});
