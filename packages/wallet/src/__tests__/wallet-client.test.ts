import {
  ApiException,
  DfxApiClient,
  DfxHttpClient,
  PasskeyApi,
  type PasskeyAddress,
  type PasskeyWallet,
} from '@dfx.swiss/core';
import fixture from './fixtures/derivation-v1.json';
import type { WalletEnv } from '../config/environment';
import { KeyRing } from '../derivation/keyring';
import { PasskeyCeremonies } from '../passkey/ceremonies';
import type { CeremonyCredentials, CeremonyWindow } from '../passkey/ceremonies';
import { CredentialCache } from '../passkey/credential-cache';
import { PasskeyAuth } from '../session/passkey-auth';
import { createWalletClient, type WalletClient } from '../client/wallet-client';

const API_URL = 'https://api.dfx.swiss/v1/';
const API_URL_WITHOUT_SLASH = 'https://api.dfx.swiss/v1';
const SESSION = 'session-token';
const PRF = hexToBytes(fixture.vectors[0].prfOutput);
const CREDENTIAL_ID = new Uint8Array([9, 9, 9]);

const CHALLENGE = {
  challengeId: 'c'.repeat(64),
  challenge: 'A'.repeat(64),
  rpId: 'app.dfx.swiss',
  timeout: 600000,
};

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
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

function fakeWindow(): CeremonyWindow {
  return {
    location: { hostname: 'app.dfx.swiss' },
    navigator: { userAgent: 'TestBrowser/1.0', userActivation: { isActive: true } },
    PublicKeyCredential: { signalUnknownCredential: jest.fn() },
  } as CeremonyWindow;
}

function walletRecord(seedCheckAddress: string): PasskeyWallet {
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

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function bodyFor(url: string): unknown {
  if (
    url.includes('/auth/passkey/register/begin') ||
    url.includes('/auth/passkey/authenticate/begin') ||
    url.includes('/auth/passkey/revoke/begin')
  ) {
    return CHALLENGE;
  }
  if (url.includes('/auth/passkey/register/finish') || url.includes('/auth/passkey/authenticate/finish')) {
    return { accessToken: 'access-token', wallet: walletRecord(fixture.vectors[0].evm[0].address) };
  }
  if (url.includes('/auth/passkey/revoke/finish')) return walletRecord('x');
  if (url.includes('/auth/passkey/link')) {
    return {
      accessToken: 'link-token',
      address: { address: '0x1', family: 'Evm', path: "m/44'/60'/0'/0/0", status: 'Active', blockchains: [] },
    };
  }
  if (url.includes('/auth/passkey/credentialStatus')) return [];
  if (url.includes('/backupSeen')) return walletRecord('x');
  if (url.includes('/passkey/wallets')) return [walletRecord('x')];
  return undefined;
}

type FetchCall = [string, RequestInit];

function scriptedFetch(respond: (url: string) => { ok: boolean; status: number; body: unknown }): jest.Mock {
  return jest.fn(async (url: string) => {
    const result = respond(String(url));
    return {
      ok: result.ok,
      status: result.status,
      statusText: result.ok ? 'OK' : 'Error',
      json: async () => result.body,
      headers: { entries: () => [] },
    };
  });
}

function successFetch(): jest.Mock {
  return scriptedFetch((url) => ({ ok: true, status: 200, body: bodyFor(url) }));
}

function asFetch(fn: jest.Mock): typeof fetch {
  return fn as unknown as typeof fetch;
}

function callsOf(fetchFn: jest.Mock): FetchCall[] {
  return fetchFn.mock.calls as FetchCall[];
}

function requestOf(call: FetchCall): {
  url: string;
  method: string | undefined;
  headers: HeadersInit | undefined;
  body: BodyInit | null | undefined;
} {
  return { url: call[0], method: call[1].method, headers: call[1].headers, body: call[1].body };
}

function authorization(call: FetchCall): string | undefined {
  return (call[1].headers as Record<string, string>).Authorization;
}

function parsedBody(call: FetchCall): any {
  expect(typeof call[1].body).toBe('string');
  return JSON.parse(call[1].body as string);
}

function bodyOf(fetchFn: jest.Mock, path: string): any {
  const found = callsOf(fetchFn).find((call) => call[0].includes(path));
  if (!found) throw new Error(`no request to ${path}`);
  return parsedBody(found);
}

function recordedAllowCredentials(credentials: FakeCredentials) {
  const allow = credentials.got[0]?.publicKey?.allowCredentials;
  if (!allow) return undefined;
  return allow.map((entry) => ({
    type: entry.type,
    id: Array.from(new Uint8Array(entry.id as Uint8Array)),
  }));
}

function client(fetchFn: jest.Mock, credentials = new FakeCredentials(), cache?: CredentialCache): WalletClient {
  return createWalletClient({
    apiUrl: API_URL,
    env: 'prd' as WalletEnv,
    fetchFn: asFetch(fetchFn),
    ceremonies: new PasskeyCeremonies('prd', credentials, fakeWindow()),
    cache,
  });
}

async function thrown(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run();
  } catch (error) {
    return error;
  }
  throw new Error('expected the call to throw');
}

function exceptionFields(error: unknown): { statusCode: number; message: string; code?: string } {
  const exception = error as ApiException;
  return { statusCode: exception.statusCode, message: exception.message, code: exception.code };
}

async function matchesDirectRoutes(apiUrl: string): Promise<void> {
  const fetchFn = successFetch();
  const wallet = createWalletClient({
    apiUrl,
    env: 'prd',
    fetchFn: asFetch(fetchFn),
    ceremonies: new PasskeyCeremonies('prd', new FakeCredentials(), fakeWindow()),
  });
  const dfx = new DfxApiClient({ apiUrl, fetchFn: asFetch(fetchFn) });
  const ids = ['id-1', 'id-2'];
  const diagnostic = { stage: 'Registration' as const, outcome: 'Failure' as const, errorName: 'NotAllowedError' };

  await wallet.wallets(SESSION);
  await dfx.passkey.wallets(SESSION);
  await wallet.backupSeen(7, SESSION);
  await dfx.passkey.backupSeen(7, SESSION);
  await wallet.credentialStatus(ids);
  await dfx.passkey.credentialStatus(ids);
  await wallet.diagnostics(diagnostic);
  await dfx.passkey.diagnostics(diagnostic);

  const seen = callsOf(fetchFn);
  expect(seen).toHaveLength(8);
  for (let index = 0; index < seen.length; index += 2) {
    expect(requestOf(seen[index])).toEqual(requestOf(seen[index + 1]));
  }
}

async function revokeFinishReason(reason: 'Lost' | 'Compromised'): Promise<string> {
  const fetchFn = successFetch();
  const credentials = new FakeCredentials();
  credentials.nextGet = fakeCredential(PRF);
  await client(fetchFn, credentials).revoke(reason);
  return bodyOf(fetchFn, '/auth/passkey/revoke/finish').reason;
}

describe('direct passkey routes', () => {
  it('matches DfxApiClient.passkey on url, method, headers and body when apiUrl ends with a slash', async () => {
    await matchesDirectRoutes(API_URL);
  });

  it('matches DfxApiClient.passkey on url, method, headers and body when apiUrl has no trailing slash', async () => {
    await matchesDirectRoutes(API_URL_WITHOUT_SLASH);
  });

  it('sends the session token on wallets and does not send Bearer customer on the same fetchFn', async () => {
    const fetchFn = successFetch();
    const customer = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });
    customer.setToken('customer');
    await customer.passkey.wallets();

    const wallet = client(fetchFn);
    await wallet.wallets(SESSION);
    await wallet.credentialStatus(['id-1']);
    await wallet.diagnostics({ stage: 'Login', outcome: 'Success' });

    const seen = callsOf(fetchFn);
    expect(authorization(seen[0])).toBe('Bearer customer');
    expect(seen.slice(1).map(authorization)).toEqual([`Bearer ${SESSION}`, undefined, undefined]);
  });
});

describe('errors', () => {
  const failure = { statusCode: 422, message: 'Rejected', code: 'CredentialCompromised' };

  it('throws the 4xx JSON status, message and code as the same ApiException as DfxApiClient', async () => {
    const fetchFn = scriptedFetch(() => ({ ok: false, status: 400, body: failure }));
    const wallet = client(fetchFn);
    const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });

    const fromWallet = await thrown(() => wallet.wallets(SESSION));
    const fromDfx = await thrown(() => dfx.passkey.wallets(SESSION));

    expect(fromWallet).toBeInstanceOf(ApiException);
    expect(fromDfx).toBeInstanceOf(ApiException);
    expect(exceptionFields(fromWallet)).toEqual(exceptionFields(fromDfx));
    expect(exceptionFields(fromWallet)).toEqual(failure);
  });

  it('throws the same network ApiException as DfxApiClient', async () => {
    const fetchFn = jest.fn(async () => {
      throw new Error('fetch failed');
    });
    const wallet = client(fetchFn);
    const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });

    const fromWallet = await thrown(() => wallet.credentialStatus(['id-1']));
    const fromDfx = await thrown(() => dfx.passkey.credentialStatus(['id-1']));

    expect(fromWallet).toBeInstanceOf(ApiException);
    expect(fromDfx).toBeInstanceOf(ApiException);
    expect(exceptionFields(fromWallet)).toEqual(exceptionFields(fromDfx));
    expect(exceptionFields(fromWallet)).toEqual({
      statusCode: 0,
      message: 'Network error: fetch failed',
      code: undefined,
    });
  });
});

describe('ceremonies', () => {
  it('login matches DfxApiClient authenticate routes and sends no Authorization', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextGet = fakeCredential(PRF);
    await client(fetchFn, credentials).login();

    const loginCalls = callsOf(fetchFn).slice();
    expect(loginCalls.map(authorization)).toEqual([undefined, undefined]);
    const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });
    await dfx.passkey.authenticateBegin();
    await dfx.passkey.authenticateFinish(parsedBody(loginCalls[1]));

    const dfxCalls = callsOf(fetchFn).slice(loginCalls.length);
    expect(dfxCalls).toHaveLength(loginCalls.length);
    loginCalls.forEach((call, index) => expect(requestOf(call)).toEqual(requestOf(dfxCalls[index])));
  });

  it('register matches DfxApiClient register routes and sends no Authorization', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    await client(fetchFn, credentials).register({ mail: 'user@example.com' });

    const registerCalls = callsOf(fetchFn).slice();
    expect(registerCalls.map(authorization)).toEqual([undefined, undefined]);
    const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });
    await dfx.passkey.registerBegin();
    await dfx.passkey.registerFinish(parsedBody(registerCalls[1]));

    const dfxCalls = callsOf(fetchFn).slice(registerCalls.length);
    expect(dfxCalls).toHaveLength(registerCalls.length);
    registerCalls.forEach((call, index) => expect(requestOf(call)).toEqual(requestOf(dfxCalls[index])));
  });

  it('register/finish body contains the given mail, language and usedRef', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);
    await client(fetchFn, credentials).register({
      mail: 'user@example.com',
      language: 'de',
      usedRef: 'ref-1',
    });

    const body = bodyOf(fetchFn, '/auth/passkey/register/finish');
    expect({ mail: body.mail, language: body.language, usedRef: body.usedRef }).toEqual({
      mail: 'user@example.com',
      language: 'de',
      usedRef: 'ref-1',
    });
  });

  it('revoke matches DfxApiClient revoke routes and sends no Authorization', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextGet = fakeCredential(PRF);
    await client(fetchFn, credentials).revoke('Lost');

    const revokeCalls = callsOf(fetchFn).slice();
    expect(revokeCalls.map(authorization)).toEqual([undefined, undefined]);
    const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });
    await dfx.passkey.revokeBegin();
    await dfx.passkey.revokeFinish(parsedBody(revokeCalls[1]));

    const dfxCalls = callsOf(fetchFn).slice(revokeCalls.length);
    expect(dfxCalls).toHaveLength(revokeCalls.length);
    revokeCalls.forEach((call, index) => expect(requestOf(call)).toEqual(requestOf(dfxCalls[index])));
  });

  it('revoke/finish body reason is Lost when called with Lost', async () => {
    expect(await revokeFinishReason('Lost')).toBe('Lost');
  });

  it('revoke/finish body reason is Compromised when called with Compromised', async () => {
    expect(await revokeFinishReason('Compromised')).toBe('Compromised');
  });

  it('link matches DfxApiClient.passkey.link and sends Bearer of the given session token', async () => {
    const fetchFn = successFetch();
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    try {
      await client(fetchFn).link('evm', SESSION, keys);
      const linkCalls = callsOf(fetchFn).slice();
      expect(linkCalls).toHaveLength(1);
      expect(authorization(linkCalls[0])).toBe(`Bearer ${SESSION}`);

      const dfx = new DfxApiClient({ apiUrl: API_URL, fetchFn: asFetch(fetchFn) });
      await dfx.passkey.link(parsedBody(linkCalls[0]), SESSION);
      expect(requestOf(linkCalls[0])).toEqual(requestOf(callsOf(fetchFn)[1]));
    } finally {
      keys.wipe();
    }
  });

  it('link bitcoin body family, path and address are the fixture mainnet receive 0', async () => {
    const fetchFn = successFetch();
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    const receive = fixture.vectors[0].bitcoin.mainnet.receive[0];
    try {
      await client(fetchFn).link('bitcoin', SESSION, keys);
      const body = bodyOf(fetchFn, '/auth/passkey/link');
      expect({ family: body.family, path: body.path, address: body.address }).toEqual({
        family: 'Bitcoin',
        path: receive.path,
        address: receive.address,
      });
    } finally {
      keys.wipe();
    }
  });

  it('link evm body family, path and address are the fixture evm index 1 when evmIndex is 1', async () => {
    const fetchFn = successFetch();
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    const evm = fixture.vectors[0].evm[1];
    try {
      await client(fetchFn).link('evm', SESSION, keys, 1);
      const body = bodyOf(fetchFn, '/auth/passkey/link');
      expect({ family: body.family, path: body.path, address: body.address }).toEqual({
        family: 'Evm',
        path: evm.path,
        address: evm.address,
      });
    } finally {
      keys.wipe();
    }
  });

  it('unlock returns the unlocked state and sends no request', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextGet = fakeCredential(PRF);
    const cache = new CredentialCache(new MemoryStorage(), 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
    cache.put({
      credentialId: base64url(CREDENTIAL_ID),
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: cachedPublicData(fixture.vectors[0]),
      createdAt: 1,
    });

    const result = await client(fetchFn, credentials, cache).unlock();

    expect(result.state).toBe('unlocked');
    expect(callsOf(fetchFn)).toHaveLength(0);
  });

  it('exportMnemonic returns the twelve words and sends no request', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextGet = fakeCredential(PRF);

    const words = await client(fetchFn, credentials).exportMnemonic();

    expect(words).toEqual(fixture.vectors[0].mnemonic.split(' '));
    expect(callsOf(fetchFn)).toHaveLength(0);
  });

  it('exportMnemonic without a credential id leaves allowCredentials unset', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    credentials.nextGet = fakeCredential(PRF);
    await client(fetchFn, credentials).exportMnemonic();

    expect(credentials.got).toHaveLength(1);
    expect(recordedAllowCredentials(credentials)).toBeUndefined();
  });

  it('exportMnemonic with a credential id sets allowCredentials to that id', async () => {
    const fetchFn = successFetch();
    const credentials = new FakeCredentials();
    const pinned = new Uint8Array([4, 5, 6]);
    credentials.nextGet = fakeCredential(PRF, pinned);
    await client(fetchFn, credentials).exportMnemonic(pinned);

    expect(credentials.got).toHaveLength(1);
    expect(recordedAllowCredentials(credentials)).toEqual([{ type: 'public-key', id: [4, 5, 6] }]);
  });
});

describe('default ceremonies', () => {
  it('constructs PasskeyCeremonies with env stg when ceremonies is omitted', () => {
    const ceremonies = jest.requireActual('../passkey/ceremonies') as {
      PasskeyCeremonies: typeof PasskeyCeremonies;
    };
    const Original = ceremonies.PasskeyCeremonies;
    const spy = jest.spyOn(ceremonies, 'PasskeyCeremonies');
    try {
      spy.mockImplementation(function (env: WalletEnv) {
        return new Original(env);
      });
      spy.mockClear();
      createWalletClient({ apiUrl: API_URL, env: 'stg', fetchFn: asFetch(jest.fn()) });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('stg');
    } finally {
      spy.mockRestore();
    }
  });
});

describe('verifyServerAddresses', () => {
  it('returns the same rows as PasskeyAuth', () => {
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    try {
      const evm = keys.evm(0);
      const record: PasskeyAddress = {
        address: evm.address,
        family: 'Evm',
        path: evm.path,
        status: 'Active',
        blockchains: [],
      };
      const server: PasskeyWallet = {
        ...walletRecord(evm.address),
        addresses: [record, { ...record, family: 'Bitcoin' }, { ...record, path: "m/44'/60'/0'/0/1" }],
      };
      const wallet = createWalletClient({
        apiUrl: API_URL,
        env: 'prd',
        fetchFn: asFetch(jest.fn()),
        ceremonies: new PasskeyCeremonies('prd', new FakeCredentials(), fakeWindow()),
      });
      const auth = new PasskeyAuth({
        api: { passkey: new PasskeyApi(new DfxHttpClient({ apiUrl: API_URL, fetchFn: asFetch(jest.fn()) })) },
        ceremonies: new PasskeyCeremonies('prd', new FakeCredentials(), fakeWindow()),
        env: 'prd',
      });

      expect(wallet.verifyServerAddresses(server, keys)).toEqual(auth.verifyServerAddresses(server, keys));
    } finally {
      keys.wipe();
    }
  });
});
