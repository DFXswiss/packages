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
  const iban = 'DE89370400440532013000';

  describe('checkReceiveIban', () => {
    it('sends the IBAN as PUT to the receiveIban endpoint', async () => {
      const mockHttp = createMockHttpClient({ status: ReceiveIbanStatus.DFX_IBAN });
      const api = new BankApi(mockHttp);

      const result = await api.checkReceiveIban(iban);

      expect(result).toEqual({ status: ReceiveIbanStatus.DFX_IBAN });
      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'bank/receiveIban', method: 'PUT', data: { iban } });
    });

    it('does not suppress the auth token, so the API can answer more than LoginRequired', async () => {
      const mockHttp = createMockHttpClient({ status: ReceiveIbanStatus.NOT_MATCHED });
      const api = new BankApi(mockHttp);

      await api.checkReceiveIban(iban);

      // must stay unset: with token false the API could never tell NotMatched from LoginRequired
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
