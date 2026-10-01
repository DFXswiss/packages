import { BuyApi } from '../client/BuyApi';
import { SellApi } from '../client/SellApi';
import { SwapApi } from '../client/SwapApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Asset } from '../definitions/asset';
import { Buy, BuyPaymentInfo, PersonalIbanProvider, VirtualIban } from '../definitions/buy';
import { Fiat } from '../definitions/fiat';
import { SellPaymentInfo } from '../definitions/sell';
import { SwapPaymentInfo } from '../definitions/swap';

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
  it('omits clientRequestId from quote requests but retains it for payment-info creation', async () => {
    const mockHttp = createMockHttpClient({} as Buy);
    const api = new BuyApi(mockHttp);
    const paymentInfo = { currency: 'CHF', clientRequestId: 'client-request-1' } as unknown as BuyPaymentInfo;

    await api.quote(paymentInfo);

    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'buy/quote',
      method: 'PUT',
      data: { currency: 'CHF' },
      token: false,
    });

    await api.createPaymentInfo(paymentInfo);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'buy/paymentInfos',
      method: 'PUT',
      data: paymentInfo,
    });
  });

  it('confirms a payment-info request for the transaction id', async () => {
    const mockHttp = createMockHttpClient(undefined);
    const api = new BuyApi(mockHttp);

    await api.confirm(72);

    expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/paymentInfos/72/confirm', method: 'PUT' });
  });

  describe('getPersonalIbans', () => {
    it('requests the personal IBAN list', async () => {
      const response: VirtualIban[] = [
        {
          id: 1,
          iban: 'CH9300762011623852957',
          currency: 'CHF',
          bank: 'Bank Frick',
          active: true,
          acceptsPayments: true,
        },
      ];
      const mockHttp = createMockHttpClient(response);
      const api = new BuyApi(mockHttp);

      const result = await api.getPersonalIbans();

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'buy/personalIban', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

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

describe('SellApi and SwapApi quote requests', () => {
  it('omits clientRequestId from sell quote payloads', async () => {
    const mockHttp = createMockHttpClient({});
    const api = new SellApi(mockHttp);
    const paymentInfo = { asset: 'BTC', clientRequestId: 'client-request-2' } as unknown as SellPaymentInfo;

    await api.quote(paymentInfo);

    expect(mockHttp.request).toHaveBeenCalledWith({
      url: 'sell/quote',
      method: 'PUT',
      data: { asset: 'BTC' },
      token: false,
    });

    await api.createPaymentInfo(paymentInfo);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'sell/paymentInfos',
      method: 'PUT',
      data: paymentInfo,
    });

    await api.createPaymentInfo(paymentInfo, true);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'sell/paymentInfos?includeTx=true',
      method: 'PUT',
      data: paymentInfo,
    });

    const confirmation = { txHash: '0xsigned' };
    await api.confirm(12, confirmation);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'sell/paymentInfos/12/confirm',
      method: 'PUT',
      data: confirmation,
    });
  });

  it('omits clientRequestId from swap quote payloads', async () => {
    const mockHttp = createMockHttpClient({});
    const api = new SwapApi(mockHttp);
    const paymentInfo = { asset: 'BTC', clientRequestId: 'client-request-3' } as unknown as SwapPaymentInfo;

    await api.quote(paymentInfo);

    expect(mockHttp.request).toHaveBeenCalledWith({
      url: 'swap/quote',
      method: 'PUT',
      data: { asset: 'BTC' },
      token: false,
    });

    await api.createPaymentInfo(paymentInfo);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'swap/paymentInfos',
      method: 'PUT',
      data: paymentInfo,
    });

    await api.createPaymentInfo(paymentInfo, true);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'swap/paymentInfos?includeTx=true',
      method: 'PUT',
      data: paymentInfo,
    });

    const confirmation = { txHash: '0xsigned' };
    await api.confirm(13, confirmation);
    expect(mockHttp.request).toHaveBeenLastCalledWith({
      url: 'swap/paymentInfos/13/confirm',
      method: 'POST',
      data: confirmation,
    });
  });
});

describe('PersonalIbanProvider', () => {
  it('pins the wire format of the enum values', () => {
    expect(PersonalIbanProvider.FRICK).toBe('Frick');
    expect(PersonalIbanProvider.YAPEAL).toBe('Yapeal');
  });
});
