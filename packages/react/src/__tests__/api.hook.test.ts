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

describe('useApi', () => {
  const originalFetch = globalThis.fetch;
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockGetAuthToken.mockReset();
    mockSetAuthToken.mockReset();
    mockFetch.mockReset();

    mockGetAuthToken.mockReturnValue('stored-session');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ statusCode: 401, message: 'Invalid or expired code' }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it('does not retry or clear the stored session on 401 for a call without a token', async () => {
    const api = useApi();

    await expect(
      api.call({ url: 'auth/mail/code', method: 'POST', data: { secret: 's', code: '123456' }, token: false }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('');
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('clears the stored session on 401 for a call with the stored token', async () => {
    const api = useApi();

    await expect(api.call({ url: 'user', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer stored-session');
    expect(mockSetAuthToken).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).toHaveBeenCalledWith(undefined);
  });
});
