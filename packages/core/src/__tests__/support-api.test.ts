import { SupportApi } from '../client/SupportApi';
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

describe('SupportApi', () => {
  describe('setProvisionalApproval', () => {
    it('sends the account-access update and returns its response', async () => {
      const response = {
        id: 42,
        provisionalApprovalDate: '2026-10-30T08:00:00.000Z',
        vipUserIds: [7],
      };
      const mockHttp = createMockHttpClient({ resolve: response });
      const api = new SupportApi(mockHttp);

      await expect(api.setProvisionalApproval(42, true)).resolves.toBe(response);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'support/42/provisionalApproval',
        method: 'PUT',
        data: { enabled: true },
      });
    });

    it('passes a rejection through', async () => {
      const error = new ApiException(403, 'Forbidden');
      const mockHttp = createMockHttpClient({ reject: error });
      const api = new SupportApi(mockHttp);

      await expect(api.setProvisionalApproval(42, false)).rejects.toBe(error);
    });
  });

  describe('setVip', () => {
    it('sends the account-access update and returns its response', async () => {
      const response = { id: 42, vipUserIds: [7, 8] };
      const mockHttp = createMockHttpClient({ resolve: response });
      const api = new SupportApi(mockHttp);

      await expect(api.setVip(42, false)).resolves.toBe(response);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'support/42/vip',
        method: 'PUT',
        data: { enabled: false },
      });
    });

    it('passes a rejection through', async () => {
      const error = new ApiException(403, 'Forbidden');
      const mockHttp = createMockHttpClient({ reject: error });
      const api = new SupportApi(mockHttp);

      await expect(api.setVip(42, true)).rejects.toBe(error);
    });
  });
});
