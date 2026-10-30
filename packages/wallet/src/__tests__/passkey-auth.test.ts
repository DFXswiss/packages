import type { DfxApiClient, PasskeyWallet } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import fixture from './fixtures/derivation-v1.json';
import type { WalletEnv } from '../config/environment';
import { KeyRing } from '../derivation/keyring';
import { PasskeyCeremonies } from '../passkey/ceremonies';
import type { CeremonyCredentials, CeremonyWindow } from '../passkey/ceremonies';
import { CredentialCache } from '../passkey/credential-cache';
import { PasskeyAuth, PasskeyRefusedError } from '../session/passkey-auth';
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
  };
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

function api(
  behavior: ApiBehavior = {},
): DfxApiClient & { registerFinish: jest.Mock; authenticateFinish: jest.Mock; link: jest.Mock } {
  const challenge = { challengeId: 'c'.repeat(64), challenge: 'A'.repeat(64), rpId: 'app.dfx.swiss', timeout: 600000 };
  return {
    passkey: {
      registerBegin: async () => challenge,
      registerFinish: async () => ({ accessToken: 'register-token', wallet: wallet('pending') }),
      authenticateBegin: async () => challenge,
      authenticateFinish: async () => {
        if (behavior.authenticateReject) throw behavior.authenticateReject;
        return { accessToken: 'login-token', wallet: wallet(behavior.walletSeedCheckAddress ?? '') };
      },
      claimBegin: async () => challenge,
      claimFinish: async () => ({ accessToken: 'claim-token', wallet: wallet('pending') }),
      link: async () => ({
        accessToken: 'link-token',
        address: { address: '0x1', family: 'Evm', path: "m/44'/60'/0'/0/0", status: 'Active', blockchains: [] },
      }),
      revokeBegin: async () => challenge,
      revokeFinish: async () => wallet('x'),
      credentialStatus: async () => [],
    },
  } as never;
}

function auth(
  behavior: ApiBehavior = {},
  credentials = new FakeCredentials(),
): { flow: PasskeyAuth; credentials: FakeCredentials; cache: CredentialCache } {
  const cache = new CredentialCache(new MemoryStorage(), 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
  const flow = new PasskeyAuth({
    api: api(behavior),
    ceremonies: new PasskeyCeremonies('prd', credentials, fakeWindow()),
    env: 'prd' as WalletEnv,
    cache,
  });
  return { flow, credentials, cache };
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
    const { flow, credentials, cache } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.register();

    expect(result.state).toBe('unlocked');
    expect(result.accessToken).toBe('register-token');
    expect(result.keys?.evm(0).address).toBe(fixture.vectors[0].evm[0].address);
    expect(result.wallet.seedCheckAddress).toBeTruthy();

    const entry = cache.list().find((e) => e.state === 'active');
    expect(entry?.publicData?.seedCheckAddress).toBe(fixture.vectors[0].evm[0].address);

    const createdOptions = credentials.created[0].publicKey as PublicKeyCredentialCreationOptions;
    expect(new Uint8Array(createdOptions.challenge)).toEqual(new Uint8Array(48)); // base64url of 64 'A'
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

    await expect(flow.register()).rejects.toMatchObject({ code: 'wrong-origin' });
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

describe('unlock, export and revoke', () => {
  it('unlocks against the cached seed check address', async () => {
    const { flow, credentials, cache } = auth();
    cache.put({
      credentialId: 'id',
      rpId: 'app.dfx.swiss',
      state: 'active',
      publicData: {
        seedCheckAddress: fixture.vectors[0].evm[0].address as `0x${string}`,
        evm: [{ index: 0, address: fixture.vectors[0].evm[0].address as `0x${string}` }],
        bitcoin: {
          network: 'mainnet',
          xpub: fixture.vectors[0].bitcoin.mainnet.xpub,
          fingerprint: fixture.vectors[0].masterFingerprint,
          receive0: fixture.vectors[0].bitcoin.mainnet.receive[0].address,
        },
        spark: {
          identityPubkey: fixture.vectors[0].spark.identityPublicKey,
          address: fixture.vectors[0].spark.address,
        },
      },
      createdAt: 1,
    });
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.unlock();
    expect(result.state).toBe('unlocked');
    expect(result.keys?.mnemonic()).toBe(fixture.vectors[0].mnemonic);

    credentials.nextGet = fakeCredential(OTHER_PRF);
    const mismatch = await flow.unlock();
    expect(mismatch.state).toBe('seed-mismatch');
  });

  it('exports the 12 words behind a fresh local challenge', async () => {
    const { flow, credentials } = auth();
    credentials.nextGet = fakeCredential(PRF);

    const words = await flow.exportMnemonic();
    expect(words).toEqual(fixture.vectors[0].mnemonic.split(' '));
  });

  it('refuses the export without PRF', async () => {
    const { flow, credentials } = auth();
    credentials.nextGet = fakeCredential(undefined);

    await expect(flow.exportMnemonic()).rejects.toMatchObject({ code: 'prf-unavailable' });
    expect(new WalletError('prf-unavailable')).toBeInstanceOf(WalletError);
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
    const { flow, credentials } = auth();
    credentials.nextCreate = fakeCredential(PRF);
    credentials.nextGet = fakeCredential(PRF);

    const result = await flow.claim('fresh-token');
    expect(result.state).toBe('unlocked');
    expect(result.accessToken).toBe('claim-token');
  });

  it('links the EVM seed check address with a login signature', async () => {
    const keys = KeyRing.fromMnemonic(fixture.vectors[0].mnemonic, { bitcoinNetwork: 'mainnet' });
    const { flow } = auth();

    const result = await flow.link('evm', 'token', keys);
    expect(result.accessToken).toBe('link-token');
    expect(result.address.family).toBe('Evm');
  });
});

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}
