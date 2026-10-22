import { UserApi } from '../client/UserApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { ApiException } from '../definitions/error';

function createMockHttpClient(response: { resolve?: any; reject?: any }) {
  const requestMock = jest
    .fn()
    .mockImplementation(() => (response.reject ? Promise.reject(response.reject) : Promise.resolve(response.resolve)));

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
    it('sends PUT to v2 user/reactivate without a body and returns the new token', async () => {
      const mockHttp = createMockHttpClient({ resolve: { accessToken: 'new-token' } });
      const api = new UserApi(mockHttp);

      await expect(api.reactivateAddress()).resolves.toEqual({ accessToken: 'new-token' });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'user/reactivate', method: 'PUT', version: 'v2' });
    });

    it('leaves the client token to the caller', async () => {
      const mockHttp = createMockHttpClient({ resolve: { accessToken: 'new-token' } });
      const api = new UserApi(mockHttp);

      await api.reactivateAddress();

      expect(mockHttp.setToken).not.toHaveBeenCalled();
    });

    it('passes a rejection through', async () => {
      const error = new ApiException(400, 'Address is blocked');
      const mockHttp = createMockHttpClient({ reject: error });
      const api = new UserApi(mockHttp);

      await expect(api.reactivateAddress()).rejects.toBe(error);
    });
  });
});
