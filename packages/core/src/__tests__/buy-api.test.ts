import { BuyApi } from '../client/BuyApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { VirtualIban, VirtualIbanStatus } from '../definitions/buy';

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

const virtualIban: VirtualIban = {
  id: 1,
  iban: 'LI0808811000000000001',
  bban: '000000000001',
  currency: 'EUR',
  active: true,
  acceptsPayments: true,
  status: VirtualIbanStatus.ACTIVE,
};

describe('BuyApi', () => {
  describe('getPersonalIbans', () => {
    it('requests the personal IBAN list of the authenticated account', async () => {
      const mockHttp = createMockHttpClient([virtualIban]);
      const api = new BuyApi(mockHttp);

      const result = await api.getPersonalIbans();

      expect(result).toEqual([virtualIban]);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/personalIban', method: 'GET' });
    });

    it('does not opt out of the auth token', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new BuyApi(mockHttp);

      await api.getPersonalIbans();

      expect(mockHttp.request.mock.calls[0][0]).not.toHaveProperty('token');
    });
  });

  describe('createPersonalIban', () => {
    it('posts the requested currency to the personal IBAN endpoint', async () => {
      const mockHttp = createMockHttpClient(virtualIban);
      const api = new BuyApi(mockHttp);

      const result = await api.createPersonalIban({ currency: 'EUR' });

      expect(result).toEqual(virtualIban);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'buy/personalIban',
        method: 'POST',
        data: { currency: 'EUR' },
      });
    });

    it('propagates API rejections instead of resolving', async () => {
      const mockHttp = createMockHttpClient();
      (mockHttp.request as jest.Mock).mockRejectedValue(new Error('KYC level 50 or higher required'));
      const api = new BuyApi(mockHttp);

      await expect(api.createPersonalIban({ currency: 'EUR' })).rejects.toThrow('KYC level 50 or higher required');
    });
  });
});
