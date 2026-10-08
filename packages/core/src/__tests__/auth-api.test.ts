import { AuthApi } from '../client/AuthApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { ApiException } from '../definitions/error';

function createMockHttpClient(responses: Array<{ resolve?: any; reject?: any }>) {
  let callIndex = 0;
  const requestMock = jest.fn().mockImplementation(() => {
    const response = responses[callIndex++];
    if (response?.reject) return Promise.reject(response.reject);
    return Promise.resolve(response?.resolve);
  });

  return {
    request: requestMock,
    requestAbsolute: jest.fn(),
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

describe('AuthApi', () => {
  describe('authenticate', () => {
    const params = { address: '0x123', signature: '0xabc' };

    it('returns SignIn on success', async () => {
      const mockHttp = createMockHttpClient([{ resolve: { accessToken: 'token123' } }]);
      const api = new AuthApi(mockHttp);

      const result = await api.authenticate(params);

      expect(result).toEqual({ accessToken: 'token123' });
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
    });

    it('retries without token on 409', async () => {
      const mockHttp = createMockHttpClient([
        { reject: new ApiException(409, 'Conflict') },
        { resolve: { accessToken: 'retry-token' } },
      ]);
      const api = new AuthApi(mockHttp);

      const result = await api.authenticate(params);

      expect(result).toEqual({ accessToken: 'retry-token' });
      expect(mockHttp.request).toHaveBeenCalledTimes(2);
      expect(mockHttp.request.mock.calls[1][0]).toMatchObject({ token: false });
    });

    it('throws non-409 errors without retry', async () => {
      const mockHttp = createMockHttpClient([{ reject: new ApiException(401, 'Unauthorized') }]);
      const api = new AuthApi(mockHttp);

      await expect(api.authenticate(params)).rejects.toThrow('Unauthorized');
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('mail login', () => {
    it('signInWithMail does not request a login code', async () => {
      const mockHttp = createMockHttpClient([{ resolve: undefined }]);
      const api = new AuthApi(mockHttp);

      await api.signInWithMail('user@example.com', 'https://example.com/redirect', 'recommendation', 'wallet');

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'auth/mail',
        method: 'POST',
        data: {
          mail: 'user@example.com',
          redirectUri: 'https://example.com/redirect',
          recommendationCode: 'recommendation',
          wallet: 'wallet',
        },
        token: false,
      });
    });

    it('requests a mail login code', async () => {
      const response = { secret: 'mail-login-secret' };
      const mockHttp = createMockHttpClient([{ resolve: response }]);
      const api = new AuthApi(mockHttp);

      await expect(
        api.requestMailLoginCode('user@example.com', 'https://example.com/redirect', 'recommendation', 'wallet'),
      ).resolves.toEqual(response);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'auth/mail',
        method: 'POST',
        data: {
          mail: 'user@example.com',
          redirectUri: 'https://example.com/redirect',
          recommendationCode: 'recommendation',
          wallet: 'wallet',
          withCode: true,
        },
        token: false,
      });
    });

    it('signs in with a mail login code', async () => {
      const response = { accessToken: 'access-token' };
      const mockHttp = createMockHttpClient([{ resolve: response }]);
      const api = new AuthApi(mockHttp);

      await expect(api.signInWithMailCode('mail-login-secret', '123456')).resolves.toEqual(response);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'auth/mail/code',
        method: 'POST',
        data: { secret: 'mail-login-secret', code: '123456' },
        token: false,
      });
    });
  });
});
