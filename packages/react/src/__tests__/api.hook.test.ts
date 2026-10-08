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

  it('does not resend a 401 request without a token when a parallel request already cleared the session', async () => {
    mockGetAuthToken.mockReturnValueOnce('stored-session').mockReturnValue(undefined);
    const api = useApi();

    await expect(api.call({ url: 'user', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer stored-session');
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('retries a 401 request once with the new token when the session was refreshed in the meantime', async () => {
    mockGetAuthToken.mockReturnValueOnce('stored-session').mockReturnValue('refreshed-session');
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ statusCode: 401, message: 'Unauthorized' }),
      })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: 1 }) });
    const api = useApi();

    await expect(api.call({ url: 'user', method: 'GET' })).resolves.toEqual({ id: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const firstInit = mockFetch.mock.calls[0][1] as RequestInit;
    const retryInit = mockFetch.mock.calls[1][1] as RequestInit;
    expect((firstInit.headers as Record<string, string>).Authorization).toBe('Bearer stored-session');
    expect((retryInit.headers as Record<string, string>).Authorization).toBe('Bearer refreshed-session');
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });
});
