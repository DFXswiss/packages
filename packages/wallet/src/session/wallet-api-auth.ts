import type {
  WalletAddress,
  WalletApi,
  WalletChainId,
  WalletCredential,
  WalletFamilies,
  WalletRevokeFinishResponse,
  WalletSessionResponse,
  WalletUpsertAddressRequest,
} from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import type { BitcoinNetwork, WalletEnv } from '../config/environment';
import { RP_IDS } from '../config/environment';
import { walletApiBitcoinNetwork } from '../config/wallet-api';
import { KeyRing } from '../derivation/keyring';
import { seedCheck } from '../derivation/seed-check';
import { mnemonicFromPrfV1 } from '../derivation/v1';
import { CredentialCache } from '../passkey/credential-cache';
import type { CreatedSeedPasskey, PasskeyCeremonies, PendingSeedPasskey, SeedAssertion } from '../passkey/ceremonies';
import { base64UrlDecode, base64UrlEncode, equalBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import type { WalletState } from './passkey-auth';
import { PasskeyRefusedError } from './passkey-auth';

export interface WalletApiAuthDeps {
  /** `DfxApiClient.wallet`, or a `WalletApi` of its own. */
  api: WalletApi;
  ceremonies: PasskeyCeremonies;
  env: WalletEnv;
  cache?: CredentialCache;
  /** Overrides the network; default {@link walletApiBitcoinNetwork} (`regtest` outside PRD). */
  bitcoinNetwork?: BitcoinNetwork;
  /** Environments that may use regtest; default `DEFAULT_REGTEST_ENVS`. */
  regtestEnvs?: readonly WalletEnv[];
}

/**
 * Result of a wallet-api passkey flow. `token` is the wallet session (never a DFX customer session). `keys` is
 * set whenever the ceremony returned PRF output, including a seed mismatch; `state` is `unlocked` only when the
 * addresses stored on wallet-api belong to the derived seed.
 */
export interface WalletApiAuthResult extends WalletSessionResponse {
  families: WalletFamilies;
  keys?: KeyRing;
  state: WalletState;
  /** The addresses wallet-api holds for the account after the flow. */
  addresses: WalletAddress[];
  /** Registering this seed's addresses failed; the session is valid, call `syncAddresses` again. */
  addressSyncError?: unknown;
}

/**
 * The passkey flows against wallet-api (`/v1/wallet/*`): register, login, unlock, revoke, credentials and the
 * address registration. The WebAuthn options come from the server, the credential goes back to it with PRF
 * results stripped; the seed is derived from the PRF output on this device only and never leaves it. Only the
 * families `GET /wallet/config` turns on are registered: with Bitcoin only, neither an EVM nor a Spark address or
 * proof is sent. A disabled family is derived only on login, to check a stored address of it against the seed.
 */
export class WalletApiAuth {
  private familiesRequest?: Promise<WalletFamilies>;

  constructor(private readonly deps: WalletApiAuthDeps) {}

  /** Bitcoin network of this wallet's key rings. */
  get bitcoinNetwork(): BitcoinNetwork {
    return this.deps.bitcoinNetwork ?? walletApiBitcoinNetwork(this.deps.env, this.deps.regtestEnvs);
  }

  /** The families of `GET /wallet/config`, loaded once; a failed load is retried on the next call. */
  families(refresh = false): Promise<WalletFamilies> {
    if (refresh || !this.familiesRequest) {
      const request = this.deps.api.config().then((config) => normalizeFamilies(config?.families));
      request.catch(() => {
        if (this.familiesRequest === request) this.familiesRequest = undefined;
      });
      this.familiesRequest = request;
    }
    return this.familiesRequest;
  }

  /** Registers a new passkey wallet: options from wallet-api, the 2-tap ceremony, finish, then the addresses. */
  async register(): Promise<WalletApiAuthResult> {
    // In parallel: the WebAuthn call must still run inside the user gesture's activation window.
    const [families, options] = await Promise.all([this.families(), this.deps.api.registerBegin()]);
    this.checkRpId(options.rpId);
    if (options.rp?.id !== undefined) this.checkRpId(options.rp.id);

    const exclude = new Set<string>([
      ...(options.excludeCredentials ?? []).map((credential) => credential.id),
      ...(this.deps.cache?.activeIds() ?? []),
    ]);
    const userHandle = options.user?.id || options.userHandle;
    const pending = await this.deps.ceremonies.createCredential({
      challenge: base64UrlDecode(options.challenge),
      userId: userHandle ? base64UrlDecode(userHandle) : undefined,
      excludeCredentialIds: [...exclude].map((id) => base64UrlDecode(id)),
      authenticatorAttachment: options.authenticatorSelection?.authenticatorAttachment,
    });
    const created = await this.confirmOrAbort(pending);

    let session: WalletSessionResponse;
    try {
      session = await this.deps.api.registerFinish({
        challengeId: options.challengeId,
        response: created.attestation,
      });
    } catch (error) {
      session = await this.recoverRegistration(error, created, pending);
    }

    const keys = this.keysFromPrf(created.prfOutput);
    const sync = await this.trySync(session.token, keys, families, []);
    this.cacheCredential(created.credentialId, keys, families);
    return { ...session, families, keys, state: 'unlocked', ...sync };
  }

  /**
   * Logs in: the assertion authenticates, the PRF output unlocks the seed. Without PRF the session stays
   * locked. A stored address of another seed is a hard mismatch, whatever its family and whether or not that
   * family is enabled: nothing is registered then, so an account never holds the addresses of two seeds. A
   * disabled family is derived only to compare a stored address of it. Missing addresses of enabled families are
   * registered.
   */
  async login(credentialId?: Uint8Array): Promise<WalletApiAuthResult> {
    const familiesRequest = this.families();
    familiesRequest.catch(() => undefined);
    const { session, assertion } = await this.authenticate(credentialId, false);
    const families = await familiesRequest;
    if (!assertion.prfOutput) return { ...session, families, state: 'locked', addresses: [] };

    const keys = this.keysFromPrf(assertion.prfOutput);
    const stored = await this.deps.api.addresses(session.token);
    if (this.foreignAddress(stored, keys)) {
      return { ...session, families, keys, state: 'seed-mismatch', addresses: stored };
    }
    const sync = await this.trySync(session.token, keys, families, stored);
    this.cacheCredential(assertion.credentialId, keys, families, assertion.backupEligible);
    return { ...session, families, keys, state: 'unlocked', ...sync };
  }

  /** Unlocks an authenticated session with a fresh PRF assertion against the cached seed check address. */
  async unlock(): Promise<{ keys?: KeyRing; state: WalletState }> {
    const assertion = await this.deps.ceremonies.assert({});
    if (!assertion.prfOutput) return { state: 'locked' };

    const id = base64UrlEncode(assertion.credentialId);
    const entry = this.deps.cache?.list().find((candidate) => candidate.credentialId === id);
    if (!entry || entry.state !== 'active' || !entry.seedCheckAddress) return { state: 'locked' };

    const keys = this.keysFromPrf(assertion.prfOutput);
    return { keys, state: this.matchesSeedCheck(keys, entry.seedCheckAddress) ? 'unlocked' : 'seed-mismatch' };
  }

  /**
   * Registers the addresses of the enabled families that wallet-api does not hold yet: Bitcoin receive index 0
   * of {@link bitcoinNetwork}, EVM account 0 and the Spark identity. Families that are off are never derived.
   */
  async syncAddresses(
    token: string,
    keys: KeyRing,
    families?: WalletFamilies,
    stored?: WalletAddress[],
  ): Promise<WalletAddress[]> {
    const enabled = families ?? (await this.families());
    const current = stored ?? (await this.deps.api.addresses(token));
    const result = [...current];
    await this.upsertMissing(token, keys, enabled, result);
    return result;
  }

  credentials(token: string): Promise<WalletCredential[]> {
    return this.deps.api.credentials(token);
  }

  /**
   * Revokes a passkey of the account by proving it one last time. wallet-api ends every session of the account
   * issued before `revokedAt`. With one active credential the ceremony is pinned to it.
   */
  async revoke(token: string, credentialId?: Uint8Array): Promise<WalletRevokeFinishResponse> {
    const options = await this.deps.api.revokeBegin(token);
    if (options.rpId !== undefined) this.checkRpId(options.rpId);
    const allowed = (options.allowCredentials ?? []).map((credential) => credential.id);
    const pinned = credentialId ?? (allowed.length === 1 ? base64UrlDecode(allowed[0]) : undefined);

    const assertion = await this.deps.ceremonies.assert({
      challenge: base64UrlDecode(options.challenge),
      credentialId: pinned,
    });
    const usedId = base64UrlEncode(assertion.credentialId);
    if ((pinned && !equalBytes(assertion.credentialId, pinned)) || (allowed.length > 0 && !allowed.includes(usedId))) {
      throw new WalletError('credential-mismatch', 'The authenticator returned a passkey this account cannot revoke');
    }

    const result = await this.deps.api.revokeFinish(
      { challengeId: options.challengeId, response: assertion.assertion },
      token,
    );
    this.deps.cache?.update(usedId, { state: 'revoked' });
    return result;
  }

  /** The 12 words behind a fresh local ceremony; wallet-api is not involved. */
  async exportMnemonic(credentialId?: Uint8Array): Promise<string[]> {
    const active = this.deps.cache?.list().filter((entry) => entry.state === 'active') ?? [];
    if (!credentialId && active.length > 1) {
      throw new WalletError('credential-ambiguous', 'Pass the passkey to export when several are stored');
    }
    const pinned = credentialId ?? (active.length === 1 ? base64UrlDecode(active[0].credentialId) : undefined);
    const assertion = await this.deps.ceremonies.assert(pinned ? { credentialId: pinned } : {});
    if (!assertion.prfOutput) throw new WalletError('prf-unavailable', 'The passkey cannot derive the seed');
    if (pinned && !equalBytes(assertion.credentialId, pinned)) {
      throw new WalletError('credential-mismatch', 'The authenticator returned a different passkey');
    }

    const keys = this.keysFromPrf(assertion.prfOutput);
    try {
      const id = base64UrlEncode(assertion.credentialId);
      const expected = this.deps.cache?.list().find((entry) => entry.credentialId === id)?.seedCheckAddress;
      if (expected && !this.matchesSeedCheck(keys, expected)) {
        throw new WalletError('seed-mismatch', 'The passkey does not match the stored wallet');
      }
      return keys.mnemonic().split(' ');
    } finally {
      keys.wipe();
    }
  }

  // ----------------------------------------------------------------------------------------------------------

  private async authenticate(
    credentialId: Uint8Array | undefined,
    continueCeremony: boolean,
  ): Promise<{ session: WalletSessionResponse; assertion: SeedAssertion }> {
    const options = await this.deps.api.authenticateBegin(credentialId ? base64UrlEncode(credentialId) : undefined);
    if (options.rpId !== undefined) this.checkRpId(options.rpId);
    const assertion = await this.deps.ceremonies.assert({
      challenge: base64UrlDecode(options.challenge),
      credentialId,
      continueCeremony,
    });
    if (credentialId && !equalBytes(assertion.credentialId, credentialId)) {
      throw new WalletError('credential-mismatch', 'The authenticator returned a different passkey');
    }
    try {
      const session = await this.deps.api.authenticateFinish({
        challengeId: options.challengeId,
        response: assertion.assertion,
      });
      return { session, assertion };
    } catch (error) {
      throw this.refusal(error, assertion.credentialId);
    }
  }

  /**
   * register/finish failed. Only a lost answer (network error / status 0, timeout 408, 5xx) or a 409
   * `PasskeyCredentialAlreadyRegistered` may mean the finish was stored: then the new credential logs in once.
   * Every other answer is a definitive refusal (e.g. 409 `CrossDeviceRegistration`): the new credential is
   * dropped and the error stands. If the login retry finds the credential unknown, it is dropped as well and the
   * original error stands.
   */
  private async recoverRegistration(
    error: unknown,
    created: CreatedSeedPasskey,
    pending: PendingSeedPasskey,
  ): Promise<WalletSessionResponse> {
    if (!mayHaveBeenStored(error)) {
      await pending.abort();
      throw error;
    }
    try {
      return (await this.authenticate(created.credentialId, true)).session;
    } catch (retryError) {
      const unknown =
        retryError instanceof PasskeyRefusedError && retryError.refusal.code === 'PasskeyCredentialNotFound';
      if (unknown) {
        await pending.abort();
        throw error;
      }
      throw retryError;
    }
  }

  private async trySync(
    token: string,
    keys: KeyRing,
    families: WalletFamilies,
    stored: WalletAddress[],
  ): Promise<{ addresses: WalletAddress[]; addressSyncError?: unknown }> {
    const progress = [...stored];
    try {
      await this.upsertMissing(token, keys, families, progress);
      return { addresses: progress };
    } catch (addressSyncError) {
      // A failed upsert may still have been stored (lost answer): re-read the server state. If that fails too,
      // the list holds every upsert that was confirmed before the failure.
      try {
        const current = await this.deps.api.addresses(token);
        return { addresses: Array.isArray(current) ? current : progress, addressSyncError };
      } catch {
        return { addresses: progress, addressSyncError };
      }
    }
  }

  /** Upserts the missing addresses into `result` one by one, so a failure leaves the progress made so far. */
  private async upsertMissing(
    token: string,
    keys: KeyRing,
    enabled: WalletFamilies,
    result: WalletAddress[],
  ): Promise<void> {
    for (const wanted of this.localAddresses(keys, enabled)) {
      if (result.some((entry) => sameAddress(entry, wanted))) continue;
      const saved = await this.deps.api.upsertAddress(wanted, token);
      const index = result.findIndex((entry) => entry.chain === wanted.chain);
      const record: WalletAddress =
        saved && typeof saved === 'object' && typeof saved.address === 'string'
          ? saved
          : { chain: wanted.chain, address: wanted.address };
      if (index >= 0) result[index] = record;
      else result.push(record);
    }
  }

  private localAddresses(keys: KeyRing, families: WalletFamilies): WalletUpsertAddressRequest[] {
    const addresses: WalletUpsertAddressRequest[] = [];
    if (families.bitcoin) addresses.push({ chain: 'bitcoin', address: keys.bitcoinAddress(0, 0).address });
    if (families.evm) addresses.push({ chain: 'ethereum', address: keys.evm(0).address });
    if (families.spark) addresses.push({ chain: 'spark', address: keys.sparkIdentity().address });
    return addresses;
  }

  /**
   * A stored address that this seed would have registered but does not match: a Bitcoin address of this
   * network that is not receive index 0, or another EVM account 0 / Spark identity. Every family is checked,
   * whether or not `wallet/config` enables it: a disabled family's key is derived only for this comparison (and
   * only when wallet-api holds an address of it), never registered. Each key is derived at most once.
   */
  private foreignAddress(stored: WalletAddress[], keys: KeyRing): WalletAddress | undefined {
    let bitcoin: string | undefined;
    let evm: string | undefined;
    let spark: string | undefined;
    return stored.find((entry) => {
      switch (entry.chain) {
        case 'bitcoin':
          if (!isOnNetwork(entry.address, this.bitcoinNetwork)) return false;
          bitcoin ??= keys.bitcoinAddress(0, 0).address;
          return entry.address !== bitcoin;
        case 'ethereum':
          evm ??= keys.evm(0).address;
          return !seedCheck(evm, entry.address);
        case 'spark':
          spark ??= keys.sparkIdentity().address;
          return entry.address !== spark;
        default:
          return false;
      }
    });
  }

  /**
   * The seed check address of an enabled family, preferring Bitcoin receive index 0, then EVM account 0, then the
   * Spark identity. Undefined when no family is enabled; nothing is derived then.
   */
  private seedCheckAddress(keys: KeyRing, families: WalletFamilies): string | undefined {
    if (families.bitcoin) return keys.bitcoinAddress(0, 0).address;
    if (families.evm) return keys.evm(0).address;
    if (families.spark) return keys.sparkIdentity().address;
    return undefined;
  }

  /**
   * The cache holds Bitcoin receive index 0, EVM account 0 (`0x…`, also older entries) or the Spark identity
   * (`spark1…`), whichever family was enabled first; only that family is derived.
   */
  private matchesSeedCheck(keys: KeyRing, expected: string): boolean {
    if (/^0x/i.test(expected)) return seedCheck(keys.evm(0).address, expected);
    if (/^spark1/i.test(expected)) return expected === keys.sparkIdentity().address;
    return expected === keys.bitcoinAddress(0, 0).address;
  }

  private refusal(error: unknown, credentialId: Uint8Array): unknown {
    if (!(error instanceof ApiException)) return error;
    const code = error.code ?? error.message;
    if (error.statusCode === 401 && code === 'PasskeyCredentialRevoked') {
      this.deps.cache?.update(base64UrlEncode(credentialId), { state: 'revoked' });
    }
    if (
      (error.statusCode === 401 && code === 'PasskeyCredentialRevoked') ||
      (error.statusCode === 404 && code === 'PasskeyCredentialNotFound')
    ) {
      return new PasskeyRefusedError({ statusCode: error.statusCode, code, message: error.message });
    }
    return error;
  }

  private keysFromPrf(prfOutput: Uint8Array): KeyRing {
    return KeyRing.fromMnemonic(mnemonicFromPrfV1(prfOutput), {
      bitcoinNetwork: this.bitcoinNetwork,
      env: this.deps.env,
      regtestEnvs: this.deps.regtestEnvs,
    });
  }

  private cacheCredential(
    credentialId: Uint8Array,
    keys: KeyRing,
    families: WalletFamilies,
    backupEligible?: boolean,
  ): void {
    if (!this.deps.cache) return;
    const id = base64UrlEncode(credentialId);
    const existing = this.deps.cache.list().find((entry) => entry.credentialId === id);
    this.deps.cache.put({
      credentialId: id,
      rpId: RP_IDS[this.deps.env],
      state: 'active',
      seedCheckAddress: this.seedCheckAddress(keys, families) ?? existing?.seedCheckAddress,
      backupEligible: backupEligible ?? existing?.backupEligible,
      createdAt: existing?.createdAt ?? Date.now(),
    });
  }

  private checkRpId(rpId: string): void {
    if (rpId !== RP_IDS[this.deps.env]) {
      throw new WalletError(
        'wrong-origin',
        `The server expects RP ID ${rpId}, this wallet uses ${RP_IDS[this.deps.env]}`,
      );
    }
  }

  private async confirmOrAbort(pending: PendingSeedPasskey): Promise<CreatedSeedPasskey> {
    try {
      return await pending.confirm();
    } catch (error) {
      await pending.abort();
      throw error;
    }
  }
}

function normalizeFamilies(families: Partial<WalletFamilies> | undefined): WalletFamilies {
  return { bitcoin: families?.bitcoin === true, spark: families?.spark === true, evm: families?.evm === true };
}

/**
 * Whether a failed register/finish may still have been stored: no answer at all (network error, status 0), a
 * timeout (408), a server error (5xx), or 409 `PasskeyCredentialAlreadyRegistered`. Any other answer, including
 * 409 `CrossDeviceRegistration`, is a definitive refusal.
 */
function mayHaveBeenStored(error: unknown): boolean {
  if (!(error instanceof ApiException)) return true;
  const status = error.statusCode;
  if (status === 0 || status === 408 || status >= 500) return true;
  return status === 409 && error.code === 'PasskeyCredentialAlreadyRegistered';
}

const BECH32_PREFIX: Readonly<Record<BitcoinNetwork, string>> = { mainnet: 'bc1', testnet4: 'tb1', regtest: 'bcrt1' };

function isOnNetwork(address: string, network: BitcoinNetwork): boolean {
  return typeof address === 'string' && address.toLowerCase().startsWith(BECH32_PREFIX[network]);
}

function sameAddress(stored: WalletAddress, wanted: { chain: WalletChainId; address: string }): boolean {
  if (stored.chain !== wanted.chain || typeof stored.address !== 'string') return false;
  return wanted.chain === 'ethereum'
    ? stored.address.toLowerCase() === wanted.address.toLowerCase()
    : stored.address === wanted.address;
}
