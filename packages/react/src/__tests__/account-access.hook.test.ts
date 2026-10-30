const mockCall = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: unknown) => fn,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
}));

import { useAccountAccess } from '../hooks/account-access.hook';

describe('useAccountAccess', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('sets provisional approval and returns the account-access information', async () => {
    const response = { id: 42, provisionalApprovalDate: '2026-10-30T08:00:00.000Z', vipUserIds: [] };
    mockCall.mockResolvedValue(response);

    const accountAccess = useAccountAccess();

    await expect(accountAccess.setProvisionalApproval(42, true)).resolves.toBe(response);
    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith({
      url: 'support/42/provisionalApproval',
      method: 'PUT',
      data: { enabled: true },
    });
  });

  it('sets VIP access and returns the account-access information', async () => {
    const response = { id: 42, vipUserIds: [7] };
    mockCall.mockResolvedValue(response);

    const accountAccess = useAccountAccess();

    await expect(accountAccess.setVip(42, false)).resolves.toBe(response);
    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith({
      url: 'support/42/vip',
      method: 'PUT',
      data: { enabled: false },
    });
  });
});
