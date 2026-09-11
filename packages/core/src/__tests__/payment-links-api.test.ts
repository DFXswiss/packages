import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';
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

describe('PaymentLinksApi', () => {
  describe('list', () => {
    it('lists without a query when no params are given', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new PaymentLinksApi(mockHttp);

      await api.list();

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'paymentLink', method: 'GET' });
    });

    it('lists with the given identifiers', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new PaymentLinksApi(mockHttp);

      await api.list({ linkId: '1', externalLinkId: 'ext 1' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink?linkId=1&externalLinkId=ext%201',
        method: 'GET',
      });
    });
  });

  describe('create', () => {
    it('posts the payload', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);
      const data = { webhookUrl: 'https://example.com' };

      await api.create(data as any);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'paymentLink', method: 'POST', data });
    });
  });

  describe('update', () => {
    it('puts the payload with the link query', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);
      const data = { webhookUrl: 'https://example.com' };

      await api.update({ linkId: '1' }, data as any);

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink?linkId=1',
        method: 'PUT',
        data,
      });
    });
  });

  describe('assign', () => {
    it('puts the assignment payload', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);
      const data = { routeId: '7' };

      await api.assign({ externalLinkId: 'ext1' }, data as any);

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/assign?externalLinkId=ext1',
        method: 'PUT',
        data,
      });
    });
  });

  describe('getRecipient', () => {
    it('reads the public recipient for a route', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.getRecipient('shop');

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/recipient?id=shop',
        method: 'GET',
      });
    });
  });

  describe('getConfig', () => {
    it('reads the user payment-link config', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.getConfig();

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'paymentLink/config', method: 'GET' });
    });
  });

  describe('updateConfig', () => {
    it('puts the user payment-link config', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);
      const data = { displayQr: true };

      await api.updateConfig(data as any);

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/config',
        method: 'PUT',
        data,
      });
    });
  });

  describe('createPayment', () => {
    it('posts a payment on the link', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);
      const data = { amount: 5 };

      await api.createPayment({ linkId: '1' }, data as any);

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment?linkId=1',
        method: 'POST',
        data,
      });
    });
  });

  describe('cancelPayment', () => {
    it('deletes the pending payment', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.cancelPayment({ linkId: '1' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment?linkId=1',
        method: 'DELETE',
      });
    });
  });

  describe('getStickers', () => {
    it('downloads stickers as a blob', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.getStickers({ route: 'shop', type: 'qr' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/stickers?route=shop&type=qr',
        method: 'GET',
        responseType: ResponseType.BLOB,
      });
    });
  });

  describe('createPos', () => {
    it('puts the POS link identifiers', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new PaymentLinksApi(mockHttp);

      await api.createPos({ linkId: '1' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/pos?linkId=1',
        method: 'PUT',
      });
    });
  });
});

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

  describe('getInvoicePayment', () => {
    it('builds the full query, uses GET, and skips the auth token', async () => {
      const mockHttp = createMockHttpClient({ ...requestBase, error: 'Not Found', message: 'none', statusCode: 404 });
      const api = new PaymentLinksApi(mockHttp);

      await api.getInvoicePayment({
        routeId: '42',
        route: 'shop',
        externalId: 'ext 1',
        message: 'inv/1',
        label: 'L',
        note: 'N',
        amount: '10.5',
        currency: 'CHF',
        expiryDate: new Date('2027-01-01T00:00:00.000Z'),
        standard: PaymentStandardType.OPEN_CRYPTO_PAY,
        webhookUrl: 'https://example.com/hook',
      });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url:
          'paymentLink/payment?routeId=42&route=shop&externalId=ext%201&message=inv%2F1&label=L&note=N' +
          '&amount=10.5&currency=CHF&expiryDate=2027-01-01T00%3A00%3A00.000Z' +
          '&standard=OpenCryptoPay&webhookUrl=https%3A%2F%2Fexample.com%2Fhook',
        method: 'GET',
        token: false,
      });
    });

    it('omits optional fields that were not set', async () => {
      const mockHttp = createMockHttpClient({ ...requestBase, error: 'Not Found', message: 'none', statusCode: 404 });
      const api = new PaymentLinksApi(mockHttp);

      await api.getInvoicePayment({
        route: 'shop',
        message: 'inv-1',
        amount: '5',
      });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment?route=shop&message=inv-1&amount=5',
        method: 'GET',
        token: false,
      });
    });

    it('identifies the route by routeId and the payment by externalId', async () => {
      const mockHttp = createMockHttpClient({ ...requestBase, error: 'Not Found', message: 'none', statusCode: 404 });
      const api = new PaymentLinksApi(mockHttp);

      await api.getInvoicePayment({
        routeId: '42',
        externalId: 'ext-1',
        amount: '5',
      });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'paymentLink/payment?routeId=42&externalId=ext-1&amount=5',
        method: 'GET',
        token: false,
      });
    });

    it('returns a quoted pay request', async () => {
      const quoted: PaymentLinkPayResponse = {
        ...requestBase,
        tag: 'payRequest',
        callback: 'https://example.com/callback',
        metadata: '[]',
        minSendable: 1,
        maxSendable: 2,
        quote: { id: 'q1', expiration: new Date(), payment: 'pay1' },
        requestedAmount: { asset: 'CHF', amount: 1 },
      };
      const mockHttp = createMockHttpClient(quoted);
      const api = new PaymentLinksApi(mockHttp);

      const result = await api.getInvoicePayment({ route: 'shop', message: 'inv-1', amount: '5' });

      expect(hasPaymentQuote(result)).toBe(true);
      expect(result).toEqual(quoted);
    });

    it('returns a terminal error response', async () => {
      const terminal: PaymentLinkPayResponse = {
        ...requestBase,
        error: 'Not Found',
        message: 'No pending payment',
        statusCode: 404,
      };
      const mockHttp = createMockHttpClient(terminal);
      const api = new PaymentLinksApi(mockHttp);

      const result = await api.getInvoicePayment({ route: 'shop', message: 'inv-1', amount: '5' });

      expect(hasPaymentQuote(result)).toBe(false);
      expect(result).toEqual(terminal);
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
    const response: PaymentLinkPayResponse = {
      ...requestBase,
      error: 'Not Found',
      message: 'No pending payment',
      statusCode: 404,
    };

    expect(hasPaymentQuote(response)).toBe(false);
  });
});
