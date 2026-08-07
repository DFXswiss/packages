import { BuyApi } from '../client/BuyApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { BuyUrl } from '../definitions/buy';

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

describe('BuyApi', () => {
  describe('getInvoice', () => {
    it('requests the invoice without a collectionAccount query when omitted', async () => {
      const mockHttp = createMockHttpClient({ pdfData: 'base64' });
      const api = new BuyApi(mockHttp);

      await api.getInvoice(42);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/paymentInfos/42/invoice', method: 'PUT' });
    });

    it('appends collectionAccount=true when the switch is set', async () => {
      const mockHttp = createMockHttpClient({ pdfData: 'base64' });
      const api = new BuyApi(mockHttp);

      await api.getInvoice(42, true);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'buy/paymentInfos/42/invoice?collectionAccount=true',
        method: 'PUT',
      });
    });

    it('does not append a collectionAccount query when the switch is false', async () => {
      // The API treats any present value as true (Util.mapBooleanQuery), so false must omit the param.
      const mockHttp = createMockHttpClient({ pdfData: 'base64' });
      const api = new BuyApi(mockHttp);

      await api.getInvoice(42, false);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/paymentInfos/42/invoice', method: 'PUT' });
    });
  });
});

describe('BuyUrl.invoice', () => {
  it('builds the path without a query when collectionAccount is omitted', () => {
    expect(BuyUrl.invoice(42)).toBe('buy/paymentInfos/42/invoice');
  });

  it('appends collectionAccount=true when the switch is set', () => {
    expect(BuyUrl.invoice(42, true)).toBe('buy/paymentInfos/42/invoice?collectionAccount=true');
  });

  it('builds the path without a query when collectionAccount is false', () => {
    // The API treats any present value as true (Util.mapBooleanQuery), so false must omit the param.
    expect(BuyUrl.invoice(42, false)).toBe('buy/paymentInfos/42/invoice');
  });
});
