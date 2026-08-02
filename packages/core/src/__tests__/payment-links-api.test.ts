import { DfxHttpClient } from '../client/DfxHttpClient';
import { PaymentLinksApi } from '../client/PaymentLinksApi';
import {
  PaymentLinkMode,
  PaymentLinkPayResponse,
  PaymentLinkPaymentStatus,
  PaymentStandardType,
  hasPaymentQuote,
} from '../definitions/route';

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

const requestBase = {
  id: 'pl_1',
  displayName: 'Shop',
  standard: PaymentStandardType.OPEN_CRYPTO_PAY,
  possibleStandards: [PaymentStandardType.OPEN_CRYPTO_PAY],
  displayQr: true,
  recipient: { name: 'Shop' },
  mode: PaymentLinkMode.SINGLE,
  transferAmounts: [],
};

describe('PaymentLinksApi pay flow', () => {
  describe('getStandards', () => {
    it('reads the public standard list without a token', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new PaymentLinksApi(mockHttp);

      await api.getStandards();

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/standard',
        method: 'GET',
        token: false,
      });
    });

    it('reads a single standard by id', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.getStandard(PaymentStandardType.PAY_TO_ADDRESS);

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/standard/PayToAddress',
        method: 'GET',
        token: false,
      });
    });
  });

  describe('waitForPayment', () => {
    it('passes the link identification as query parameters', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.waitForPayment({ externalLinkId: 'ext 1', key: 'k' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment/wait?externalLinkId=ext%201&key=k',
        method: 'GET',
      });
    });

    it('omits parameters that were not set', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.waitForPayment({ linkId: '7' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment/wait?linkId=7',
        method: 'GET',
      });
    });
  });

  describe('confirmPayment', () => {
    it('confirms via PUT', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.confirmPayment({ externalPaymentId: 'p1', key: 'k' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment/confirm?externalPaymentId=p1&key=k',
        method: 'PUT',
      });
    });
  });

  describe('getHistory', () => {
    it('sends statuses as a comma separated list and dates in ISO form', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new PaymentLinksApi(mockHttp);

      await api.getHistory({
        externalLinkId: 'ext1',
        status: [PaymentLinkPaymentStatus.PENDING, PaymentLinkPaymentStatus.COMPLETED],
        from: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/history?externalLinkId=ext1&status=Pending,Completed&from=2026-01-01T00%3A00%3A00.000Z',
        method: 'GET',
      });
    });

    it('sends no query at all for an empty filter', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new PaymentLinksApi(mockHttp);

      await api.getHistory({});

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'paymentLink/history', method: 'GET' });
    });
  });
});

describe('hasPaymentQuote', () => {
  it('is true for a quoted pay request', () => {
    const response: PaymentLinkPayResponse = {
      ...requestBase,
      tag: 'payRequest',
      callback: 'https://example.com/callback',
      metadata: '[]',
      minSendable: 1,
      maxSendable: 2,
      quote: { id: 'q1', expiration: new Date(), payment: 'pay1' },
      requestedAmount: { asset: 'CHF', amount: 1 },
    };

    expect(hasPaymentQuote(response)).toBe(true);
  });

  it('is false for an idle terminal response', () => {
    const response: PaymentLinkPayResponse = { ...requestBase, error: 'No pending payment', statusCode: 404 };

    expect(hasPaymentQuote(response)).toBe(false);
  });
});
