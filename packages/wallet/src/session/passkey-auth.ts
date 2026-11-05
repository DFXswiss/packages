import type { DfxApiClient, PasskeyAddress, PasskeyWallet } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import type { WalletEnv } from '../config/environment';
import { RP_IDS, SIGN_MESSAGE_PREFIX, WALLET_NETWORKS } from '../config/environment';
import { CredentialCache } from '../passkey/credential-cache';
import type { CreatedSeedPasskey, PasskeyCeremonies, PendingSeedPasskey } from '../passkey/ceremonies';
import { base64UrlDecode, base64UrlEncode, equalBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import { KeyRing, withPrivateKey } from '../derivation/keyring';
import { seedPublicData } from '../derivation/public-data';
import { mnemonicFromPrfV1 } from '../derivation/v1';
import { seedCheck } from '../derivation/seed-check';
import { LoginAutoSigner, signEip191 } from '../signing/auto-signer';
import { LOGIN_TEMPLATES, buildLoginMessage } from '../signing/login-messages';

/** Wallet states the flows produce (§8.2). */
export type WalletState = 'locked' | 'unlocked' | 'seed-mismatch' | 'compromised' | 'open-elsewhere';

/**
 * Result of a passkey flow: the in-memory account token and the server wallet view. `keys` is set
 * whenever the ceremony returned PRF output, including a seed mismatch, so the caller can show the
 * derived address. `state` is `unlocked` only after the seed check passes.
 */
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
  mail: string;
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

function releaseNothing(): void {
  return undefined;
}

/** Mainnet BIP-84 receive index 0. A testnet ring keeps its receive keys and lends a wiped login ring. */
function bitcoinLoginRing(keys: KeyRing): { ring: KeyRing; release: () => void } {
  if (keys.bitcoinNetwork === 'mainnet') return { ring: keys, release: releaseNothing };
  const ring = KeyRing.fromMnemonic(keys.mnemonic(), { bitcoinNetwork: 'mainnet' });
  return { ring, release: () => ring.wipe() };
}

/**
 * The passkey account flows (§8): register, login, unlock, claim, link, revoke and the seed export. The
 * account token never leaves memory; the seed is derived only from a PRF output of a ceremony of this
 * device and only accepted after the seed check against the server value (§6.3).
 */
export class PasskeyAuth {
  constructor(private readonly deps: PasskeyAuthDeps) {}

  /** Registers a new passkey wallet (2-tap ceremony, seed proof for EVM and Spark, D22). */
  async register(extras: RegisterExtras): Promise<AuthResult> {
    const challenge = await this.deps.api.passkey.registerBegin();
    this.checkRpId(challenge.rpId);

    const excludeIds = (await this.activeExcludeIds()).map((id) => base64UrlDecode(id));
    const pending = await this.deps.ceremonies.createCredential({
      challenge: base64UrlDecode(challenge.challenge),
      excludeCredentialIds: excludeIds,
    });
    const created = await this.confirmOrAbort(pending);

    const keys = keysFromPrf(created.prfOutput, this.deps.env);
    const proof = this.seedProof(keys);
    const finish = (challengeId: string, assertion: Record<string, unknown>) =>
      this.deps.api.passkey.registerFinish({
        challengeId,
        credential: created.attestation,
        userHandle: base64UrlEncode(created.userHandle),
        derivationVersion: 'V1',
        assertion,
        ...proof,
        ...extras,
      });

    let response: { accessToken: string; wallet: PasskeyWallet };
    try {
      response = await finish(challenge.challengeId, created.assertion);
    } catch (error) {
      if (this.isDefinitiveRejection(error)) {
        await pending.abort();
        throw error;
      }
      try {
        // The original attestation stays. Only the new assertion is bound to the retry challenge.
        const retry = await this.deps.api.passkey.registerBegin();
        this.checkRpId(retry.rpId);
        const assertion = await this.deps.ceremonies.assert({
          challenge: base64UrlDecode(retry.challenge),
          credentialId: created.credentialId,
          continueCeremony: true,
        });
        response = await finish(retry.challengeId, assertion.assertion);
      } catch (retryError) {
        // AddressExists means the lost finish was stored. Any other 4xx was not.
        if (this.isDefinitiveRejection(retryError) && !this.isAddressExists(retryError)) await pending.abort();
        throw retryError;
      }
    }

    this.cacheWallet(response.wallet, keys, created.credentialId);
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
    if (state === 'unlocked') this.cacheWallet(response.wallet, keys, assertion.credentialId);
    return { ...response, keys, state };
  }

  /** Unlocks an already authenticated session with a fresh PRF assertion (§6.2, §11.4). */
  async unlock(): Promise<{ keys?: KeyRing; state: WalletState }> {
    const assertion = await this.deps.ceremonies.assert({});
    if (!assertion.prfOutput) return { state: 'locked' };

    const credentialId = base64UrlEncode(assertion.credentialId);
    const entry = this.deps.cache?.list().find((candidate) => candidate.credentialId === credentialId);
    if (!entry || entry.state !== 'active' || !entry.publicData) return { state: 'locked' };

    const keys = keysFromPrf(assertion.prfOutput, this.deps.env);
    if (!seedCheck(keys.evm(0).address, entry.publicData.seedCheckAddress)) return { keys, state: 'seed-mismatch' };
    return { keys, state: 'unlocked' };
  }

  /** Claims a passkey for an existing account with a fresh (≤ 300 s) login token (§8.6). */
  async claim(freshLoginToken: string): Promise<AuthResult> {
    const challenge = await this.deps.api.passkey.claimBegin(freshLoginToken);
    this.checkRpId(challenge.rpId);

    const pending = await this.deps.ceremonies.createCredential({
      challenge: base64UrlDecode(challenge.challenge),
    });
    const created = await this.confirmOrAbort(pending);

    const keys = keysFromPrf(created.prfOutput, this.deps.env);
    const proof = this.seedProof(keys);
    const finish = (
      challengeId: string,
      assertion: Record<string, unknown>,
      signatures: { signature: string; sparkSignature: string },
    ) =>
      this.deps.api.passkey.claimFinish(
        {
          challengeId,
          credential: created.attestation,
          userHandle: base64UrlEncode(created.userHandle),
          derivationVersion: 'V1',
          assertion,
          address: proof.address,
          sparkAddress: proof.sparkAddress,
          ...signatures,
        },
        freshLoginToken,
      );

    const originalSignatures = { signature: proof.signature, sparkSignature: proof.sparkSignature };

    // The server already has this address, so the credential stays. A later 4xx is not a delete.
    const claimWithNewSignature = async (): Promise<{ accessToken: string; wallet: PasskeyWallet }> => {
      const retry = await this.deps.api.passkey.claimBegin(freshLoginToken);
      this.checkRpId(retry.rpId);
      const assertion = await this.deps.ceremonies.assert({
        challenge: base64UrlDecode(retry.challenge),
        credentialId: created.credentialId,
        continueCeremony: true,
      });
      const claimText =
        SIGN_MESSAGE_PREFIX[this.deps.env] +
        LOGIN_TEMPLATES.general +
        'passkey-claim\n' +
        retry.challenge +
        '\n' +
        proof.address;
      const signature = withPrivateKey(keys, { family: 'evm', index: 0 }, (privateKey) =>
        signEip191(claimText, privateKey),
      );
      return finish(retry.challengeId, assertion.assertion, {
        signature,
        sparkSignature: proof.sparkSignature,
      });
    };

    let response: { accessToken: string; wallet: PasskeyWallet };
    try {
      response = await finish(challenge.challengeId, created.assertion, originalSignatures);
    } catch (error) {
      if (this.isAddressExists(error)) {
        response = await claimWithNewSignature();
      } else if (this.isDefinitiveRejection(error)) {
        await pending.abort();
        throw error;
      } else {
        try {
          const retry = await this.deps.api.passkey.claimBegin(freshLoginToken);
          this.checkRpId(retry.rpId);
          const assertion = await this.deps.ceremonies.assert({
            challenge: base64UrlDecode(retry.challenge),
            credentialId: created.credentialId,
            continueCeremony: true,
          });
          response = await finish(retry.challengeId, assertion.assertion, originalSignatures);
        } catch (retryError) {
          if (this.isAddressExists(retryError)) {
            response = await claimWithNewSignature();
          } else if (this.isDefinitiveRejection(retryError)) {
            await pending.abort();
            throw retryError;
          } else {
            throw retryError;
          }
        }
      }
    }

    this.cacheWallet(response.wallet, keys, created.credentialId);
    return { accessToken: response.accessToken, wallet: response.wallet, keys, state: 'unlocked' };
  }

  /**
   * Links another derived address of the unlocked wallet (§8.5): an EVM index, or the Bitcoin login
   * address. That login address is mainnet BIP-84 receive index 0 in every environment.
   */
  async link(
    family: 'evm' | 'bitcoin',
    accessToken: string,
    keys: KeyRing,
    evmIndex = 0,
  ): Promise<{ accessToken: string; address: PasskeyAddress }> {
    const login = family === 'bitcoin' ? bitcoinLoginRing(keys) : { ring: keys, release: releaseNothing };
    try {
      const address = family === 'evm' ? login.ring.evm(evmIndex).address : login.ring.bitcoinAddress(0, 0).address;
      const signer = new LoginAutoSigner(login.ring, this.deps.env);
      const signature = signer.sign(family, address, buildLoginMessage(this.deps.env, address));

      const response = await this.deps.api.passkey.link(
        {
          address,
          signature,
          family: family === 'evm' ? 'Evm' : 'Bitcoin',
          path: family === 'evm' ? login.ring.evm(evmIndex).path : login.ring.bitcoinAddress(0, 0).path,
        },
        accessToken,
      );
      return { accessToken: response.accessToken, address: response.address };
    } finally {
      login.release();
    }
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

  /**
   * The 12 words, only behind a fresh local challenge (G5); the server is never involved.
   * One stored active passkey is pinned. Several stored passkeys need `credentialId`, so the
   * authenticator cannot return another wallet. No stored passkey stays discoverable.
   */
  async exportMnemonic(credentialId?: Uint8Array): Promise<string[]> {
    const pinned = credentialId ?? this.onlyActiveCredentialId();
    const assertion = await this.deps.ceremonies.assert(pinned ? { credentialId: pinned } : {});
    if (!assertion.prfOutput) throw new WalletError('prf-unavailable', 'The passkey cannot derive the seed');
    if (pinned && !equalBytes(assertion.credentialId, pinned)) {
      throw new WalletError('credential-mismatch', 'The authenticator returned a different passkey');
    }

    const keys = keysFromPrf(assertion.prfOutput, this.deps.env);
    try {
      const id = base64UrlEncode(assertion.credentialId);
      const expected = this.deps.cache?.list().find((entry) => entry.credentialId === id)?.publicData?.seedCheckAddress;
      if (expected && !seedCheck(keys.evm(0).address, expected)) {
        throw new WalletError('seed-mismatch', 'The passkey does not match the stored wallet');
      }
      return keys.mnemonic().split(' ');
    } finally {
      keys.wipe();
    }
  }

  /** Server records must match family, path and address of the local derivations (Bitcoin login, Spark, EVM 0..99). */
  verifyServerAddresses(wallet: PasskeyWallet, keys: KeyRing): { address: string; family: string; matches: boolean }[] {
    const login = bitcoinLoginRing(keys);
    try {
      const local = new Map<string, { family: PasskeyAddress['family']; path: string }>();
      const bitcoin = login.ring.bitcoinAddress(0, 0);
      local.set(bitcoin.address.toLowerCase(), { family: 'Bitcoin', path: bitcoin.path });
      const spark = login.ring.sparkIdentity();
      local.set(spark.address.toLowerCase(), { family: 'Spark', path: spark.path });
      for (let index = 0; index < 100; index++) {
        const account = login.ring.evm(index);
        local.set(account.address.toLowerCase(), { family: 'Evm', path: account.path });
      }

      return wallet.addresses.map((record) => {
        const expected = local.get(record.address.toLowerCase());
        return {
          address: record.address,
          family: record.family,
          matches: expected !== undefined && expected.family === record.family && expected.path === record.path,
        };
      });
    } finally {
      login.release();
    }
  }

  /** The one active passkey on this origin. Several active passkeys are not a guess. */
  private onlyActiveCredentialId(): Uint8Array | undefined {
    const active = this.deps.cache?.list().filter((entry) => entry.state === 'active') ?? [];
    if (active.length > 1) {
      throw new WalletError('credential-ambiguous', 'Pass the passkey to export when several are stored');
    }
    if (active.length === 0) return undefined;
    return base64UrlDecode(active[0].credentialId);
  }

  private async finishAuthentication(
    challengeId: string,
    assertion: Record<string, unknown>,
  ): Promise<{ accessToken: string; wallet: PasskeyWallet }> {
    try {
      return await this.deps.api.passkey.authenticateFinish({ challengeId, credential: assertion });
    } catch (error) {
      if (error instanceof ApiException && error.statusCode === 403) {
        throw new PasskeyRefusedError({ statusCode: 403, code: error.code ?? error.message, message: error.message });
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

  /** Server accepts at most ten ids per status call; anything past that must be a later request. */
  private async activeExcludeIds(): Promise<string[]> {
    const cache = this.deps.cache;
    if (!cache) return [];
    const ids = cache.activeIds();
    if (ids.length === 0) return [];
    try {
      const known = new Set<string>();
      for (let offset = 0; offset < ids.length; offset += 10) {
        const statuses = await this.deps.api.passkey.credentialStatus(ids.slice(offset, offset + 10));
        for (const status of statuses) {
          if (status.status !== 'Unknown') known.add(status.credentialId);
        }
      }
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

  private async confirmOrAbort(pending: PendingSeedPasskey): Promise<CreatedSeedPasskey> {
    try {
      return await pending.confirm();
    } catch (error) {
      await pending.abort();
      throw error;
    }
  }

  private isAddressExists(error: unknown): boolean {
    return (
      error instanceof ApiException &&
      error.statusCode === 409 &&
      (error.code === 'AddressExists' || error.message === 'AddressExists')
    );
  }

  private isDefinitiveRejection(error: unknown): boolean {
    return error instanceof ApiException && error.statusCode >= 400 && error.statusCode < 500;
  }

  private cacheWallet(wallet: PasskeyWallet, keys: KeyRing, credentialId: Uint8Array): void {
    this.deps.cache?.put({
      credentialId: base64UrlEncode(credentialId),
      rpId: RP_IDS[this.deps.env],
      state: wallet.status === 'Active' ? 'active' : 'revoked',
      seedCheckAddress: wallet.seedCheckAddress,
      publicData: seedPublicData(keys),
      backupEligible: wallet.backupEligible,
      createdAt: Date.now(),
    });
  }
}
