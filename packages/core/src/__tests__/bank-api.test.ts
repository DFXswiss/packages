import { BankApi } from '../client/BankApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { ReceiveIbanStatus } from '../definitions/bank';

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

describe('BankApi', () => {
  describe('checkReceiveIban', () => {
    it.each(['DE89370400440532013000', 'FR1420041010050500013M02606'])(
      'sends the IBAN as PUT to the receiveIban endpoint (%s)',
      async (iban) => {
        const mockHttp = createMockHttpClient({ status: ReceiveIbanStatus.DFX_IBAN });
        const api = new BankApi(mockHttp);

        const result = await api.checkReceiveIban(iban);

        expect(result).toEqual({ status: ReceiveIbanStatus.DFX_IBAN });
        expect(mockHttp.request).toHaveBeenCalledTimes(1);
        expect(mockHttp.request).toHaveBeenCalledWith({ url: 'bank/receiveIban', method: 'PUT', data: { iban } });
      },
    );

    it('does not opt out of the auth token, unlike list()', async () => {
      const mockHttp = createMockHttpClient({ status: ReceiveIbanStatus.NOT_MATCHED });
      const api = new BankApi(mockHttp);

      await api.checkReceiveIban('DE89370400440532013000');

      // Unlike list(), this call does not set token: false on the request options.
      expect(mockHttp.request.mock.calls[0][0]).not.toHaveProperty('token');
    });
  });

  describe('list', () => {
    it('requests the public bank list without a token', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new BankApi(mockHttp);

      await api.list();

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'bank', method: 'GET', token: false });
    });
  });
});
