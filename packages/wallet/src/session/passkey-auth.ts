import type { DfxApiClient, PasskeyAddress, PasskeyWallet } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import type { WalletEnv } from '../config/environment';
import { RP_IDS, WALLET_NETWORKS } from '../config/environment';
import { CredentialCache } from '../passkey/credential-cache';
import type { PasskeyCeremonies } from '../passkey/ceremonies';
import { base64UrlDecode, base64UrlEncode } from '../util/bytes';
import { WalletError } from '../util/errors';
import { KeyRing } from '../derivation/keyring';
import { seedPublicData } from '../derivation/public-data';
import { mnemonicFromPrfV1 } from '../derivation/v1';
import { seedCheck } from '../derivation/seed-check';
import { LoginAutoSigner } from '../signing/auto-signer';
import { buildLoginMessage } from '../signing/login-messages';

/** Wallet states the flows produce (§8.2). */
export type WalletState = 'locked' | 'unlocked' | 'seed-mismatch' | 'compromised' | 'open-elsewhere';

/** Result of a passkey flow: the in-memory account token, the server wallet view and, when verified, the keys. */
export interface AuthResult {
  accessToken: string;
  wallet: PasskeyWallet;
  keys?: KeyRing;
  state: WalletState;
}

/** A server refusal (403 body code), e.g. `CredentialCompromised` or `CredentialLost`. */
export interface PasskeyRefusal {
  statusCode: number;
  code?: string;
  message: string;
}

export class PasskeyRefusedError extends WalletError {
  constructor(readonly refusal: PasskeyRefusal) {
    super('passkey-refused', refusal.message);
  }
}

export interface RegisterExtras {
  language?: string;
  usedRef?: string;
  recommendationCode?: string;
  specialCode?: string;
}

export interface PasskeyAuthDeps {
  api: DfxApiClient;
  ceremonies: PasskeyCeremonies;
  env: WalletEnv;
  cache?: CredentialCache;
}

function keysFromPrf(prfOutput: Uint8Array, env: WalletEnv): KeyRing {
  return KeyRing.fromMnemonic(mnemonicFromPrfV1(prfOutput), { bitcoinNetwork: WALLET_NETWORKS[env].bitcoin });
}

/**
 * The passkey account flows (§8): register, login, unlock, claim, link, revoke and the seed export. The
 * account token never leaves memory; the seed is derived only from a PRF output of a ceremony of this
 * device and only accepted after the seed check against the server value (§6.3).
 */
export class PasskeyAuth {
  constructor(private readonly deps: PasskeyAuthDeps) {}

  /** Registers a new passkey wallet (2-tap ceremony, seed proof for EVM and Spark, D22). */
  async register(extras?: RegisterExtras): Promise<AuthResult> {
    const challenge = await this.deps.api.passkey.registerBegin();
    this.checkRpId(challenge.rpId);

    const excludeIds = (await this.activeExcludeIds()).map((id) => base64UrlDecode(id));
    const pending = await this.deps.ceremonies.createCredential({
      challenge: base64UrlDecode(challenge.challenge),
      excludeCredentialIds: excludeIds,
    });
    const created = await pending.confirm();

    const keys = keysFromPrf(created.prfOutput, this.deps.env);
    const proof = this.seedProof(keys);

    const response = await this.deps.api.passkey.registerFinish({
      challengeId: challenge.challengeId,
      credential: created.attestation,
      userHandle: base64UrlEncode(created.userHandle),
      derivationVersion: 'V1',
      ...proof,
      ...extras,
    });

    this.cacheWallet(response.wallet, keys);
    return { accessToken: response.accessToken, wallet: response.wallet, keys, state: 'unlocked' };
  }

  /** Logs in (§8.4): the assertion authenticates; the PRF output unlocks the seed. Without PRF the session
   * stays locked (D17); a different seed is a hard mismatch, never signed around. */
  async login(): Promise<AuthResult> {
    const challenge = await this.deps.api.passkey.authenticateBegin();
    this.checkRpId(challenge.rpId);

    const assertion = await this.deps.ceremonies.assert({ challenge: base64UrlDecode(challenge.challenge) });
    const response = await this.finishAuthentication(challenge.challengeId, assertion.assertion);

    if (!assertion.prfOutput) {
      return { ...response, state: 'locked' };
    }

    const keys = keysFromPrf(assertion.prfOutput, this.deps.env);
    const state: WalletState = seedCheck(keys.evm(0).address, response.wallet.seedCheckAddress)
      ? 'unlocked'
      : 'seed-mismatch';
    if (state === 'unlocked') this.cacheWallet(response.wallet, keys);
    return { ...response, keys, state };
  }

  /** Unlocks an already authenticated session with a fresh PRF assertion (§6.2, §11.4). */
  async unlock(): Promise<{ keys?: KeyRing; state: WalletState }> {
    const cached = this.deps.cache
      ?.list()
      .filter((entry) => entry.state === 'active' && entry.publicData)
      .map((entry) => entry.publicData!.seedCheckAddress);
    const expected = cached?.[cached.length - 1];

    const assertion = await this.deps.ceremonies.assert({});
    if (!assertion.prfOutput) return { state: 'locked' };

    const keys = keysFromPrf(assertion.prfOutput, this.deps.env);
    if (expected !== undefined && !seedCheck(keys.evm(0).address, expected)) return { keys, state: 'seed-mismatch' };
    return { keys, state: 'unlocked' };
  }

  /** Claims a passkey for an existing account with a fresh (≤ 300 s) login token (§8.6). */
  async claim(freshLoginToken: string): Promise<AuthResult> {
    const challenge = await this.deps.api.passkey.claimBegin(freshLoginToken);
    this.checkRpId(challenge.rpId);

    const pending = await this.deps.ceremonies.createCredential({
      challenge: base64UrlDecode(challenge.challenge),
    });
    const created = await pending.confirm();

    const keys = keysFromPrf(created.prfOutput, this.deps.env);
    const response = await this.deps.api.passkey.claimFinish(
      {
        challengeId: challenge.challengeId,
        credential: created.attestation,
        userHandle: base64UrlEncode(created.userHandle),
        derivationVersion: 'V1',
        ...this.seedProof(keys),
      },
      freshLoginToken,
    );

    this.cacheWallet(response.wallet, keys);
    return { accessToken: response.accessToken, wallet: response.wallet, keys, state: 'unlocked' };
  }

  /** Links another derived address of the unlocked wallet (§8.5); EVM index i or the Bitcoin login address. */
  async link(
    family: 'evm' | 'bitcoin',
    accessToken: string,
    keys: KeyRing,
    evmIndex = 0,
  ): Promise<{ accessToken: string; address: PasskeyAddress }> {
    const address = family === 'evm' ? keys.evm(evmIndex).address : keys.bitcoinAddress(0, 0).address;
    const signer = new LoginAutoSigner(keys, this.deps.env);
    const signature = signer.sign(family, address, buildLoginMessage(this.deps.env, address));

    const response = await this.deps.api.passkey.link(
      {
        address,
        signature,
        family: family === 'evm' ? 'Evm' : 'Bitcoin',
        path: family === 'evm' ? keys.evm(evmIndex).path : keys.bitcoinAddress(0, 0).path,
      },
      accessToken,
    );
    return { accessToken: response.accessToken, address: response.address };
  }

  /** Revokes the wallet by proving the credential one last time (D11). */
  async revoke(reason: 'Lost' | 'Compromised'): Promise<PasskeyWallet> {
    const challenge = await this.deps.api.passkey.revokeBegin();
    this.checkRpId(challenge.rpId);
    const assertion = await this.deps.ceremonies.assert({ challenge: base64UrlDecode(challenge.challenge) });

    const wallet = await this.deps.api.passkey.revokeFinish({
      challengeId: challenge.challengeId,
      credential: assertion.assertion,
      reason,
    });
    this.deps.cache?.update(base64UrlEncode(assertion.credentialId), { state: 'revoked' });
    return wallet;
  }

  /** The 12 words, only behind a fresh local challenge (G5); the server is never involved. */
  async exportMnemonic(): Promise<string[]> {
    const assertion = await this.deps.ceremonies.assert({});
    if (!assertion.prfOutput) throw new WalletError('prf-unavailable', 'The passkey cannot derive the seed');
    return mnemonicFromPrfV1(assertion.prfOutput).split(' ');
  }

  /** Reduced D14 check: the server records of this wallet must match the local derivations. */
  verifyServerAddresses(wallet: PasskeyWallet, keys: KeyRing): { address: string; family: string; matches: boolean }[] {
    const local = new Map<string, boolean>();
    local.set(keys.evm(0).address.toLowerCase(), true);
    local.set(keys.bitcoinAddress(0, 0).address.toLowerCase(), true);
    local.set(keys.sparkIdentity().address.toLowerCase(), true);
    for (let index = 1; index < 20; index++) local.set(keys.evm(index).address.toLowerCase(), true);

    return wallet.addresses.map((record) => ({
      address: record.address,
      family: record.family,
      matches: local.get(record.address.toLowerCase()) === true,
    }));
  }

  private async finishAuthentication(
    challengeId: string,
    assertion: Record<string, unknown>,
  ): Promise<{ accessToken: string; wallet: PasskeyWallet }> {
    try {
      return await this.deps.api.passkey.authenticateFinish({ challengeId, credential: assertion });
    } catch (error) {
      if (error instanceof ApiException && error.statusCode === 403) {
        throw new PasskeyRefusedError({ statusCode: 403, code: error.code, message: error.message });
      }
      throw error;
    }
  }

  /** The registration seed proof: EVM seed check address with EIP-191 and the Spark identity with D31. */
  private seedProof(keys: KeyRing): {
    address: string;
    signature: string;
    sparkAddress: string;
    sparkSignature: string;
  } {
    const signer = new LoginAutoSigner(keys, this.deps.env);
    const address = keys.evm(0).address;
    const sparkAddress = keys.sparkIdentity().address;
    return {
      address,
      signature: signer.sign('evm', address, buildLoginMessage(this.deps.env, address)),
      sparkAddress,
      sparkSignature: signer.sign('spark', sparkAddress, buildLoginMessage(this.deps.env, sparkAddress)),
    };
  }

  private async activeExcludeIds(): Promise<string[]> {
    const cache = this.deps.cache;
    if (!cache) return [];
    const ids = cache.activeIds();
    if (ids.length === 0) return [];
    try {
      const statuses = await this.deps.api.passkey.credentialStatus(ids.slice(0, 10));
      const known = new Set(statuses.filter((s) => s.status !== 'Unknown').map((s) => s.credentialId));
      return ids.filter((id) => known.has(id));
    } catch {
      return ids;
    }
  }

  private checkRpId(rpId: string): void {
    if (rpId !== RP_IDS[this.deps.env]) {
      throw new WalletError(
        'wrong-origin',
        `The server expects RP ID ${rpId}, this wallet uses ${RP_IDS[this.deps.env]}`,
      );
    }
  }

  private cacheWallet(wallet: PasskeyWallet, keys: KeyRing): void {
    this.deps.cache?.put({
      credentialId: wallet.credentialId,
      rpId: RP_IDS[this.deps.env],
      state: wallet.status === 'Active' ? 'active' : 'revoked',
      seedCheckAddress: wallet.seedCheckAddress,
      publicData: seedPublicData(keys),
      backupEligible: wallet.backupEligible,
      createdAt: Date.now(),
    });
  }
}
