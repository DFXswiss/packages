let mockCurrentToken: string | undefined;
let mockTokenSessions: Record<string, { account?: number; user?: number; address?: string; role?: string }>;
const mockSetAuthToken = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (callback: (...args: any[]) => unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({
    getAuthToken: () => mockCurrentToken,
    getAuthTokenSession: (token?: string) => (token ? mockTokenSessions[token] : undefined),
    setAuthToken: mockSetAuthToken,
  }),
}));

import { ApiException } from '../definitions/error';
import { useApi, ResponseType } from '../hooks/api.hook';

function response(overrides: Partial<Response> = {}): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { entries: () => [['content-type', 'application/pdf']] } as unknown as Headers,
    json: jest.fn().mockResolvedValue({ result: 'json' }),
    text: jest.fn().mockResolvedValue('csv-data'),
    blob: jest.fn().mockResolvedValue({ type: 'application/pdf', contents: 'pdf-data' }),
    ...overrides,
  } as Response;
}

describe('useApi response and failure contracts', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    mockCurrentToken = 'session-token';
    mockTokenSessions = { 'session-token': { account: 1, user: 2, address: 'address-a', role: 'User' } };
    mockSetAuthToken.mockReset();
    fetchMock = jest.fn().mockResolvedValue(response());
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns JSON, text, and blob response types with their documented headers', async () => {
    const api = useApi();
    expect(api.defaultUrl).toBe('https://api.dfx.swiss/v1');
    const json = await api.call({ url: 'user', method: 'GET' });
    const text = await api.call({ url: 'transaction.csv', method: 'GET', responseType: ResponseType.TEXT });
    const blob = await api.call({ url: 'receipt.pdf', method: 'GET', responseType: ResponseType.BLOB });

    expect(json).toEqual({ result: 'json' });
    expect(text).toBe('csv-data');
    expect(blob).toMatchObject({ headers: { 'content-type': 'application/pdf' } });
    expect((blob as { data: { type: string; contents: string } }).data).toEqual({
      type: 'application/pdf',
      contents: 'pdf-data',
    });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.dfx.swiss/v1/user',
      'https://api.dfx.swiss/v1/transaction.csv',
      'https://api.dfx.swiss/v1/receipt.pdf',
    ]);
  });

  it('treats an empty success body as undefined and preserves raw request bodies when noJson is set', async () => {
    fetchMock.mockResolvedValueOnce(response({ json: jest.fn().mockRejectedValue(new SyntaxError('empty body')) }));
    const empty = await useApi().call({ url: 'empty', method: 'GET' });
    const rawBody = { file: 'document.pdf' };
    await useApi().call({ url: 'upload', method: 'POST', token: false, data: rawBody, noJson: true });

    expect(empty).toBeUndefined();
    const init = fetchMock.mock.calls[1][1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(init.body).toBe(rawBody);
    expect(init.headers).toEqual({ Authorization: '' });
  });

  it('runs matching special handling and exposes only sanitized payment-conflict data', async () => {
    const action = jest.fn();
    fetchMock.mockResolvedValueOnce(
      response({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: jest.fn().mockResolvedValue({
          statusCode: 409,
          message: 'Payment already exists',
          code: 'PAYMENT_INFO_ALREADY_EXISTS',
          details: { existingUid: 'existing-uid', requestStatus: 'WaitingForPayment', internal: 'not public' },
        }),
      }),
    );

    const error = await useApi()
      .call({ url: 'buy/paymentInfos', method: 'PUT', specialHandling: { action, statusCode: 409 } })
      .catch((reason: unknown) => reason);

    expect(action).toHaveBeenCalledTimes(1);
    expect(error).toBeInstanceOf(ApiException);
    expect(error).toMatchObject({
      statusCode: 409,
      message: 'Payment already exists',
      code: 'PAYMENT_INFO_ALREADY_EXISTS',
      paymentInfoConflict: { existingUid: 'existing-uid', requestStatus: 'WaitingForPayment' },
    });
    expect(error).not.toHaveProperty('details');
  });

  it('falls back to status text when error JSON is unreadable and converts network errors', async () => {
    fetchMock
      .mockResolvedValueOnce(
        response({
          ok: false,
          status: 503,
          statusText: 'Unavailable',
          json: jest.fn().mockRejectedValue(new Error('invalid json')),
        }),
      )
      .mockRejectedValueOnce(new TypeError('socket closed'))
      .mockRejectedValueOnce('DNS lookup failed')
      .mockResolvedValueOnce(
        response({
          ok: false,
          status: 502,
          statusText: undefined,
          json: jest.fn().mockRejectedValue(new Error('invalid json')),
        }),
      );

    await expect(useApi().call({ url: 'failure', method: 'GET' })).rejects.toMatchObject({
      statusCode: 503,
      message: 'Unavailable',
    });
    await expect(useApi().call({ url: 'offline', method: 'GET' })).rejects.toMatchObject({
      statusCode: 0,
      message: 'Network error: socket closed',
    });
    await expect(useApi().call({ url: 'offline-string', method: 'GET' })).rejects.toMatchObject({
      statusCode: 0,
      message: 'Network error: DNS lookup failed',
    });
    await expect(useApi().call({ url: 'unknown-error', method: 'GET' })).rejects.toMatchObject({
      statusCode: 502,
      message: 'Unknown error',
    });
  });

  it('clears the bearer after a 401 for the unchanged current token', async () => {
    fetchMock.mockResolvedValue(
      response({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ statusCode: 401, message: 'Expired' }),
      }),
    );

    await expect(useApi().call({ url: 'private', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });
    expect(mockSetAuthToken).toHaveBeenCalledWith(undefined);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a 401 GET with a rotated token only when both tokens prove the same user scope', async () => {
    const unauthorized = response({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: jest.fn().mockResolvedValue({ statusCode: 401, message: 'Token rotated during request' }),
    });
    mockTokenSessions['rotated-token'] = { account: 1, user: 2, address: 'address-a', role: 'User' };
    fetchMock
      .mockImplementationOnce(async () => {
        mockCurrentToken = 'rotated-token';
        return unauthorized;
      })
      .mockResolvedValueOnce(response({ json: jest.fn().mockResolvedValue({ result: 'retried' }) }));

    await expect(useApi().call({ url: 'profile', method: 'GET' })).resolves.toEqual({ result: 'retried' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toEqual({
      Authorization: 'Bearer session-token',
      'Content-Type': 'application/json',
    });
    expect((fetchMock.mock.calls[1][1] as RequestInit).headers).toEqual({
      Authorization: 'Bearer rotated-token',
      'Content-Type': 'application/json',
    });
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it.each([
    ['a different account', { account: 9, user: 2, address: 'address-a', role: 'User' }],
    ['an incomplete scope', undefined],
  ])('does not retry a 401 GET with a rotated token that has %s', async (_reason, rotatedScope) => {
    const unauthorized = response({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: jest.fn().mockResolvedValue({ statusCode: 401, message: 'Unauthorized' }),
    });
    mockCurrentToken = 'session-token';
    if (rotatedScope) mockTokenSessions['rotated-token'] = rotatedScope;
    else delete mockTokenSessions['rotated-token'];
    fetchMock.mockImplementationOnce(async () => {
      mockCurrentToken = 'rotated-token';
      return unauthorized;
    });

    await expect(useApi().call({ url: 'profile', method: 'GET' })).rejects.toMatchObject({ statusCode: 401 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('does not retry a non-GET request after token rotation', async () => {
    const unauthorized = response({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: jest.fn().mockResolvedValue({ statusCode: 401, message: 'Unauthorized' }),
    });
    mockCurrentToken = 'session-token';
    mockTokenSessions['rotated-token'] = mockTokenSessions['session-token'];
    fetchMock.mockImplementationOnce(async () => {
      mockCurrentToken = 'rotated-token';
      return unauthorized;
    });

    await expect(useApi().call({ url: 'update', method: 'PUT', data: { name: 'new' } })).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('keeps explicitly anonymous requests anonymous and does not clear the signed-in token on their 401', async () => {
    fetchMock.mockResolvedValueOnce(
      response({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ statusCode: 401, message: 'Anonymous request denied' }),
      }),
    );

    await expect(useApi().call({ url: 'public-preview', method: 'GET', token: false })).rejects.toMatchObject({
      statusCode: 401,
    });

    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toEqual({
      Authorization: '',
      'Content-Type': 'application/json',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mockSetAuthToken).not.toHaveBeenCalled();
  });

  it('rejects an unsupported response type rather than silently parsing it as JSON', async () => {
    await expect(useApi().call({ url: 'unknown', method: 'GET', responseType: 'xml' as ResponseType })).rejects.toThrow(
      'Unknown response type',
    );
  });
});
