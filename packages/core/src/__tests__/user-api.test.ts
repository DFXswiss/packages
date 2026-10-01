import { UserApi } from '../client/UserApi';
import { DfxHttpClient } from '../client/DfxHttpClient';

function createMockHttpClient(response?: any) {
  const requestMock = jest.fn().mockResolvedValue(response);

  return {
    request: requestMock,
    requestAbsolute: jest.fn(),
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

describe('UserApi', () => {
  describe('reactivateAddress', () => {
    it('sends POST to the reactivate endpoint and returns the SignIn', async () => {
      const mockHttp = createMockHttpClient({ accessToken: 'token' });
      const api = new UserApi(mockHttp);

      const result = await api.reactivateAddress('0xabc');

      expect(result).toEqual({ accessToken: 'token' });
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'user/addresses/0xabc/reactivate',
        method: 'POST',
        version: 'v2',
      });
    });

    it('URL-encodes the address in the path', async () => {
      const mockHttp = createMockHttpClient({ accessToken: 'token' });
      const api = new UserApi(mockHttp);

      await api.reactivateAddress('a/b?c');

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'user/addresses/a%2Fb%3Fc/reactivate',
        method: 'POST',
        version: 'v2',
      });
    });

    it('does not opt out of the auth token and sends no body', async () => {
      const mockHttp = createMockHttpClient({ accessToken: 'token' });
      const api = new UserApi(mockHttp);

      await api.reactivateAddress('0xabc');

      const options = mockHttp.request.mock.calls[0][0];
      expect(options).not.toHaveProperty('token');
      expect(options).not.toHaveProperty('data');
    });
  });

  describe('deleteAddress', () => {
    it('sends DELETE to the encoded address path with version v2', async () => {
      const mockHttp = createMockHttpClient();
      const api = new UserApi(mockHttp);

      await api.deleteAddress('a/b?c');

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'user/addresses/a%2Fb%3Fc',
        method: 'DELETE',
        version: 'v2',
      });
    });
  });
});
