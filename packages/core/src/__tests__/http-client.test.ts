import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';
import { ApiException } from '../definitions/error';

function createMockFetch(response: {
  ok: boolean;
  status: number;
  statusText?: string;
  json?: jest.Mock;
  text?: jest.Mock;
  blob?: jest.Mock;
  headers?: any;
}) {
  return jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    statusText: response.statusText ?? '',
    json: response.json ?? jest.fn().mockResolvedValue(undefined),
    text: response.text ?? jest.fn().mockResolvedValue(''),
    blob: response.blob ?? jest.fn().mockResolvedValue({}),
    headers: response.headers ?? { entries: () => [] },
  });
}

function asFetch(fetchMock: unknown): typeof fetch {
  return fetchMock as typeof fetch;
}

const noopFetch = asFetch(jest.fn());

describe('DfxHttpClient', () => {
  describe('constructor', () => {
    it('strips trailing slash from apiUrl', () => {
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1/', fetchFn: noopFetch });
      expect(client.getApiUrl()).toBe('https://api.dfx.swiss/v1');
    });
  });

  describe('getBaseUrl', () => {
    it('strips version from apiUrl', () => {
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: noopFetch });
      expect(client.getBaseUrl()).toBe('https://api.dfx.swiss');
    });
  });

  describe('token management', () => {
    it('stores and retrieves token', () => {
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: noopFetch });
      expect(client.getToken()).toBeUndefined();
      client.setToken('test-token');
      expect(client.getToken()).toBe('test-token');
      client.setToken(undefined);
      expect(client.getToken()).toBeUndefined();
    });
  });

  describe('request', () => {
    it('sends GET request to versioned URL', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([{ id: 1 }]),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await client.request({ url: 'asset', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.dfx.swiss/v1/asset',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('normalizes a leading-slash path to a single-slash URL', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await client.request({ url: '/realunit/admin/quotes', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.dfx.swiss/v1/realunit/admin/quotes',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('uses custom version', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await client.request({ url: 'user', method: 'GET', version: 'v2' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.dfx.swiss/v2/user', expect.anything());
    });

    it('sends absolute requests without adding the configured API version', async () => {
      const mockFetch = createMockFetch({ ok: true, status: 200 });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await client.requestAbsolute({ url: 'https://api.dfx.swiss/v2/kyc/session', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.dfx.swiss/v2/kyc/session', expect.anything());
    });

    it('sends Authorization header when token is set', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });
      client.setToken('my-token');

      await client.request({ url: 'user', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer my-token' }),
        }),
      );
    });

    it('omits Authorization header when token is false', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });
      client.setToken('my-token');

      await client.request({ url: 'asset', method: 'GET', token: false });

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });

    it('sends JSON body for POST', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await client.request({ url: 'auth', method: 'POST', data: { address: '0x123' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ address: '0x123' }),
        }),
      );
    });

    it('returns text for TEXT response type', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('csv,data'),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      const result = await client.request({ url: 'export', method: 'GET', responseType: ResponseType.TEXT });
      expect(result).toBe('csv,data');
    });

    it('throws ApiException on error response', async () => {
      const mockFetch = createMockFetch({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ statusCode: 404, message: 'Route not found' }),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'missing', method: 'GET' })).rejects.toThrow(ApiException);
      await expect(client.request({ url: 'missing', method: 'GET' })).rejects.toMatchObject({
        statusCode: 404,
        message: 'Route not found',
      });
    });

    it('preserves typed payment-info conflict details from the API body', async () => {
      const mockFetch = createMockFetch({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: jest.fn().mockResolvedValue({
          statusCode: 409,
          message: 'Payment info already exists',
          code: 'PAYMENT_INFO_ALREADY_EXISTS',
          details: { existingUid: 'quote-123', requestStatus: 'Processing', iban: 'secret' },
        }),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'buy/paymentInfos', method: 'PUT' })).rejects.toMatchObject({
        statusCode: 409,
        paymentInfoConflict: { existingUid: 'quote-123', requestStatus: 'Processing' },
      });
    });

    it('throws ApiException with status 0 on network error', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'asset', method: 'GET' })).rejects.toMatchObject({
        statusCode: 0,
        message: 'Network error: fetch failed',
      });
    });

    it('keeps a valid payment-info request status when the conflict omits its uid', async () => {
      const mockFetch = createMockFetch({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: jest.fn().mockResolvedValue({
          statusCode: 409,
          message: 'Payment info already exists',
          code: 'PAYMENT_INFO_ALREADY_EXISTS',
          details: { requestStatus: 'Completed', iban: 'must not be exposed' },
        }),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'buy/paymentInfos', method: 'PUT' })).rejects.toMatchObject({
        paymentInfoConflict: { requestStatus: 'Completed' },
      });
    });

    it('uses explicit token overrides, special handling, and no-JSON upload headers', async () => {
      const mockFetch = createMockFetch({ ok: true, status: 200 });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss', fetchFn: asFetch(mockFetch) });
      client.setToken('stored-token');
      const action = jest.fn();

      await client.request({
        url: 'upload',
        method: 'POST',
        version: 'v2',
        data: 'binary-body',
        noJson: true,
        token: 'request-token',
        headers: { 'x-upload': 'fixture' },
        specialHandling: { statusCode: 200, action },
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.dfx.swiss/v2/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer request-token', 'x-upload': 'fixture' },
        body: 'binary-body',
      });
      expect(action).toHaveBeenCalledTimes(1);
    });

    it('does not call special handling for a different response status', async () => {
      const mockFetch = createMockFetch({ ok: true, status: 204 });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });
      const action = jest.fn();

      await client.request({
        url: 'asset',
        method: 'GET',
        specialHandling: { statusCode: 401, action },
      });

      expect(action).not.toHaveBeenCalled();
    });

    it('returns blob data with response headers', async () => {
      const blob = { size: 12 };
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        blob: jest.fn().mockResolvedValue(blob),
        headers: {
          entries: () => [
            ['content-type', 'application/pdf'],
            ['x-file', 'receipt'],
          ],
        },
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'file', method: 'GET', responseType: ResponseType.BLOB })).resolves.toEqual({
        data: blob,
        headers: { 'content-type': 'application/pdf', 'x-file': 'receipt' },
      });
    });

    it('returns undefined for an invalid successful JSON body', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockRejectedValue(new SyntaxError('invalid JSON')),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'empty', method: 'GET' })).resolves.toBeUndefined();
    });

    it('uses a default v1 path when apiUrl has no version', async () => {
      const mockFetch = createMockFetch({ ok: true, status: 200 });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss', fetchFn: asFetch(mockFetch) });

      await client.request({ url: 'asset', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.dfx.swiss/v1/asset', expect.anything());
    });

    it('uses the platform fetch function when no fetch override is provided', async () => {
      const response = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ source: 'mocked-global-fetch' }),
      } as unknown as Response;
      const fetchStub = jest.fn().mockResolvedValue(response);
      const originalFetch = globalThis.fetch;
      globalThis.fetch = fetchStub as unknown as typeof fetch;

      try {
        const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1' });

        await expect(client.request({ url: 'asset', method: 'GET' })).resolves.toEqual({
          source: 'mocked-global-fetch',
        });
        expect(fetchStub).toHaveBeenCalledWith(
          'https://api.dfx.swiss/v1/asset',
          expect.objectContaining({ method: 'GET' }),
        );
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('uses status text when an error response has no readable JSON', async () => {
      const mockFetch = createMockFetch({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: jest.fn().mockRejectedValue(new SyntaxError('invalid JSON')),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'asset', method: 'GET' })).rejects.toMatchObject({
        statusCode: 502,
        message: 'Bad Gateway',
      });
    });

    it('uses the generic message when both the error body and status text are absent', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: undefined,
        json: jest.fn().mockRejectedValue(new SyntaxError('invalid JSON')),
      } as unknown as Response);
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'asset', method: 'GET' })).rejects.toMatchObject({
        statusCode: 500,
        message: 'Unknown error',
      });
    });

    it('stringifies non-Error network rejections', async () => {
      const mockFetch = jest.fn().mockRejectedValue('offline');
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(client.request({ url: 'asset', method: 'GET' })).rejects.toMatchObject({
        statusCode: 0,
        message: 'Network error: offline',
      });
    });

    it('rejects unsupported response types instead of silently parsing JSON', async () => {
      const mockFetch = createMockFetch({ ok: true, status: 200 });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: asFetch(mockFetch) });

      await expect(
        client.request({ url: 'asset', method: 'GET', responseType: 'xml' as ResponseType }),
      ).rejects.toThrow('Unknown response type');
    });
  });
});
