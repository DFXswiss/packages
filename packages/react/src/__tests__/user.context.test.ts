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

function reactivateAddress(address: string): Promise<void> {
  // useState order in the provider: user, isUserLoading, isUserUpdating
  stateSetters = [mockSetUser, mockSetIsUserLoading, mockSetIsUserUpdating];
  return UserContextProvider({}).props.value.reactivateAddress(address);
}

describe('UserContextProvider', () => {
  const user = { mail: 'user@example.com' };

  beforeEach(() => {
    jest.resetAllMocks();
    authToken = 'old-token';
    mockUpdateSession.mockImplementation((token: string) => (authToken = token));
  });

  describe('reactivateAddress', () => {
    it('puts the returned token into the session and sets the reloaded user', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockResolvedValue(user);

      await reactivateAddress('0xabc');

      expect(mockReactivateUserAddress).toHaveBeenCalledWith('0xabc');
      expect(mockUpdateSession).toHaveBeenCalledWith('new-token');
      expect(mockSetUser.mock.calls).toEqual([[user]]);
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
      expect(mockSetIsUserLoading).not.toHaveBeenCalled();
    });

    it('leaves the session untouched when it changed before the answer', async () => {
      mockReactivateUserAddress.mockImplementation(async () => {
        authToken = undefined;
        return { accessToken: 'new-token' };
      });

      await reactivateAddress('0xabc');

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

      await reactivateAddress('0xabc');

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });

    it('rejects and resets the busy flag when the reload fails', async () => {
      mockReactivateUserAddress.mockResolvedValue({ accessToken: 'new-token' });
      mockGetUser.mockRejectedValue(new Error('reload failed'));

      await expect(reactivateAddress('0xabc')).rejects.toThrow('reload failed');

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetIsUserUpdating.mock.calls).toEqual([[true], [false]]);
    });
  });
});
