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

import { useApi } from '../hooks/api.hook';
import { useChainApi } from '../hooks/chain.hook';
import { usePasskeyApi } from '../hooks/passkey.hook';
import { useAsset } from '../hooks/asset.hook';
import { useSwap } from '../hooks/swap.hook';

jest.mock('../hooks/api-session.hook', () => ({ useApiSession: () => ({ isLoggedIn: false }) }));

jest.mock('../hooks/user.hook', () => ({ useUser: () => ({ changeUserAddress: jest.fn() }) }));

jest.mock('../contexts/user.context', () => ({ useUserContext: () => ({ user: undefined }) }));

jest.mock('../contexts/session.context', () => ({ useSessionContext: () => ({ tokenStore: { get: jest.fn() } }) }));

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

function lastCall(): [string, RequestInit] {
  return mockFetch.mock.calls[mockFetch.mock.calls.length - 1] as [string, RequestInit];
}

beforeEach(() => {
  mockGetAuthToken.mockReset().mockReturnValue(undefined);
  mockSetAuthToken.mockReset();
  mockFetch.mockReset().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });
  globalThis.fetch = mockFetch as unknown as typeof fetch;
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

describe('skipAuthHandling', () => {
  it('does not clear the session or retry on 401', async () => {
    mockGetAuthToken.mockReturnValue('stored-session');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ statusCode: 401, message: 'nope' }),
    });

    await expect(
      useApi().call({ url: 'auth/passkey/link', method: 'POST', token: 'passkey-token', skipAuthHandling: true }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });
});

describe('usePasskeyApi', () => {
  it('carries the explicit token and skips auth handling', async () => {
    await usePasskeyApi().backupSeen(3, 'passkey-token');
    const [url, init] = lastCall();
    expect(url).toContain('passkey/wallets/3/backupSeen');
    expect(init.method).toBe('PUT');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer passkey-token');
  });

  it('revokes with the reason body', async () => {
    await usePasskeyApi().revoke(3, 'Lost', 'passkey-token');
    const [url, init] = lastCall();
    expect(url).toContain('passkey/wallets/3/revoke');
    expect(JSON.parse(init.body as string)).toEqual({ reason: 'Lost' });
  });
});

describe('useChainApi', () => {
  it('lists the classification without a token', async () => {
    await useChainApi().list();
    const [url, init] = lastCall();
    expect(url).toContain('walletData/chains');
    expect((init.headers as Record<string, string>).Authorization).toBe('');
  });
});

describe('useAsset', () => {
  it('loads the public list without a chain filter and without a token', async () => {
    await useAsset().getAssets();
    const [url, init] = lastCall();
    expect(url).toContain('asset?includePrivate=false');
    expect(url).not.toContain('blockchains');
    expect((init.headers as Record<string, string>).Authorization).toBe('');
  });

  it('keeps the chain filter and the token for private assets', async () => {
    mockGetAuthToken.mockReturnValue('session');
    await useAsset().getAssets(['Ethereum'] as never, true);
    const [url, init] = lastCall();
    expect(url).toContain('blockchains=Ethereum');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer session');
  });
});

describe('useSwap confirm', () => {
  it('confirms with PUT', async () => {
    await useSwap().confirmSwap(5, {} as never);
    const [, init] = lastCall();
    expect(init.method).toBe('PUT');
  });
});
