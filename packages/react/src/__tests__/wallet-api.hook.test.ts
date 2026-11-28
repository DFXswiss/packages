const mockGetAuthToken = jest.fn();
const mockSetAuthToken = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: unknown) => fn,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({ getAuthToken: mockGetAuthToken, setAuthToken: mockSetAuthToken }),
}));

jest.mock('../contexts/fiat.context', () => ({ useFiatContext: () => ({ currencies: [] }) }));

import { useBuy } from '../hooks/buy.hook';
import { useSell } from '../hooks/sell.hook';
import { useWalletApi } from '../hooks/wallet-api.hook';

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

function lastCall(): [string, RequestInit] {
  return mockFetch.mock.calls[mockFetch.mock.calls.length - 1] as [string, RequestInit];
}

function authorization(init: RequestInit): string {
  return (init.headers as Record<string, string>).Authorization;
}

beforeEach(() => {
  mockGetAuthToken.mockReset().mockReturnValue('customer-session');
  mockSetAuthToken.mockReset();
  mockFetch.mockReset().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
  globalThis.fetch = mockFetch as unknown as typeof fetch;
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

describe('useWalletApi', () => {
  it('loads the public config without any token', async () => {
    await useWalletApi('wallet-session').getConfig();
    const [url, init] = lastCall();
    expect(url).toMatch(/\/v1\/wallet\/config$/);
    expect(init.method).toBe('GET');
    expect(authorization(init)).toBe('');
  });

  it('sends the wallet session, never the customer session', async () => {
    await useWalletApi('wallet-session').getBitcoinAccount('BitcoinRegtest', { addresses: ['bcrt1q…'] });
    let [url, init] = lastCall();
    expect(url).toMatch(/\/v1\/wallet\/bitcoin\/BitcoinRegtest\/account$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ addresses: ['bcrt1q…'] });
    expect(authorization(init)).toBe('Bearer wallet-session');

    await useWalletApi().getAddresses();
    [url, init] = lastCall();
    expect(url).toMatch(/\/v1\/wallet\/addresses$/);
    expect(authorization(init)).toBe('');
  });

  it('uses the Bitcoin fees, prepare and submit routes', async () => {
    const api = useWalletApi('s');
    await api.getBitcoinFees('BitcoinRegtest');
    expect(lastCall()[0]).toMatch(/\/v1\/wallet\/bitcoin\/BitcoinRegtest\/fees$/);

    const prepare = { addresses: ['a'], changeAddress: 'c', destination: 'd', amount: '1000', feeRate: 'slow' as const };
    await api.prepareBitcoinSend('BitcoinRegtest', prepare);
    expect(lastCall()[0]).toMatch(/\/v1\/wallet\/bitcoin\/BitcoinRegtest\/prepare$/);
    expect(JSON.parse(lastCall()[1].body as string)).toEqual(prepare);

    await api.submitBitcoinSend('BitcoinRegtest', { prepareId: 'p', psbt: 'cHNidP8=' });
    expect(lastCall()[0]).toMatch(/\/v1\/wallet\/bitcoin\/BitcoinRegtest\/submit$/);
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({ prepareId: 'p', psbt: 'cHNidP8=' });

    await api.upsertAddress({ chain: 'bitcoin', address: 'bcrt1q…' });
    expect(lastCall()[1].method).toBe('PUT');
    await api.getCredentials();
    expect(lastCall()[0]).toMatch(/\/v1\/wallet\/credentials$/);
  });

  it('does not clear the customer session on a wallet 401', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ statusCode: 401, code: 'SessionInvalid', message: 'Session invalid' }),
    });

    await expect(useWalletApi('expired').getAddresses()).rejects.toMatchObject({
      statusCode: 401,
      code: 'SessionInvalid',
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });
});

describe('simulate payment and payout', () => {
  it('simulates a buy payment with the customer session', async () => {
    await useBuy().simulatePaymentFor(12, { amount: 100, currency: 'CHF', idempotencyKey: 'k-1' });
    const [url, init] = lastCall();
    expect(url).toMatch(/\/v1\/buy\/12\/simulatePayment$/);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual({ amount: 100, currency: 'CHF', idempotencyKey: 'k-1' });
    expect(authorization(init)).toBe('Bearer customer-session');
  });

  it('simulates a sell payout', async () => {
    await useSell().simulatePayoutFor(34);
    const [url, init] = lastCall();
    expect(url).toMatch(/\/v1\/sell\/34\/simulatePayout$/);
    expect(init.method).toBe('PUT');
    expect(authorization(init)).toBe('Bearer customer-session');
  });
});
