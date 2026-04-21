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

const noopFetch = jest.fn() as any;

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
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

      await client.request({ url: 'asset', method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.dfx.swiss/v1/asset',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('uses custom version', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

      await client.request({ url: 'user', method: 'GET', version: 'v2' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.dfx.swiss/v2/user', expect.anything());
    });

    it('sends Authorization header when token is set', async () => {
      const mockFetch = createMockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      });
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });
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
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });
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
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

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
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

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
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

      await expect(client.request({ url: 'missing', method: 'GET' })).rejects.toThrow(ApiException);
      await expect(client.request({ url: 'missing', method: 'GET' })).rejects.toMatchObject({
        statusCode: 404,
        message: 'Route not found',
      });
    });

    it('throws ApiException with status 0 on network error', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const client = new DfxHttpClient({ apiUrl: 'https://api.dfx.swiss/v1', fetchFn: mockFetch as any });

      await expect(client.request({ url: 'asset', method: 'GET' })).rejects.toMatchObject({
        statusCode: 0,
        message: 'Network error: fetch failed',
      });
    });
  });
});
