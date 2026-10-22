const mockSetUser = jest.fn();
const mockSetIsUserLoading = jest.fn();
const mockSetIsUserUpdating = jest.fn();
const mockReactivateUserAddress = jest.fn();
const mockGetUser = jest.fn();
const mockUpdateSession = jest.fn();

let authToken: string | undefined;
let stateSetters: jest.Mock[] = [];

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: unknown) => fn,
  useMemo: (factory: () => unknown) => factory(),
  useEffect: () => undefined,
  useState: (initial: unknown) => [initial, stateSetters.shift()],
}));

jest.mock('../hooks/api-session.hook', () => ({
  useApiSession: () => ({ isLoggedIn: true, updateSession: mockUpdateSession, deleteSession: jest.fn() }),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({ getAuthToken: () => authToken }),
}));

jest.mock('../hooks/user.hook', () => ({
  useUser: () => ({ getUser: mockGetUser, reactivateUserAddress: mockReactivateUserAddress }),
}));

import { UserContextProvider } from '../contexts/user.context';

function reactivateAddress(): Promise<void> {
  // useState order in the provider: user, isUserLoading, isUserUpdating
  stateSetters = [mockSetUser, mockSetIsUserLoading, mockSetIsUserUpdating];
  return UserContextProvider({}).props.value.reactivateAddress();
}

describe('UserContextProvider', () => {
  const user = { activeAddress: { address: '0xabc', status: 'Active' } };

  beforeEach(() => {
    jest.resetAllMocks();
    authToken = 'old-token';
    mockUpdateSession.mockImplementation((token: string) => (authToken = token));
  });

  describe('reactivateAddress', () => {
    it('puts the returned token into the session and sets the reloaded user', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockResolvedValue(user);

      await reactivateAddress();

      expect(mockReactivateUserAddress).toHaveBeenCalledWith();
      expect(mockUpdateSession).toHaveBeenCalledWith('new-token');
      expect(mockUpdateSession.mock.invocationCallOrder[0]).toBeLessThan(mockGetUser.mock.invocationCallOrder[0]);
      expect(mockSetUser.mock.calls).toEqual([[user]]);
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
      expect(mockSetIsUserLoading).not.toHaveBeenCalled();
    });

    it('leaves the session untouched when it changed during the request', async () => {
      mockReactivateUserAddress.mockImplementation(async () => {
        authToken = undefined;
        return { accessToken: 'new-token' };
      });

      await reactivateAddress();

      expect(mockUpdateSession).not.toHaveBeenCalled();
      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });

    it('drops the reloaded user when the session changed during the reload', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockImplementation(async () => {
        authToken = 'other-token';
        return user;
      });

      await reactivateAddress();

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });

    it('rejects without touching the session when the request fails', async () => {
      mockReactivateUserAddress.mockRejectedValue(new Error('Address is blocked'));

      await expect(reactivateAddress()).rejects.toThrow('Address is blocked');

      expect(mockUpdateSession).not.toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });

    it('keeps the new session, marks the active address as active and rejects when the reload fails', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockRejectedValue(new Error('reload failed'));

      await expect(reactivateAddress()).rejects.toThrow('reload failed');

      expect(mockUpdateSession).toHaveBeenCalledWith('new-token');
      expect(mockSetUser).toHaveBeenCalledTimes(1);
      const update = mockSetUser.mock.calls[0][0];
      const previous = { mail: 'user@example.com', activeAddress: { address: '0xabc', status: 'Deleted' } };
      expect(update(previous)).toEqual({
        mail: 'user@example.com',
        activeAddress: { address: '0xabc', status: 'Active' },
      });
      expect(update(undefined)).toBeUndefined();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });

    it('leaves the user untouched when the reload fails after the session changed', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockImplementation(async () => {
        authToken = 'other-token';
        throw new Error('reload failed');
      });

      await expect(reactivateAddress()).rejects.toThrow('reload failed');

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });
  });
});
