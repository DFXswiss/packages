import type { ApiException, ChainInfo, WalletDataApi } from '@dfx.swiss/core';
import { ApiException as ApiError } from '@dfx.swiss/core';
import type { WalletEnv } from '../config/environment';
import { ChainRegistry } from '../providers/chain-registry';
import { DfxData, ProviderUnavailableError } from '../providers/dfx-data';
import { PricePolicy } from '../providers/price';
import { Blocklists } from '../providers/blocklist';
import type { WalletSnapshot } from '../providers/snapshot';
import { WalletError } from '../util/errors';

function expectWalletError(run: () => unknown, code: string): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(WalletError);
    expect((error as WalletError).code).toBe(code);
    return;
  }
  throw new Error(`expected a WalletError with code ${code}, but nothing was thrown`);
}

function chain(overrides: Partial<ChainInfo>): ChainInfo {
  return {
    blockchain: 'Ethereum' as never,
    family: 'Evm',
    chainId: 1,
    isTestnet: false,
    isActive: true,
    walletSupported: true,
    capabilities: {
      backendBroadcast: true,
      payInDetection: true,
      gasless: false,
      history: true,
      tokens: true,
      nfts: true,
      approvals: true,
    },
    ...overrides,
  };
}

const CHAINS: ChainInfo[] = [
  chain({ blockchain: 'Bitcoin' as never, family: 'Bitcoin', chainId: undefined }),
  chain({ blockchain: 'BitcoinTestnet4' as never, family: 'Bitcoin', chainId: undefined, isTestnet: true }),
  chain({ blockchain: 'Spark' as never, family: 'Spark', chainId: undefined }),
  chain({ blockchain: 'Ethereum' as never, chainId: 1 }),
  chain({ blockchain: 'Sepolia' as never, chainId: 11155111, isTestnet: true }),
  chain({ blockchain: 'Polygon' as never, chainId: 137, walletSupported: false }),
  chain({ blockchain: 'Haqq' as never, chainId: undefined, walletSupported: true }),
];

const SNAPSHOT: WalletSnapshot = {
  env: 'prd',
  createdAt: '2026-10-30T00:00:00Z',
  chains: CHAINS,
  assets: [],
  blocklists: { phishingDomains: ['Evil.example'], scamAddresses: ['0xdead'] },
};

describe('ChainRegistry', () => {
  it('serves the environment Bitcoin chain and applies walletSupported', () => {
    const registry = ChainRegistry.fromApi(CHAINS);
    expect(registry.isLive).toBe(true);
    expect(registry.bitcoin('prd' as WalletEnv).blockchain).toBe('Bitcoin');
    expect(registry.bitcoin('dev' as WalletEnv).blockchain).toBe('BitcoinTestnet4');
    expectWalletError(
      () => ChainRegistry.fromApi(CHAINS.filter((c) => c.blockchain !== 'Spark')).spark(),
      'chain-unavailable',
    );
  });

  it('lists only wallet-supported EVM chains with a numeric chain id per environment kind', () => {
    const registry = ChainRegistry.fromApi(CHAINS);
    expect(registry.evmChains('prd' as WalletEnv).map((c) => c.chainId)).toEqual([1]);
    expect(registry.evmChains('dev' as WalletEnv).map((c) => c.chainId)).toEqual([11155111]);
    expectWalletError(() => registry.evmChain(137), 'chain-unavailable');
  });

  it('falls back to the release-pinned snapshot', () => {
    const registry = ChainRegistry.fromSnapshot(SNAPSHOT);
    expect(registry.isLive).toBe(false);
    expect(registry.spark().family).toBe('Spark');
  });
});

describe('DfxData', () => {
  function api(results: Array<{ ok?: unknown; error?: ApiException }>): { data: DfxData; calls: () => number } {
    let index = 0;
    const calls = { count: 0 };
    const walletData = {
      prices: async () => {
        calls.count++;
        const result = results[index++];
        if (result?.error) throw result.error;
        return result?.ok;
      },
    } as unknown as WalletDataApi;
    const backoff = async () => 0;
    return { data: new DfxData(walletData, {} as never, { backoffMs: backoff }), calls: () => calls.count };
  }

  it('retries 429/5xx with backoff and then succeeds', async () => {
    const { data, calls } = api([
      { error: new ApiError(429, 'slow down') },
      { error: new ApiError(503, 'down') },
      { ok: [{ assetId: 1 }] },
    ]);
    await expect(data.query((api) => api.prices({ assetIds: [1], currency: 'CHF' }))).resolves.toHaveLength(1);
    expect(calls()).toBe(3);
  });

  it('fails fast on 4xx and wraps the last failure as ProviderUnavailableError', async () => {
    const { data, calls } = api([{ error: new ApiError(400, 'bad') }]);
    await expect(data.query((api) => api.prices({ assetIds: [1], currency: 'CHF' }))).rejects.toBeInstanceOf(
      ProviderUnavailableError,
    );
    expect(calls()).toBe(1);

    const exhausted = api([
      { error: new ApiError(500, 'x') },
      { error: new ApiError(500, 'x') },
      { error: new ApiError(500, 'x') },
    ]);
    await expect(exhausted.data.query((api) => api.prices({ assetIds: [1], currency: 'CHF' }))).rejects.toBeInstanceOf(
      ProviderUnavailableError,
    );
    expect(exhausted.calls()).toBe(3);
  });
});

describe('PricePolicy', () => {
  const fresh = new Date('2026-10-30T12:00:00Z').getTime();

  function policy(prices: unknown): PricePolicy {
    const walletData = { prices: async () => prices } as unknown as WalletDataApi;
    return new PricePolicy(walletData, { now: () => fresh });
  }

  it('prices by asset id and marks stale prices', async () => {
    const prices = await policy([
      { assetId: 1, currency: 'CHF', price: 50000, isValid: true, timestamp: new Date(fresh - 60_000).toISOString() },
      { assetId: 2, currency: 'CHF', price: 3, isValid: true, timestamp: new Date(fresh - 10 * 60_000).toISOString() },
      { assetId: 3, currency: 'CHF', price: Number.NaN, isValid: true, timestamp: new Date(fresh).toISOString() },
    ]).prices([1, 2, 3, 4], 'CHF');

    expect(prices.get(1)).toEqual({ price: 50000, stale: false });
    expect(prices.get(2)).toEqual({ price: 3, stale: true });
    expect(prices.has(3)).toBe(false);
    expect(prices.has(4)).toBe(false);
  });

  it('returns an empty map when the capability is unavailable', async () => {
    const walletData = {
      prices: async () => {
        throw new ProviderUnavailableError();
      },
    } as unknown as WalletDataApi;
    const prices = await new PricePolicy(walletData).prices([1], 'CHF');
    expect(prices.size).toBe(0);
  });
});

describe('Blocklists', () => {
  it('matches locally from the snapshot and refreshes best-effort', async () => {
    const lists = new Blocklists(SNAPSHOT.blocklists);
    expect(lists.isPhishingDomain('evil.EXAMPLE')).toBe(true);
    expect(lists.isPhishingDomain('ok.example')).toBe(false);
    expect(lists.isScamAddress('0xDEAD')).toBe(true);

    const walletData = {
      list: async (id: string) => (id === 'PhishingDomains' ? ['new.example'] : ['0xbeef']),
    } as unknown as WalletDataApi;
    await lists.refresh(walletData);
    expect(lists.isPhishingDomain('new.example')).toBe(true);
    expect(lists.isPhishingDomain('evil.example')).toBe(false);
    expect(lists.isScamAddress('0xdead')).toBe(false);

    const failing = { list: async () => Promise.reject(new Error('down')) } as unknown as WalletDataApi;
    await expect(lists.refresh(failing)).resolves.toBeUndefined();
    expect(lists.isScamAddress('0xbeef')).toBe(true);
  });
});
