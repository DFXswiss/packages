const mockCall = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: unknown) => fn,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
  ResponseType: { JSON: 'json', TEXT: 'text', BLOB: 'blob' },
}));

import { PaymentLinkMerchantInfo, PaymentLinkMode } from '../definitions/route';
import { usePaymentRoutes } from '../hooks/payment-routes.hook';

const merchantInfo: PaymentLinkMerchantInfo = {
  displayName: 'Shop',
  mode: PaymentLinkMode.MULTIPLE,
  recipient: { name: 'Shop' },
  transferAmounts: [{ method: 'Lightning', assets: [{ asset: 'BTC' }] }],
};

describe('usePaymentRoutes getPaymentMerchantInfo', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('reads the merchant info without a token and returns it unchanged', async () => {
    mockCall.mockResolvedValue(merchantInfo);

    await expect(usePaymentRoutes().getPaymentMerchantInfo('42')).resolves.toBe(merchantInfo);

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/merchant?route=42',
      method: 'GET',
      token: false,
    });
  });

  it('encodes the route so a label stays one query value', async () => {
    mockCall.mockResolvedValue(merchantInfo);

    await usePaymentRoutes().getPaymentMerchantInfo('my shop&route=2');

    expect(mockCall).toHaveBeenCalledWith({
      url: 'paymentLink/merchant?route=my%20shop%26route%3D2',
      method: 'GET',
      token: false,
    });
  });

  it('passes API errors through', async () => {
    const error = { statusCode: 404, message: 'Payment route not found' };
    mockCall.mockRejectedValue(error);

    await expect(usePaymentRoutes().getPaymentMerchantInfo('unknown')).rejects.toBe(error);
  });
});
