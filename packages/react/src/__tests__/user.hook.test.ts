const mockCall = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
}));

import { useUser } from '../hooks/user.hook';

describe('useUser', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('reactivates an address and returns the new session token', async () => {
    mockCall.mockResolvedValue({ accessToken: 'access-token' });

    const user = useUser();

    await expect(user.reactivateUserAddress('0xabc')).resolves.toEqual({ accessToken: 'access-token' });
    expect(mockCall).toHaveBeenCalledWith({
      url: 'user/addresses/0xabc/reactivate',
      version: 'v2',
      method: 'POST',
    });
  });

  it('URL-encodes the address in the reactivate path', async () => {
    mockCall.mockResolvedValue({ accessToken: 'access-token' });

    const user = useUser();

    await user.reactivateUserAddress('a/b?c');

    expect(mockCall).toHaveBeenCalledWith({
      url: 'user/addresses/a%2Fb%3Fc/reactivate',
      version: 'v2',
      method: 'POST',
    });
  });
});
