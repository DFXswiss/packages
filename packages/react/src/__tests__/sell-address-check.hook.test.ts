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

jest.mock('../contexts/fiat.context', () => ({
  useFiatContext: () => ({ currencies: [] }),
}));

import { Blockchain } from '../definitions/blockchain';
import { SellAddressCheck, SellAddressCheckResult } from '../definitions/sell';
import { useSell } from '../hooks/sell.hook';

const addressCheck: SellAddressCheck = {
  result: SellAddressCheckResult.LIKELY_RETURN,
};

describe('useSell checkAddress', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('reads the address check with the session token and returns it unchanged', async () => {
    mockCall.mockResolvedValue(addressCheck);

    await expect(useSell().checkAddress(Blockchain.ETHEREUM)).resolves.toBe(addressCheck);

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith({
      url: 'sell/address-check?blockchain=Ethereum',
      method: 'GET',
    });
  });

  it('passes API errors through', async () => {
    const error = { statusCode: 500, message: 'Address check failed' };
    mockCall.mockRejectedValue(error);

    await expect(useSell().checkAddress(Blockchain.ETHEREUM)).rejects.toBe(error);
  });
});
