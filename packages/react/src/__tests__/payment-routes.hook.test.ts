import { PaymentLinkMode, PaymentLinkPayResponse, PaymentStandardType } from '../definitions/route';
import { usePaymentRoutes } from '../hooks/payment-routes.hook';

const mockCall = jest.fn();

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
  ResponseType: { JSON: 'json', TEXT: 'text', BLOB: 'blob' },
}));

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useCallback: (fn: unknown) => fn,
    useMemo: (fn: () => unknown) => fn(),
  };
});

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

describe('usePaymentRoutes getInvoicePayment', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockCall.mockResolvedValue({ ...requestBase, error: 'Not Found', message: 'none', statusCode: 404 });
  });

  it('builds the full query, uses GET, and skips the auth token', async () => {
    const { getInvoicePayment } = usePaymentRoutes();

    await getInvoicePayment({
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

    expect(mockCall).toHaveBeenCalledWith({
      url:
        'paymentLink/payment?routeId=42&route=shop&externalId=ext%201&message=inv%2F1&label=L&note=N' +
        '&amount=10.5&currency=CHF&expiryDate=2027-01-01T00%3A00%3A00.000Z' +
        '&standard=OpenCryptoPay&webhookUrl=https%3A%2F%2Fexample.com%2Fhook',
      method: 'GET',
      token: false,
    });
  });

  it('omits optional fields that were not set', async () => {
    const { getInvoicePayment } = usePaymentRoutes();

    await getInvoicePayment({
      route: 'shop',
      message: 'inv-1',
      amount: '5',
    });

    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/payment?route=shop&message=inv-1&amount=5',
      method: 'GET',
      token: false,
    });
  });

  it('identifies the route by routeId and the payment by externalId', async () => {
    const { getInvoicePayment } = usePaymentRoutes();

    await getInvoicePayment({
      routeId: '42',
      externalId: 'ext-1',
      amount: '5',
    });

    expect(mockCall).toHaveBeenCalledWith({
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
    mockCall.mockResolvedValue(quoted);

    const { getInvoicePayment } = usePaymentRoutes();
    const result = await getInvoicePayment({ route: 'shop', message: 'inv-1', amount: '5' });

    expect(result).toEqual(quoted);
  });

  it('returns a terminal error response', async () => {
    const terminal: PaymentLinkPayResponse = {
      ...requestBase,
      error: 'Not Found',
      message: 'No pending payment',
      statusCode: 404,
    };
    mockCall.mockResolvedValue(terminal);

    const { getInvoicePayment } = usePaymentRoutes();
    const result = await getInvoicePayment({ route: 'shop', message: 'inv-1', amount: '5' });

    expect(result).toEqual(terminal);
  });
});

describe('usePaymentRoutes', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockCall.mockResolvedValue({});
  });

  it('reads payment routes', async () => {
    const { getPaymentRoutes } = usePaymentRoutes();
    await getPaymentRoutes();
    expect(mockCall).toHaveBeenCalledWith({ url: 'route', method: 'GET' });
  });

  it('lists payment links with identifiers', async () => {
    const { getPaymentLinks } = usePaymentRoutes();
    await getPaymentLinks('1', 'ext 1');
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink?linkId=1&externalLinkId=ext%201',
      method: 'GET',
    });
  });

  it('creates a payment link', async () => {
    const { createPaymentLink } = usePaymentRoutes();
    const data = { webhookUrl: 'https://example.com' };
    await createPaymentLink(data as any);
    expect(mockCall).toHaveBeenCalledWith({ url: 'paymentLink', method: 'POST', data });
  });

  it('updates a payment link', async () => {
    const { updatePaymentLink } = usePaymentRoutes();
    const data = { webhookUrl: 'https://example.com' };
    await updatePaymentLink(data as any, '1');
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink?linkId=1',
      method: 'PUT',
      data,
    });
  });

  it('assigns a payment link', async () => {
    const { assignPaymentLink } = usePaymentRoutes();
    const data = { routeId: '7' };
    await assignPaymentLink(data as any, undefined, 'ext1');
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/assign?externalLinkId=ext1',
      method: 'PUT',
      data,
    });
  });

  it('reads and updates the user payment-link config', async () => {
    const { getUserPaymentLinksConfig, updateUserPaymentLinksConfig } = usePaymentRoutes();
    const data = { displayQr: true };

    await getUserPaymentLinksConfig();
    await updateUserPaymentLinksConfig(data as any);

    expect(mockCall).toHaveBeenNthCalledWith(1, { url: 'paymentLink/config', method: 'GET' });
    expect(mockCall).toHaveBeenNthCalledWith(2, { url: 'paymentLink/config', method: 'PUT', data });
  });

  it('creates and cancels a payment on a link', async () => {
    const { createPaymentLinkPayment, cancelPaymentLinkPayment } = usePaymentRoutes();
    const data = { amount: 5 };

    await createPaymentLinkPayment(data as any, '1');
    await cancelPaymentLinkPayment('1');

    expect(mockCall).toHaveBeenNthCalledWith(1, {
      url: 'paymentLink/payment?linkId=1',
      method: 'POST',
      data,
    });
    expect(mockCall).toHaveBeenNthCalledWith(2, {
      url: 'paymentLink/payment?linkId=1',
      method: 'DELETE',
    });
  });

  it('deactivates a payment route', async () => {
    const { deletePaymentRoute } = usePaymentRoutes();
    await deletePaymentRoute(9, 'sell');
    expect(mockCall).toHaveBeenCalledWith({ url: 'sell/9', method: 'PUT', data: { active: false } });
  });

  it('creates a POS link', async () => {
    const { createPosLink } = usePaymentRoutes();
    await createPosLink('1');
    expect(mockCall).toHaveBeenCalledWith({ url: 'paymentLink/pos?linkId=1', method: 'PUT' });
  });

  it('reads the payment recipient for a route', async () => {
    const { getPaymentRecipient } = usePaymentRoutes();
    await getPaymentRecipient('shop');
    expect(mockCall).toHaveBeenCalledWith({ url: 'paymentLink/recipient?id=shop', method: 'GET' });
  });

  it('downloads stickers for a route only', async () => {
    const { getPaymentStickers } = usePaymentRoutes();
    await getPaymentStickers('shop');
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/stickers?route=shop',
      method: 'GET',
      responseType: 'blob',
    });
  });

  it('downloads stickers with every optional filter', async () => {
    const { getPaymentStickers } = usePaymentRoutes();
    await getPaymentStickers('shop', 'e1,e2', '1,2', 'qr', 'single', 'de');
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/stickers?route=shop&externalIds=e1%2Ce2&ids=1%2C2&type=qr&mode=single&lang=de',
      method: 'GET',
      responseType: 'blob',
    });
  });
});
