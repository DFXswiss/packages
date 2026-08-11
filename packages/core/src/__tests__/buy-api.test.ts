import { BuyApi } from '../client/BuyApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Asset } from '../definitions/asset';
import { Buy, BuyPaymentInfo, PersonalIbanProvider } from '../definitions/buy';
import { Fiat } from '../definitions/fiat';

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

      const result = await api.getInvoice(42);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/paymentInfos/42/invoice', method: 'PUT' });
      expect(result).toEqual({ pdfData: 'base64' });
    });

    it('appends collectionAccount=true when the switch is set', async () => {
      const mockHttp = createMockHttpClient({ pdfData: 'base64' });
      const api = new BuyApi(mockHttp);

      const result = await api.getInvoice(42, true);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'buy/paymentInfos/42/invoice?collectionAccount=true',
        method: 'PUT',
      });
      expect(result).toEqual({ pdfData: 'base64' });
    });

    it('does not append a collectionAccount query when the switch is false', async () => {
      const mockHttp = createMockHttpClient({ pdfData: 'base64' });
      const api = new BuyApi(mockHttp);

      const result = await api.getInvoice(42, false);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/paymentInfos/42/invoice', method: 'PUT' });
      expect(result).toEqual({ pdfData: 'base64' });
    });
  });

  describe('createPaymentInfo', () => {
    it('forwards personalIbanProvider as its wire string literal to the HTTP client', async () => {
      const mockHttp = createMockHttpClient({} as Buy);
      const api = new BuyApi(mockHttp);

      const paymentInfo: BuyPaymentInfo = {
        currency: {} as Fiat,
        asset: {} as Asset,
        personalIbanProvider: PersonalIbanProvider.YAPEAL,
      };

      await api.createPaymentInfo(paymentInfo);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ personalIbanProvider: 'Yapeal' }),
        }),
      );
    });
  });
});

describe('PersonalIbanProvider', () => {
  it('pins the wire format of the enum values', () => {
    expect(PersonalIbanProvider.FRICK).toBe('Frick');
    expect(PersonalIbanProvider.YAPEAL).toBe('Yapeal');
  });
});
