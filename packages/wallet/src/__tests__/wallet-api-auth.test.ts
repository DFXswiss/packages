import type { WalletAddress, WalletApi, WalletFamilies } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import fixture from './fixtures/derivation-v1.json';
import { WALLET_API_BITCOIN_BLOCKCHAINS, walletApiBitcoinNetwork } from '../config/wallet-api';
import { KeyRing } from '../derivation/keyring';
import { PasskeyCeremonies } from '../passkey/ceremonies';
import type { CeremonyCredentials, CeremonyWindow } from '../passkey/ceremonies';
import { CredentialCache } from '../passkey/credential-cache';
import { PasskeyRefusedError } from '../session/passkey-auth';
import { WalletApiAuth } from '../session/wallet-api-auth';

const RP_ID = 'stg.app.dfx.swiss';
const PRF = hexToBytes(fixture.vectors[0].prfOutput);
const OTHER_PRF = hexToBytes(fixture.vectors[1].prfOutput);
const CREDENTIAL_ID = new Uint8Array([9, 9, 9]);
const USER_HANDLE = 'MDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAw';

const OWN = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'regtest', env: 'stg' });
const OTHER = KeyRing.fromMnemonic(fixture.vectors[1].mnemonic, { bitcoinNetwork: 'regtest', env: 'stg' });
const OWN_BITCOIN = OWN.bitcoinAddress(0, 0).address;
const OTHER_BITCOIN = OTHER.bitcoinAddress(0, 0).address;

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

class FakeCredentials implements CeremonyCredentials {
  nextCreate: PublicKeyCredential | null = null;
  nextGet: PublicKeyCredential | null = null;
  readonly created: CredentialCreationOptions[] = [];
  readonly got: CredentialRequestOptions[] = [];

  async create(options: CredentialCreationOptions): Promise<PublicKeyCredential | null> {
    this.created.push(options);
    return this.nextCreate;
  }

  async get(options: CredentialRequestOptions): Promise<PublicKeyCredential | null> {
    this.got.push(options);
    return this.nextGet;
  }
}

function fakeCredential(prf: Uint8Array | undefined, id = CREDENTIAL_ID): PublicKeyCredential {
  return {
    id: 'test-credential',
    rawId: id.slice().buffer,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: new Uint8Array([1]).buffer,
      attestationObject: new Uint8Array([2]).buffer,
      authenticatorData: new Uint8Array(37).buffer,
      signature: new Uint8Array([3]).buffer,
      userHandle: new Uint8Array(32).fill(1).buffer,
      getTransports: () => ['internal'],
    },
    getClientExtensionResults: () => (prf ? { prf: { results: { first: prf } } } : {}),
  } as unknown as PublicKeyCredential;
}

function fakeWindow(): CeremonyWindow & { signalUnknown: jest.Mock } {
  const signalUnknown = jest.fn();
  return {
    location: { hostname: RP_ID },
    navigator: { userAgent: 'TestBrowser/1.0', userActivation: { isActive: true } },
    PublicKeyCredential: { signalUnknownCredential: signalUnknown },
    signalUnknown,
  } as CeremonyWindow & { signalUnknown: jest.Mock };
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

function fakeApi(families: WalletFamilies, stored: WalletAddress[] = []) {
  return {
    config: jest.fn(async () => ({ families })),
    registerBegin: jest.fn(async () => ({
      rp: { name: 'DFX', id: RP_ID },
      user: { id: USER_HANDLE, name: USER_HANDLE, displayName: USER_HANDLE },
      challenge: 'A'.repeat(64),
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
        authenticatorAttachment: 'platform',
      },
      rpId: RP_ID,
      rpName: 'DFX',
      challengeId: '11111111-1111-4111-8111-111111111111',
      userHandle: USER_HANDLE,
    })),
    registerFinish: jest.fn(async () => ({ token: 'register-token', accountId: 'account-1' })),
    authenticateBegin: jest.fn(async () => ({
      challenge: 'B'.repeat(64),
      rpId: RP_ID,
      challengeId: '22222222-2222-4222-8222-222222222222',
    })),
    authenticateFinish: jest.fn(async () => ({ token: 'login-token', accountId: 'account-1' })),
    addresses: jest.fn(async () => stored.slice()),
    upsertAddress: jest.fn(async (request: WalletAddress) => {
      stored.push(request);
      return { ...request };
    }),
    revokeBegin: jest.fn(async () => ({
      challenge: 'C'.repeat(64),
      rpId: RP_ID,
      challengeId: '33333333-3333-4333-8333-333333333333',
      allowCredentials: [{ id: base64url(CREDENTIAL_ID), type: 'public-key' }],
    })),
    revokeFinish: jest.fn(async () => ({ revokedAt: '2026-11-28T00:00:00.000Z' })),
    credentials: jest.fn(async () => []),
  };
}

const BITCOIN_ONLY: WalletFamilies = { bitcoin: true, spark: false, evm: false };
const ALL: WalletFamilies = { bitcoin: true, spark: true, evm: true };

function setup(families = BITCOIN_ONLY, stored: WalletAddress[] = []) {
  const api = fakeApi(families, stored);
  const credentials = new FakeCredentials();
  const win = fakeWindow();
  const cache = new CredentialCache(new MemoryStorage(), 'dfx.wallet.credentials.v1', RP_ID);
  const flow = new WalletApiAuth({
    api: api as unknown as WalletApi,
    ceremonies: new PasskeyCeremonies('stg', credentials, win),
    env: 'stg',
    cache,
  });
  return { api, credentials, cache, flow, signalUnknown: win.signalUnknown };
}

afterEach(() => jest.restoreAllMocks());

describe('network', () => {
  it('uses regtest outside PRD and maps the wallet-api blockchains', () => {
    expect(walletApiBitcoinNetwork('prd')).toBe('mainnet');
    expect(walletApiBitcoinNetwork('stg')).toBe('regtest');
    expect(walletApiBitcoinNetwork('dev')).toBe('regtest');
    expect(walletApiBitcoinNetwork('stg', ['dev'])).toBe('testnet4');
    expect(walletApiBitcoinNetwork('prd', ['prd'])).toBe('mainnet');
    expect(WALLET_API_BITCOIN_BLOCKCHAINS).toEqual({
      mainnet: 'Bitcoin',
      testnet4: 'BitcoinTestnet4',
      regtest: 'BitcoinRegtest',
    });
    expect(OWN_BITCOIN.startsWith('bcrt1q')).toBe(true);
  });
});

describe('WalletApiAuth.register', () => {
  it('registers Bitcoin only with the server options, without EVM or Spark derivation', async () => {
    const { api, credentials, cache, flow, signalUnknown } = setup();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const evm = jest.spyOn(KeyRing.prototype, 'evm');
    const spark = jest.spyOn(KeyRing.prototype, 'sparkIdentity');

    const result = await flow.register();

    expect(result.state).toBe('unlocked');
    expect(result.token).toBe('register-token');
    expect(result.accountId).toBe('account-1');
    expect(result.families).toEqual(BITCOIN_ONLY);
    expect(result.keys?.bitcoinNetwork).toBe('regtest');
    expect(result.keys?.bitcoinAddress(0, 0).address).toBe(OWN_BITCOIN);

    const created = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(new Uint8Array(created.challenge as ArrayBuffer)).toEqual(new Uint8Array(48));
    expect(base64url(new Uint8Array(created.user.id as ArrayBuffer))).toBe(USER_HANDLE);
    expect(created.rp.id).toBe(RP_ID);
    expect(created.authenticatorSelection?.authenticatorAttachment).toBe('platform');

    expect(api.registerFinish).toHaveBeenCalledWith({
      challengeId: '11111111-1111-4111-8111-111111111111',
      response: expect.objectContaining({ id: 'test-credential' }),
    });
    const sent = (api.registerFinish.mock.calls[0] as unknown[])[0] as { response: Record<string, unknown> };
    expect(JSON.stringify(sent.response)).not.toContain('prf');

    expect(api.upsertAddress).toHaveBeenCalledTimes(1);
    expect(api.upsertAddress).toHaveBeenCalledWith({ chain: 'bitcoin', address: OWN_BITCOIN }, 'register-token');
    expect(result.addresses).toEqual([{ chain: 'bitcoin', address: OWN_BITCOIN }]);
    expect(evm).not.toHaveBeenCalled();
    expect(spark).not.toHaveBeenCalled();

    expect(cache.list()).toEqual([
      expect.objectContaining({
        credentialId: base64url(CREDENTIAL_ID),
        state: 'active',
        seedCheckAddress: OWN_BITCOIN,
      }),
    ]);
    expect(signalUnknown).not.toHaveBeenCalled();
    expect(api.config).toHaveBeenCalledTimes(1);
  });

  it('registers EVM and Spark addresses only when their families are on', async () => {
    const { api, credentials, flow } = setup(ALL);
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    await flow.register();

    expect(api.upsertAddress.mock.calls.map((call) => (call as unknown[])[0])).toEqual([
      { chain: 'bitcoin', address: OWN_BITCOIN },
      { chain: 'ethereum', address: fixture.vectors[0].evm[0].address },
      { chain: 'spark', address: fixture.vectors[0].spark.address },
    ]);
  });

  it('drops the new credential when register/finish rejects it', async () => {
    const { api, credentials, cache, flow, signalUnknown } = setup();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const failure = new ApiException(400, 'Challenge invalid', 'ChallengeInvalid');
    api.registerFinish.mockRejectedValueOnce(failure);

    await expect(flow.register()).rejects.toBe(failure);
    expect(signalUnknown).toHaveBeenCalledWith({ credentialId: base64url(CREDENTIAL_ID), rpId: RP_ID });
    expect(cache.list()).toEqual([]);
    expect(api.upsertAddress).not.toHaveBeenCalled();
  });

  it('logs the new credential in once when the finish answer was lost', async () => {
    const { api, credentials, flow, signalUnknown } = setup();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    api.registerFinish.mockRejectedValueOnce(new ApiException(0, 'Network error'));

    const result = await flow.register();

    expect(result.state).toBe('unlocked');
    expect(result.token).toBe('login-token');
    expect(api.authenticateBegin).toHaveBeenCalledWith(base64url(CREDENTIAL_ID));
    expect(api.authenticateFinish).toHaveBeenCalledWith({
      challengeId: '22222222-2222-4222-8222-222222222222',
      response: expect.objectContaining({ id: 'test-credential' }),
    });
    expect(signalUnknown).not.toHaveBeenCalled();
  });

  it('drops the credential when the lost registration was never stored', async () => {
    const { api, credentials, flow, signalUnknown } = setup();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const lost = new ApiException(0, 'Network error');
    api.registerFinish.mockRejectedValueOnce(lost);
    api.authenticateFinish.mockRejectedValueOnce(new ApiException(404, 'Unknown', 'PasskeyCredentialNotFound'));

    await expect(flow.register()).rejects.toBe(lost);
    expect(signalUnknown).toHaveBeenCalled();
  });

  it('keeps the session when the address registration fails', async () => {
    const { api, credentials, flow } = setup();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    const failure = new ApiException(502, 'Bad gateway');
    api.upsertAddress.mockRejectedValueOnce(failure);

    const result = await flow.register();
    expect(result.state).toBe('unlocked');
    expect(result.addressSyncError).toBe(failure);
    expect(result.addresses).toEqual([]);
  });

  it('refuses a server of another RP ID', async () => {
    const { api, flow } = setup();
    api.registerBegin.mockResolvedValueOnce({
      ...(await fakeApi(BITCOIN_ONLY).registerBegin()),
      rpId: 'evil.example',
    });
    await expect(flow.register()).rejects.toMatchObject({ code: 'wrong-origin' });
  });
});

describe('WalletApiAuth.login', () => {
  it('unlocks when wallet-api holds this seed’s Bitcoin address', async () => {
    const { api, credentials, flow } = setup(BITCOIN_ONLY, [{ chain: 'bitcoin', address: OWN_BITCOIN }]);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.login();

    expect(result.state).toBe('unlocked');
    expect(result.token).toBe('login-token');
    expect(api.authenticateBegin).toHaveBeenCalledWith(undefined);
    expect(api.addresses).toHaveBeenCalledWith('login-token');
    expect(api.upsertAddress).not.toHaveBeenCalled();
    const sent = (api.authenticateFinish.mock.calls[0] as unknown[])[0] as { response: Record<string, unknown> };
    expect(JSON.stringify(sent.response)).not.toContain('prf');
  });

  it('registers a missing Bitcoin address', async () => {
    const { api, credentials, flow } = setup();
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.login();
    expect(result.state).toBe('unlocked');
    expect(api.upsertAddress).toHaveBeenCalledWith({ chain: 'bitcoin', address: OWN_BITCOIN }, 'login-token');
  });

  it('reports a seed mismatch and registers nothing', async () => {
    const { api, credentials, flow } = setup(BITCOIN_ONLY, [{ chain: 'bitcoin', address: OTHER_BITCOIN }]);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.login();
    expect(result.state).toBe('seed-mismatch');
    expect(api.upsertAddress).not.toHaveBeenCalled();
  });

  it('stays locked without PRF output', async () => {
    const { api, credentials, flow } = setup();
    credentials.nextGet = fakeCredential(undefined);

    const result = await flow.login();
    expect(result.state).toBe('locked');
    expect(result.keys).toBeUndefined();
    expect(api.addresses).not.toHaveBeenCalled();
  });

  it('surfaces a revoked credential as a typed refusal and marks it revoked', async () => {
    const { api, credentials, cache, flow } = setup();
    cache.put({ credentialId: base64url(CREDENTIAL_ID), rpId: RP_ID, state: 'active', createdAt: 1 });
    credentials.nextGet = fakeCredential(PRF);
    api.authenticateFinish.mockRejectedValueOnce(new ApiException(401, 'Revoked', 'PasskeyCredentialRevoked'));

    await expect(flow.login()).rejects.toBeInstanceOf(PasskeyRefusedError);
    expect(cache.list()[0].state).toBe('revoked');
  });

  it('unlocks against the cached Bitcoin seed check address', async () => {
    const { credentials, cache, flow } = setup();
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: RP_ID,
      state: 'active',
      seedCheckAddress: OWN_BITCOIN,
      createdAt: 1,
    });
    credentials.nextGet = fakeCredential(PRF);
    expect((await flow.unlock()).state).toBe('unlocked');

    credentials.nextGet = fakeCredential(OTHER_PRF);
    expect((await flow.unlock()).state).toBe('seed-mismatch');
  });
});

describe('WalletApiAuth.revoke', () => {
  it('pins the only allowed credential and revokes with the wallet session', async () => {
    const { api, credentials, cache, flow } = setup();
    cache.put({ credentialId: base64url(CREDENTIAL_ID), rpId: RP_ID, state: 'active', createdAt: 1 });
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.revoke('wallet-token');

    expect(result.revokedAt).toBe('2026-11-28T00:00:00.000Z');
    expect(api.revokeBegin).toHaveBeenCalledWith('wallet-token');
    expect(api.revokeFinish).toHaveBeenCalledWith(
      {
        challengeId: '33333333-3333-4333-8333-333333333333',
        response: expect.objectContaining({ id: 'test-credential' }),
      },
      'wallet-token',
    );
    const options = credentials.got[0].publicKey as PublicKeyCredentialRequestOptions;
    expect(new Uint8Array(options.allowCredentials![0].id as ArrayBuffer)).toEqual(CREDENTIAL_ID);
    expect(cache.list()[0].state).toBe('revoked');
  });

  it('refuses a passkey the account does not list', async () => {
    const { api, credentials, flow } = setup();
    credentials.nextGet = fakeCredential(PRF, new Uint8Array([1, 2, 3]));
    api.revokeBegin.mockResolvedValueOnce({
      challenge: 'C'.repeat(64),
      rpId: RP_ID,
      challengeId: '33333333-3333-4333-8333-333333333333',
      allowCredentials: [
        { id: base64url(CREDENTIAL_ID), type: 'public-key' },
        { id: base64url(new Uint8Array([4])), type: 'public-key' },
      ],
    });

    await expect(flow.revoke('wallet-token')).rejects.toMatchObject({ code: 'credential-mismatch' });
    expect(api.revokeFinish).not.toHaveBeenCalled();
  });
});
