import { ApiException } from '../definitions/error';
import { Blockchain } from '../definitions/blockchain';
import { SellAddressCheck, SellAddressCheckResult } from '../definitions/sell';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { SellApi } from '../client/SellApi';

function createMockHttpClient(response?: unknown) {
  return {
    request: jest.fn().mockResolvedValue(response),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

const addressCheck: SellAddressCheck = {
  result: SellAddressCheckResult.LIKELY_RETURN,
};

describe('SellApi checkAddress', () => {
  it('reads the address check with the session token and returns it unchanged', async () => {
    const mockHttp = createMockHttpClient(addressCheck);
    const api = new SellApi(mockHttp);

    await expect(api.checkAddress(Blockchain.ETHEREUM)).resolves.toBe(addressCheck);

    expect(mockHttp.request).toHaveBeenCalledTimes(1);
    expect(mockHttp.request).toHaveBeenCalledWith({
      url: 'sell/address-check?blockchain=Ethereum',
      method: 'GET',
    });
  });

  it('passes API errors through', async () => {
    const error = new ApiException(500, 'Address check failed');
    const mockHttp = createMockHttpClient();
    mockHttp.request.mockRejectedValue(error);
    const api = new SellApi(mockHttp);

    await expect(api.checkAddress(Blockchain.ETHEREUM)).rejects.toBe(error);
  });

  it('uses the API result values', () => {
    expect(Object.values(SellAddressCheckResult)).toEqual(['Ok', 'LikelyReturn', 'Unknown']);
  });
});
