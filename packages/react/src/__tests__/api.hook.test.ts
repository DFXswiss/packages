let mockCurrentToken: string | undefined = 'token-a';
let mockTokenSessions: Record<string, { account?: number; user?: number; address?: string; role?: string }> = {};
const mockSetAuthToken = jest.fn();
let mockFetch: jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({
    getAuthToken: () => mockCurrentToken,
    getAuthTokenSession: (token?: string) => (token ? mockTokenSessions[token] : undefined),
    setAuthToken: mockSetAuthToken,
  }),
}));

import { useApi } from '../hooks/api.hook';
import type { CallConfig } from '../hooks/api.hook';

function unauthorizedResponse(): Response {
  return {
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    json: () => Promise.resolve({ statusCode: 401, message: 'Unauthorized' }),
  } as unknown as Response;
}

function successResponse(): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({ result: 'ok' }),
  } as unknown as Response;
}

describe('useApi 401 retry behavior', () => {
  beforeEach(() => {
    mockCurrentToken = 'token-a';
    mockTokenSessions = {
      'token-a': { account: 101, user: 11, address: 'address-a', role: 'User' },
      'token-b': { account: 202, user: 22, address: 'address-b', role: 'User' },
      'same-scope-token-b': { account: 101, user: 11, address: 'address-a', role: 'User' },
      'same-user-new-address': { account: 101, user: 11, address: 'address-c', role: 'User' },
      'explicit-token-a': { account: 303, user: 33, address: 'explicit-address', role: 'User' },
      'current-token-b': { account: 202, user: 44, address: 'current-address', role: 'User' },
      'current-token-c': { account: 202, user: 44, address: 'current-address', role: 'User' },
      'accountless-token-a': { role: 'KycClientCompany' },
      'accountless-token-b': { role: 'KycClientCompany' },
      'missing-user-token-a': { account: 404, address: 'address-a', role: 'User' },
      'missing-user-token-b': { account: 404, address: 'address-a', role: 'User' },
      'missing-role-token-a': { account: 405, user: 55, address: 'address-a' },
      'missing-role-token-b': { account: 405, user: 55, address: 'address-a' },
    };
    mockFetch = jest.fn();
    mockFetch.mockResolvedValue(unauthorizedResponse());
    global.fetch = mockFetch as unknown as typeof fetch;
    mockSetAuthToken.mockReset();
  });

  it.each(['DELETE', 'POST', 'PUT'] as const)(
    'does not retry a %s with a newer token after the original token gets 401',
    async (method) => {
      mockFetch.mockImplementationOnce(async () => {
        mockCurrentToken = 'token-b';
        return unauthorizedResponse();
      });

      const request = useApi().call({ url: '/resource', method });

      await expect(request).rejects.toMatchObject({ statusCode: 401 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect((mockFetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({
        Authorization: 'Bearer token-a',
      });
      expect(mockSetAuthToken).not.toHaveBeenCalled();
    },
  );

  it('retries a GET with the newer token after the original token gets 401', async () => {
    mockFetch
      .mockImplementationOnce(async () => {
        mockCurrentToken = 'same-scope-token-b';
        return unauthorizedResponse();
      })
      .mockResolvedValueOnce(successResponse());

    await expect(useApi().call({ url: '/resource', method: 'GET' })).resolves.toEqual({ result: 'ok' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect((mockFetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({ Authorization: 'Bearer token-a' });
    expect((mockFetch.mock.calls[1][1] as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer same-scope-token-b',
    });
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry a GET when the current token belongs to another account', async () => {
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = 'token-b';
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect((mockFetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({ Authorization: 'Bearer token-a' });
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry a GET after logout clears the current token', async () => {
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = undefined;
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it.each([
    ['two accountless company tokens', 'accountless-token-a', 'accountless-token-b'],
    ['tokens without a user claim', 'missing-user-token-a', 'missing-user-token-b'],
    ['tokens without a role claim', 'missing-role-token-a', 'missing-role-token-b'],
  ])('does not retry a GET across %s', async (_description, originalToken, currentToken) => {
    mockCurrentToken = originalToken;
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = currentToken;
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry a GET when the current token has a different role', async () => {
    mockTokenSessions['same-scope-admin-token'] = {
      account: 101,
      user: 11,
      address: 'address-a',
      role: 'Admin',
    };
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = 'same-scope-admin-token';
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry an explicit foreign token using the current token scope', async () => {
    mockCurrentToken = 'current-token-b';
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = 'current-token-c';
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET', token: 'explicit-token-a' })).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect((mockFetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer explicit-token-a',
    });
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry when a refreshed token changes the address within the same account and user', async () => {
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = 'same-user-new-address';
      return unauthorizedResponse();
    });

    await expect(useApi().call({ url: '/resource', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not replace an explicit token=false request with the current session token after 401', async () => {
    mockCurrentToken = 'token-b';
    mockFetch.mockImplementationOnce(async () => {
      mockCurrentToken = 'token-c';
      return unauthorizedResponse();
    });

    const config: CallConfig = { url: '/public-resource', method: 'GET', token: false };
    await expect(useApi().call(config)).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect((mockFetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({ Authorization: '' });
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });
});
