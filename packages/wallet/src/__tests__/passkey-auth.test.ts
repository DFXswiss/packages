import type { DfxApiClient, PasskeyWallet } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import fixture from './fixtures/derivation-v1.json';
import { SIGN_MESSAGE_PREFIX, type WalletEnv } from '../config/environment';
import { KeyRing, withPrivateKey } from '../derivation/keyring';
import { PasskeyCeremonies } from '../passkey/ceremonies';
import type { CeremonyCredentials, CeremonyWindow } from '../passkey/ceremonies';
import { CredentialCache } from '../passkey/credential-cache';
import { PasskeyAuth, PasskeyRefusedError } from '../session/passkey-auth';
import { signEip191 } from '../signing/auto-signer';
import { LOGIN_TEMPLATES } from '../signing/login-messages';
import { WalletError } from '../util/errors';

const PRF = hexToBytes(fixture.vectors[0].prfOutput);
const OTHER_PRF = hexToBytes(fixture.vectors[1].prfOutput);

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

const CREDENTIAL_ID = new Uint8Array([9, 9, 9]);

class FakeCredentials implements CeremonyCredentials {
  nextCreate: PublicKeyCredential | null = null;
  nextGet: PublicKeyCredential | null = null;
  createHook?: () => void;
  readonly created: CredentialCreationOptions[] = [];
  readonly got: CredentialRequestOptions[] = [];

  async create(options: CredentialCreationOptions): Promise<PublicKeyCredential | null> {
    this.created.push(options);
    this.createHook?.();
    return this.nextCreate;
  }

  async get(options: CredentialRequestOptions): Promise<PublicKeyCredential | null> {
    this.got.push(options);
    return this.nextGet;
  }
}

function fakeCredential(prf: Uint8Array | undefined, id = CREDENTIAL_ID): PublicKeyCredential {
  const authenticatorData = new Uint8Array(37);
  return {
    id: 'test-credential',
    rawId: id.slice().buffer,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: new Uint8Array([1]).buffer,
      attestationObject: new Uint8Array([2]).buffer,
      authenticatorData: authenticatorData.buffer,
      signature: new Uint8Array([3]).buffer,
      userHandle: new Uint8Array(32).fill(1).buffer,
      getTransports: () => ['internal'],
    },
    getClientExtensionResults: () => (prf ? { prf: { results: { first: prf } } } : {}),
  } as unknown as PublicKeyCredential;
}

function fakeWindow(
  activation: { isActive: boolean } = { isActive: true },
): CeremonyWindow & { signalUnknown: jest.Mock } {
  const signalUnknown = jest.fn();
  return {
    location: { hostname: 'app.dfx.swiss' },
    navigator: { userAgent: 'TestBrowser/1.0', userActivation: activation },
    PublicKeyCredential: { signalUnknownCredential: signalUnknown },
    signalUnknown,
  } as CeremonyWindow & { signalUnknown: jest.Mock };
}

function wallet(seedCheckAddress: string): PasskeyWallet {
  return {
    id: 1,
    credentialId: 'Y3JlZGVudGlhbC1pZA',
    status: 'Active',
    created: '2026-10-30T00:00:00.000Z',
    derivationVersion: 'V1',
    seedCheckAddress,
    backupEligible: true,
    backedUp: false,
    backupRequired: false,
    addresses: [],
  };
}

interface ApiBehavior {
  walletSeedCheckAddress?: string;
  authenticateReject?: ApiException;
}

function api(behavior: ApiBehavior = {}): DfxApiClient & {
  registerBegin: jest.Mock;
  registerFinish: jest.Mock;
  authenticateFinish: jest.Mock;
  claimBegin: jest.Mock;
  claimFinish: jest.Mock;
  link: jest.Mock;
  credentialStatus: jest.Mock;
} {
  const challenge = { challengeId: 'c'.repeat(64), challenge: 'A'.repeat(64), rpId: 'app.dfx.swiss', timeout: 600000 };
  const registerBegin = jest.fn(async () => challenge);
  const registerFinish = jest.fn(async () => ({ accessToken: 'register-token', wallet: wallet('pending') }));
  const authenticateFinish = jest.fn(async () => {
    if (behavior.authenticateReject) throw behavior.authenticateReject;
    return { accessToken: 'login-token', wallet: wallet(behavior.walletSeedCheckAddress ?? '') };
  });
  const claimBegin = jest.fn(async () => challenge);
  const claimFinish = jest.fn(async () => ({ accessToken: 'claim-token', wallet: wallet('pending') }));
  const link = jest.fn(async () => ({
    accessToken: 'link-token',
    address: { address: '0x1', family: 'Evm', path: "m/44'/60'/0'/0/0", status: 'Active', blockchains: [] },
  }));
  const credentialStatus = jest.fn(async () => []);
  return {
    passkey: {
      registerBegin,
      registerFinish,
      authenticateBegin: async () => challenge,
      authenticateFinish,
      claimBegin,
      claimFinish,
      link,
      revokeBegin: async () => challenge,
      revokeFinish: async () => wallet('x'),
      credentialStatus,
    },
    registerBegin,
    registerFinish,
    authenticateFinish,
    claimBegin,
    claimFinish,
    link,
    credentialStatus,
  } as never;
}

function auth(
  behavior: ApiBehavior = {},
  credentials = new FakeCredentials(),
): {
  flow: PasskeyAuth;
  credentials: FakeCredentials;
  cache: CredentialCache;
  registerBegin: jest.Mock;
  registerFinish: jest.Mock;
  claimBegin: jest.Mock;
  claimFinish: jest.Mock;
  credentialStatus: jest.Mock;
  signalUnknown: jest.Mock;
  activation: { isActive: boolean };
} {
  const cache = new CredentialCache(new MemoryStorage(), 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
  const client = api(behavior);
  const activation = { isActive: true };
  const win = fakeWindow(activation);
  const flow = new PasskeyAuth({
    api: client,
    ceremonies: new PasskeyCeremonies('prd', credentials, win),
    env: 'prd' as WalletEnv,
    cache,
  });
  return {
    flow,
    credentials,
    cache,
    registerBegin: client.registerBegin,
    registerFinish: client.registerFinish,
    claimBegin: client.claimBegin,
    claimFinish: client.claimFinish,
    credentialStatus: client.credentialStatus,
    signalUnknown: win.signalUnknown,
    activation,
  };
}

/** The create dialog spends the gesture before a later retry can call get(). */
function expireAfterCreate(credentials: FakeCredentials, activation: { isActive: boolean }): void {
  credentials.createHook = () => {
    activation.isActive = false;
  };
}

class MemoryStorage {
  private readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('register', () => {
  it('runs the 2-tap ceremony, proves the seed and unlocks the wallet', async () => {
    const { flow, credentials, cache, registerFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.register({ mail: 'user@example.com' });

    expect(result.state).toBe('unlocked');
    expect(result.accessToken).toBe('register-token');
    expect(result.keys?.evm(0).address).toBe(fixture.vectors[0].evm[0].address);
    expect(result.wallet.seedCheckAddress).toBeTruthy();

    const entry = cache.list().find((e) => e.state === 'active');
    expect(entry?.publicData?.seedCheckAddress).toBe(fixture.vectors[0].evm[0].address);
    expect(entry?.credentialId).toBe(base64url(CREDENTIAL_ID));
    expect(entry?.credentialId).not.toBe('Y3JlZGVudGlhbC1pZA');
    expect(signalUnknown).not.toHaveBeenCalled();

    const createdOptions = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(new Uint8Array(createdOptions.challenge)).toEqual(new Uint8Array(48)); // base64url of 64 'A'

    expect(registerFinish).toHaveBeenCalledWith(
      expect.objectContaining({
        mail: 'user@example.com',
        assertion: expect.objectContaining({ id: 'test-credential' }),
        credential: expect.objectContaining({ id: 'test-credential' }),
      }),
    );

    expect(credentials.got).toHaveLength(1);
    const assertOptions = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(new Uint8Array(assertOptions.challenge as BufferSource)).toEqual(new Uint8Array(48));
    expect(new Uint8Array(assertOptions.allowCredentials![0].id as BufferSource)).toEqual(CREDENTIAL_ID);
  });

  it('unlocks against the credential id cached at register', async () => {
    const { flow, credentials, cache } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    await flow.register({ mail: 'user@example.com' });

    credentials.nextGet = fakeCredential(PRF);
    const result = await flow.unlock();

    expect(result.state).toBe('unlocked');
    const entry = cache.list().find((e) => e.state === 'active');
    expect(entry?.credentialId).toBe(base64url(CREDENTIAL_ID));
  });

  it('aborts the pending credential when registerFinish rejects', async () => {
    const { flow, credentials, cache, registerFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const failure = new ApiException(400, 'Bad Request');
    registerFinish.mockRejectedValueOnce(failure);

    await expect(flow.register({ mail: 'user@example.com' })).rejects.toBe(failure);
    expect(cache.list()).toEqual([]);
    expect(signalUnknown).toHaveBeenCalledWith({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
    });
  });

  it('retries registerBegin and registerFinish once on a lost response and keeps the credential', async () => {
    const { flow, credentials, activation, registerBegin, registerFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    registerBegin
      .mockResolvedValueOnce({
        challengeId: 'c'.repeat(64),
        challenge: 'A'.repeat(64),
        rpId: 'app.dfx.swiss',
        timeout: 600000,
      })
      .mockResolvedValueOnce({
        challengeId: 'd'.repeat(64),
        challenge: 'B'.repeat(64),
        rpId: 'app.dfx.swiss',
        timeout: 600000,
      });
    registerFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));

    const result = await flow.register({ mail: 'user@example.com' });

    expect(result.state).toBe('unlocked');
    expect(registerBegin).toHaveBeenCalledTimes(2);
    expect(registerFinish).toHaveBeenCalledTimes(2);
    const first = registerFinish.mock.calls[0][0] as { challengeId: string; credential: unknown };
    const second = registerFinish.mock.calls[1][0] as { challengeId: string; credential: unknown };
    expect(first.challengeId).toBe('c'.repeat(64));
    expect(second.challengeId).toBe('d'.repeat(64));
    expect(second.credential).toBe(first.credential);
    expect(credentials.got).toHaveLength(2);
    expect(signalUnknown).not.toHaveBeenCalled();
  });

  it('aborts the registration retry when the server rejects it for another reason', async () => {
    const { flow, credentials, activation, registerFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const failure = new ApiException(400, 'Bad Request');
    registerFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));
    registerFinish.mockRejectedValueOnce(failure);

    await expect(flow.register({ mail: 'user@example.com' })).rejects.toBe(failure);
    expect(signalUnknown).toHaveBeenCalledWith({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
    });
  });

  it('keeps the credential when the registration retry reports the address already exists', async () => {
    const { flow, credentials, activation, registerFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const exists = new ApiException(409, 'AddressExists');
    registerFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));
    registerFinish.mockRejectedValueOnce(exists);

    await expect(flow.register({ mail: 'user@example.com' })).rejects.toBe(exists);
    expect(signalUnknown).not.toHaveBeenCalled();
    expect(registerFinish).toHaveBeenCalledTimes(2);
  });

  it('asks credentialStatus in batches of ten and excludes every known id', async () => {
    const { flow, credentials, cache, credentialStatus } = auth();
    const ids = Array.from({ length: 11 }, (_, index) => base64url(new Uint8Array([index + 1])));
    for (const credentialId of ids) {
      cache.put({ credentialId, rpId: 'app.dfx.swiss', state: 'active', createdAt: 1 });
    }
    credentialStatus.mockImplementation(async (batch: string[]) =>
      batch.map((credentialId) => ({ credentialId, status: 'Active' })),
    );
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    await flow.register({ mail: 'user@example.com' });

    expect(credentialStatus).toHaveBeenCalledTimes(2);
    expect(credentialStatus.mock.calls[0][0]).toEqual(ids.slice(0, 10));
    expect(credentialStatus.mock.calls[1][0]).toEqual(ids.slice(10));
    const created = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(created.excludeCredentials).toHaveLength(11);
  });

  it('keeps every cached id in excludeCredentials when credentialStatus fails', async () => {
    const { flow, credentials, cache, credentialStatus } = auth();
    const ids = Array.from({ length: 11 }, (_, index) => base64url(new Uint8Array([index + 1])));
    for (const credentialId of ids) {
      cache.put({ credentialId, rpId: 'app.dfx.swiss', state: 'active', createdAt: 1 });
    }
    credentialStatus.mockRejectedValue(new Error('offline'));
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    await flow.register({ mail: 'user@example.com' });

    expect(credentialStatus).toHaveBeenCalledTimes(1);
    const created = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(created.excludeCredentials).toHaveLength(11);
  });

  it('refuses a server challenge of another RP ID', async () => {
    const broken = api();
    (broken.passkey as unknown as { registerBegin: () => Promise<unknown> }).registerBegin = async () => ({
      challengeId: 'c',
      challenge: 'A'.repeat(64),
      rpId: 'evil.example',
      timeout: 600000,
    });
    const cache = new CredentialCache(new MemoryStorage(), 'k', 'app.dfx.swiss');
    const flow = new PasskeyAuth({
      api: broken,
      ceremonies: new PasskeyCeremonies('prd', new FakeCredentials(), fakeWindow()),
      env: 'prd',
      cache,
    });

    await expect(flow.register({ mail: 'user@example.com' })).rejects.toMatchObject({ code: 'wrong-origin' });
  });
});

describe('login', () => {
  it('unlocks with a verifying PRF output', async () => {
    const { flow, credentials } = auth({ walletSeedCheckAddress: fixture.vectors[0].evm[0].address });
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.login();

    expect(result.state).toBe('unlocked');
    expect(result.accessToken).toBe('login-token');
    expect(result.keys?.mnemonic()).toBe(fixture.vectors[0].mnemonic);
  });

  it('stays locked without PRF (D17)', async () => {
    const { flow, credentials } = auth();
    credentials.nextGet = fakeCredential(undefined);

    const result = await flow.login();

    expect(result.state).toBe('locked');
    expect(result.keys).toBeUndefined();
  });

  it('detects a different seed as a hard mismatch', async () => {
    const { flow, credentials } = auth({ walletSeedCheckAddress: fixture.vectors[0].evm[0].address });
    credentials.nextGet = fakeCredential(OTHER_PRF);

    const result = await flow.login();

    expect(result.state).toBe('seed-mismatch');
    expect(result.keys?.evm(0).address).toBe(fixture.vectors[1].evm[0].address);
  });

  it('surfaces a compromised credential as a typed refusal', async () => {
    const { flow, credentials } = auth({
      authenticateReject: new ApiException(403, 'Credential compromised', 'CredentialCompromised'),
    });
    credentials.nextGet = fakeCredential(PRF);

    await expect(flow.login()).rejects.toBeInstanceOf(PasskeyRefusedError);
  });
});

function cachedPublicData(vector: (typeof fixture.vectors)[number]) {
  return {
    seedCheckAddress: vector.evm[0].address as `0x${string}`,
    evm: [{ index: 0, address: vector.evm[0].address as `0x${string}` }],
    bitcoin: {
      network: 'mainnet' as const,
      xpub: vector.bitcoin.mainnet.xpub,
      fingerprint: vector.masterFingerprint,
      receive0: vector.bitcoin.mainnet.receive[0].address,
    },
    spark: {
      identityPubkey: vector.spark.identityPublicKey,
      address: vector.spark.address,
    },
  };
}

describe('unlock, export and revoke', () => {
  it('unlocks against the cached seed check address', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    cache.put({
      credentialId: 'decoy-credential',
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[1]),
      createdAt: 2,
    });
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.unlock();
    expect(result.state).toBe('unlocked');
    expect(result.keys?.mnemonic()).toBe(fixture.vectors[0].mnemonic);

    credentials.nextGet = fakeCredential(OTHER_PRF);
    const mismatch = await flow.unlock();
    expect(mismatch.state).toBe('seed-mismatch');
  });

  it('stays locked without PRF output', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    credentials.nextGet = fakeCredential(undefined);

    const result = await flow.unlock();
    expect(result.state).toBe('locked');
    expect(result.keys).toBeUndefined();
  });

  it('stays locked when the cache has no matching active credential', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: 'other-id',
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'revoked',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 2,
    });
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.unlock();
    expect(result.state).toBe('locked');
    expect(result.keys).toBeUndefined();
  });

  it('exports the 12 words behind a fresh local challenge', async () => {
    const { flow, credentials } = auth();
    credentials.nextGet = fakeCredential(PRF);

    const words = await flow.exportMnemonic();
    expect(words).toEqual(fixture.vectors[0].mnemonic.split(' '));
    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(options.allowCredentials).toBeUndefined();
  });

  it('pins the only stored passkey when exporting the phrase', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    credentials.nextGet = fakeCredential(PRF);

    const words = await flow.exportMnemonic();

    expect(words).toEqual(fixture.vectors[0].mnemonic.split(' '));
    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(new Uint8Array(options.allowCredentials![0].id as BufferSource)).toEqual(CREDENTIAL_ID);
  });

  it('refuses to guess which passkey to export when several are stored', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    cache.put({
      credentialId: 'decoy-credential',
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[1]),
      createdAt: 2,
    });

    await expect(flow.exportMnemonic()).rejects.toMatchObject({ code: 'credential-ambiguous' });
    expect(credentials.got).toHaveLength(0);
  });

  it('exports the passkey the caller names when several are stored', async () => {
    const { flow, credentials, cache } = auth();
    const chosen = new Uint8Array([7, 7, 7]);
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    cache.put({
      credentialId: base64url(chosen),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[1]),
      createdAt: 2,
    });
    credentials.nextGet = fakeCredential(OTHER_PRF, chosen);

    const words = await flow.exportMnemonic(chosen);

    expect(words).toEqual(fixture.vectors[1].mnemonic.split(' '));
    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(new Uint8Array(options.allowCredentials![0].id as BufferSource)).toEqual(chosen);
  });

  it('refuses an export whose phrase does not match the stored wallet', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });
    credentials.nextGet = fakeCredential(OTHER_PRF);

    await expect(flow.exportMnemonic()).rejects.toMatchObject({ code: 'seed-mismatch' });
  });

  it('refuses the export without PRF', async () => {
    const { flow, credentials } = auth();
    credentials.nextGet = fakeCredential(undefined);

    await expect(flow.exportMnemonic()).rejects.toMatchObject({ code: 'prf-unavailable' });
    expect(new WalletError('prf-unavailable')).toBeInstanceOf(WalletError);
  });

  it('matches a server address only together with its family and path', () => {
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    try {
      const evm = keys.evm(0);
      const { flow } = auth();
      const record = {
        address: evm.address,
        family: 'Evm' as const,
        path: evm.path,
        status: 'Active' as const,
        blockchains: [],
      };
      const rows = flow.verifyServerAddresses(
        {
          ...wallet(evm.address),
          addresses: [record, { ...record, family: 'Bitcoin' }, { ...record, path: "m/44'/60'/0'/0/1" }],
        },
        keys,
      );
      expect(rows.map((row) => row.matches)).toEqual([true, false, false]);
    } finally {
      keys.wipe();
    }
  });

  it('revokes and marks the credential revoked in the cache', async () => {
    const { flow, credentials, cache } = auth();
    credentials.nextGet = fakeCredential(PRF);
    cache.put({ credentialId: base64url(CREDENTIAL_ID), rpId: 'app.dfx.swiss', state: 'active', createdAt: 1 });

    await flow.revoke('Lost');

    expect(cache.list()[0].state).toBe('revoked');
  });
});

describe('claim and link', () => {
  it('claims into an existing account with the fresh login token', async () => {
    const { flow, credentials, claimFinish } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.claim('fresh-token');
    expect(result.state).toBe('unlocked');
    expect(result.accessToken).toBe('claim-token');
    expect(claimFinish).toHaveBeenCalledWith(
      expect.objectContaining({
        assertion: expect.objectContaining({ id: 'test-credential' }),
      }),
      'fresh-token',
    );
    expect(claimFinish.mock.calls[0][0]).not.toHaveProperty('mail');
    expect(credentials.got).toHaveLength(1);
  });

  it('aborts the pending credential when claimFinish rejects', async () => {
    const { flow, credentials, cache, claimFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const failure = new ApiException(400, 'Bad Request');
    claimFinish.mockRejectedValueOnce(failure);

    await expect(flow.claim('fresh-token')).rejects.toBe(failure);
    expect(cache.list()).toEqual([]);
    expect(signalUnknown).toHaveBeenCalledWith({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
    });
    expect(claimFinish).toHaveBeenCalledWith(expect.anything(), 'fresh-token');
  });

  it('retries claimFinish with an EVM claim signature when the address already exists', async () => {
    const { flow, credentials, activation, claimBegin, claimFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const retryChallenge = 'B'.repeat(64);
    claimBegin.mockResolvedValueOnce(ceremonyChallenge('c', 'A'));
    claimBegin.mockResolvedValueOnce(ceremonyChallenge('d', 'B'));
    claimFinish.mockRejectedValueOnce(new ApiException(409, 'AddressExists'));

    const result = await flow.claim('fresh-token');

    expect(result.state).toBe('unlocked');
    expect(claimFinish).toHaveBeenCalledTimes(2);
    expect(signalUnknown).not.toHaveBeenCalled();

    const first = claimFinish.mock.calls[0][0] as { challengeId: string; signature: string; sparkSignature: string };
    const second = claimFinish.mock.calls[1][0] as { challengeId: string; signature: string; sparkSignature: string };
    expect(first.challengeId).toBe('c'.repeat(64));
    expect(second.challengeId).toBe('d'.repeat(64));
    expect(second.signature).toBe(claimSignature(retryChallenge));
    expect(second.signature).not.toBe(first.signature);
    expect(second.sparkSignature).toBe(first.sparkSignature);
    expect(credentials.got.length).toBeGreaterThan(1);
  });

  it('keeps the credential when a lost claim response is followed by AddressExists', async () => {
    const { flow, credentials, activation, claimBegin, claimFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const resignedChallenge = 'C'.repeat(64);
    claimBegin.mockResolvedValueOnce(ceremonyChallenge('c', 'A'));
    claimBegin.mockResolvedValueOnce(ceremonyChallenge('d', 'B'));
    claimBegin.mockResolvedValueOnce(ceremonyChallenge('e', 'C'));
    claimFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));
    claimFinish.mockRejectedValueOnce(new ApiException(409, 'AddressExists'));

    const result = await flow.claim('fresh-token');

    expect(result.state).toBe('unlocked');
    expect(claimFinish).toHaveBeenCalledTimes(3);
    expect(signalUnknown).not.toHaveBeenCalled();

    const first = claimFinish.mock.calls[0][0] as { challengeId: string; signature: string };
    const retry = claimFinish.mock.calls[1][0] as { challengeId: string; signature: string };
    const resigned = claimFinish.mock.calls[2][0] as { challengeId: string; signature: string };
    expect(retry.challengeId).toBe('d'.repeat(64));
    expect(retry.signature).toBe(first.signature);
    expect(resigned.challengeId).toBe('e'.repeat(64));
    expect(resigned.signature).toBe(claimSignature(resignedChallenge));
    expect(resigned.signature).not.toBe(claimSignature('B'.repeat(64)));
  });

  it('does not drop the credential when the resigned claim still reports AddressExists', async () => {
    const { flow, credentials, activation, claimFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const exists = new ApiException(409, 'AddressExists');
    claimFinish.mockRejectedValueOnce(exists);
    claimFinish.mockRejectedValueOnce(exists);

    await expect(flow.claim('fresh-token')).rejects.toBe(exists);
    expect(claimFinish).toHaveBeenCalledTimes(2);
    expect(signalUnknown).not.toHaveBeenCalled();
  });

  it('aborts the claim retry when the server rejects it for another reason', async () => {
    const { flow, credentials, activation, cache, claimFinish, signalUnknown } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    expireAfterCreate(credentials, activation);
    const failure = new ApiException(400, 'Bad Request');
    claimFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));
    claimFinish.mockRejectedValueOnce(failure);

    await expect(flow.claim('fresh-token')).rejects.toBe(failure);
    expect(cache.list()).toEqual([]);
    expect(signalUnknown).toHaveBeenCalledWith({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
    });
  });

  it('links the EVM seed check address with a login signature', async () => {
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    const { flow } = auth();

    const result = await flow.link('evm', 'token', keys);
    expect(result.accessToken).toBe('link-token');
    expect(result.address.family).toBe('Evm');
  });
});

function ceremonyChallenge(idChar: string, challengeChar: string) {
  return {
    challengeId: idChar.repeat(64),
    challenge: challengeChar.repeat(64),
    rpId: 'app.dfx.swiss',
    timeout: 600000,
  };
}

/** The EIP-191 claim signature over this challenge, using the same PRF key as the flow. */
function claimSignature(challenge: string): string {
  const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
  const address = keys.evm(0).address;
  const claimText = SIGN_MESSAGE_PREFIX.prd + LOGIN_TEMPLATES.general + 'passkey-claim\n' + challenge + '\n' + address;
  return withPrivateKey(keys, { family: 'evm', index: 0 }, (privateKey) => signEip191(claimText, privateKey));
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}
