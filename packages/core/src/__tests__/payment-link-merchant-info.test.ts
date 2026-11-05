import { ApiException } from '../definitions/error';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { PaymentLinksApi } from '../client/PaymentLinksApi';
import { PaymentLinkMerchantInfo, PaymentLinkMode } from '../definitions/route';

function createMockHttpClient(response?: unknown) {
  return {
    request: jest.fn().mockResolvedValue(response),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

const merchantInfo: PaymentLinkMerchantInfo = {
  displayName: 'Shop',
  mode: PaymentLinkMode.MULTIPLE,
  recipient: {
    name: 'Shop',
    address: { street: 'Main', houseNumber: '1', zip: '1000', city: 'Town', country: 'CH' },
    phone: '+41000000000',
    mail: 'shop@example.com',
    website: 'https://example.com',
  },
  transferAmounts: [{ method: 'Lightning', assets: [{ asset: 'BTC' }] }],
};

describe('PaymentLinksApi getMerchantInfo', () => {
  it('reads the merchant info without a token and returns it unchanged', async () => {
    const mockHttp = createMockHttpClient(merchantInfo);
    const api = new PaymentLinksApi(mockHttp);

    await expect(api.getMerchantInfo('42')).resolves.toBe(merchantInfo);

    expect(mockHttp.request).toHaveBeenCalledTimes(1);
    expect(mockHttp.request).toHaveBeenCalledWith({
      url: 'paymentLink/merchant?route=42',
      method: 'GET',
      token: false,
    });
  });

  it('encodes the route so a label stays one query value', async () => {
    const mockHttp = createMockHttpClient(merchantInfo);
    const api = new PaymentLinksApi(mockHttp);

    await api.getMerchantInfo('my shop&route=2');

    expect(mockHttp.request).toHaveBeenCalledWith({
      url: 'paymentLink/merchant?route=my%20shop%26route%3D2',
      method: 'GET',
      token: false,
    });
  });

  it('passes API errors through', async () => {
    const error = new ApiException(404, 'Payment route not found');
    const mockHttp = createMockHttpClient();
    mockHttp.request.mockRejectedValue(error);
    const api = new PaymentLinksApi(mockHttp);

    await expect(api.getMerchantInfo('unknown')).rejects.toBe(error);
  });
});
