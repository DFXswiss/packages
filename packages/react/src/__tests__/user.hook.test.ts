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

  it('reactivates the signed-in address and returns the new session token', async () => {
    mockCall.mockResolvedValue({ accessToken: 'new-token' });

    const user = useUser();

    await expect(user.reactivateUserAddress()).resolves.toEqual({ accessToken: 'new-token' });
    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith({ url: 'user/reactivate', version: 'v2', method: 'PUT' });
  });
});
