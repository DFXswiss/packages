let mockHookSlots: unknown[] = [];
let mockHookCursor = 0;
let mockPendingEffects: Array<() => void> = [];
let mockSession: { account: number; user?: number; address?: string; role?: string } | undefined;
let mockAuthToken: string | undefined;
let mockAuthTokenSession: { account?: number; user?: number; address?: string; role?: string } | undefined;
let mockDecodedTokenSessions: Record<string, { account?: number; user?: number; address?: string; role?: string }> = {};
const mockGetAuthToken = () => mockAuthToken;
const mockGetAuthTokenSession = (token?: string) => {
  const decoded = token === undefined ? undefined : mockDecodedTokenSessions[token];
  const scope = decoded ?? mockAuthTokenSession;
  return scope === undefined ? undefined : { role: 'User', ...scope };
};
let mockGetUser: jest.Mock;
let mockUpdateUserApi: jest.Mock;
let mockUpdateMailApi: jest.Mock;
let mockVerifyMailApi: jest.Mock;
let mockRenameUserAddress: jest.Mock;
let mockAddSpecialCode: jest.Mock;
let mockUpdateCallSettingsApi: jest.Mock;
let mockUpdateSession: jest.Mock;
let mockDeleteSession: jest.Mock;
let mockChangeUserAddress: jest.Mock;
let mockDeleteUserAddress: jest.Mock;
let mockDeleteUserAccount: jest.Mock;
let mockGenerateCTApiKey: jest.Mock;
let mockDeleteCTApiKey: jest.Mock;
let mockUpdateCTApiFilter: jest.Mock;

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const memo = (factory: () => unknown, deps: unknown[]) => {
    const index = mockHookCursor++;
    const slot = mockHookSlots[index] as { deps: unknown[]; value: unknown } | undefined;
    if (!slot || deps.some((dep, depIndex) => !Object.is(dep, slot.deps[depIndex]))) {
      const next = { deps, value: factory() };
      mockHookSlots[index] = next;
      return next.value;
    }
    return slot.value;
  };
  return {
    ...actual,
    useState: (initial: unknown) => {
      const index = mockHookCursor++;
      const slot = (mockHookSlots[index] ??= { value: initial }) as { value: unknown };
      return [
        slot.value,
        (next: unknown) => {
          slot.value = typeof next === 'function' ? (next as (previous: unknown) => unknown)(slot.value) : next;
        },
      ];
    },
    useRef: (initial: unknown) => {
      const index = mockHookCursor++;
      return (mockHookSlots[index] ??= { current: initial }) as { current: unknown };
    },
    useMemo: memo,
    useCallback: (callback: (...args: unknown[]) => unknown, deps: unknown[]) => memo(() => callback, deps),
    useEffect: (effect: () => void, deps: unknown[]) => {
      const index = mockHookCursor++;
      const slot = mockHookSlots[index] as { deps: unknown[] } | undefined;
      if (!slot || deps.some((dep, depIndex) => !Object.is(dep, slot.deps[depIndex]))) {
        mockHookSlots[index] = { deps };
        mockPendingEffects.push(effect);
      }
    },
  };
});

jest.mock('../hooks/api-session.hook', () => ({
  useApiSession: () => ({
    isLoggedIn: mockSession !== undefined,
    session: mockSession,
    updateSession: mockUpdateSession,
    deleteSession: mockDeleteSession,
  }),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({
    getAuthToken: mockGetAuthToken,
    getAuthTokenSession: mockGetAuthTokenSession,
  }),
}));

jest.mock('../hooks/user.hook', () => ({
  useUser: () => ({
    getUser: mockGetUser,
    updateUser: mockUpdateUserApi,
    updateMail: mockUpdateMailApi,
    verifyMail: mockVerifyMailApi,
    addSpecialCode: mockAddSpecialCode,
    renameUserAddress: mockRenameUserAddress,
    changeUserAddress: mockChangeUserAddress,
    deleteUserAddress: mockDeleteUserAddress,
    deleteUserAccount: mockDeleteUserAccount,
    generateCTApiKey: mockGenerateCTApiKey,
    deleteCTApiKey: mockDeleteCTApiKey,
    updateCTApiFilter: mockUpdateCTApiFilter,
    updateCallSettings: mockUpdateCallSettingsApi,
  }),
}));

import { UserContextProvider } from '../contexts/user.context';
import type { User } from '../definitions/user';

function renderProvider() {
  mockHookCursor = 0;
  mockPendingEffects = [];
  const value = (UserContextProvider({ children: null }) as any).props.value as {
    user?: User;
    isUserLoading: boolean;
    userLoadError: boolean;
    reloadUser: () => Promise<void>;
    updateMail: (mail: string) => Promise<void>;
    verifyMail: (token: string) => Promise<void>;
    updatePhone: (phone: string) => Promise<void>;
    renameAddress: (address: string, label: string) => Promise<void>;
    changeAddress: (address: string) => Promise<void>;
    deleteAddress: (address: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    generateKeyCT: () => Promise<{ key: string; secret: string } | undefined>;
    deleteKeyCT: () => Promise<void>;
    updateFilterCT: () => Promise<void>;
    updateCallSettings: () => Promise<void>;
    addSpecialCode: (code: string) => Promise<void>;
  };
  mockPendingEffects.splice(0).forEach((effect) => effect());
  return value;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function waitForMockCalls(mock: jest.Mock, count: number): Promise<void> {
  for (let attempt = 0; attempt < 10 && mock.mock.calls.length < count; attempt += 1) {
    await Promise.resolve();
  }
  expect(mock).toHaveBeenCalledTimes(count);
}

async function flushMicrotasks(): Promise<void> {
  for (let turn = 0; turn < 4; turn += 1) await Promise.resolve();
}

describe('UserContextProvider user-load recovery', () => {
  beforeEach(() => {
    mockHookSlots = [];
    mockHookCursor = 0;
    mockPendingEffects = [];
    mockSession = { account: 101, user: 11, address: 'address-a', role: 'User' };
    mockAuthToken = 'auth-token-a';
    mockAuthTokenSession = { ...mockSession };
    mockDecodedTokenSessions = {};
    mockGetUser = jest.fn();
    mockUpdateUserApi = jest.fn();
    mockUpdateMailApi = jest.fn();
    mockVerifyMailApi = jest.fn();
    mockRenameUserAddress = jest.fn();
    mockAddSpecialCode = jest.fn();
    mockUpdateCallSettingsApi = jest.fn();
    mockUpdateSession = jest.fn();
    mockDeleteSession = jest.fn();
    mockChangeUserAddress = jest.fn();
    mockDeleteUserAddress = jest.fn();
    mockDeleteUserAccount = jest.fn();
    mockGenerateCTApiKey = jest.fn();
    mockDeleteCTApiKey = jest.fn();
    mockUpdateCTApiFilter = jest.fn();
  });

  it('finishes loading with an identity-scoped error when the account session has no user claim', () => {
    mockSession = { account: 101 };
    mockAuthTokenSession = { account: 101 };

    renderProvider();
    expect(renderProvider()).toMatchObject({ isUserLoading: false, userLoadError: true, user: undefined });
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('finishes loading with an identity-scoped error when the raw auth token is missing', () => {
    mockAuthToken = undefined;

    renderProvider();
    expect(renderProvider()).toMatchObject({ isUserLoading: false, userLoadError: true, user: undefined });
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('blocks every stale UserContext mutation before it can use a foreign bearer', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    mockGetUser.mockResolvedValue(user);
    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const staleHandler = renderProvider();

    mockAuthToken = 'foreign-auth-token';
    mockAuthTokenSession = { account: 202, user: 21, address: 'foreign-address', role: 'User' };
    mockSession = { ...mockAuthTokenSession, account: 202 };

    await Promise.all([
      staleHandler.updatePhone('+41790000000'),
      staleHandler.reloadUser(),
      staleHandler.updateMail('new@example.com'),
      staleHandler.verifyMail('verification-code'),
      staleHandler.renameAddress('address-a', 'New label'),
      staleHandler.changeAddress('address-b'),
      staleHandler.deleteAddress('address-a'),
      staleHandler.deleteAccount(),
      staleHandler.addSpecialCode('special-code'),
      staleHandler.generateKeyCT(),
      staleHandler.deleteKeyCT(),
      staleHandler.updateFilterCT(),
      staleHandler.updateCallSettings(),
    ]);

    expect(mockUpdateUserApi).not.toHaveBeenCalled();
    expect(mockUpdateMailApi).not.toHaveBeenCalled();
    expect(mockVerifyMailApi).not.toHaveBeenCalled();
    expect(mockRenameUserAddress).not.toHaveBeenCalled();
    expect(mockChangeUserAddress).not.toHaveBeenCalled();
    expect(mockDeleteUserAddress).not.toHaveBeenCalled();
    expect(mockDeleteUserAccount).not.toHaveBeenCalled();
    expect(mockAddSpecialCode).not.toHaveBeenCalled();
    expect(mockGenerateCTApiKey).not.toHaveBeenCalled();
    expect(mockDeleteCTApiKey).not.toHaveBeenCalled();
    expect(mockUpdateCTApiFilter).not.toHaveBeenCalled();
    expect(mockUpdateCallSettingsApi).not.toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['account', { user: 11, address: 'address-a', role: 'User' }],
    ['user', { account: 101, address: 'address-a', role: 'User' }],
  ])('blocks a stale mutation when the current token has no valid %s claim', async (_claim, scope) => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    mockGetUser.mockResolvedValue(user);
    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const staleHandler = renderProvider();

    mockAuthToken = 'incomplete-token';
    mockAuthTokenSession = scope;
    await staleHandler.updatePhone('+41790000000');

    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  it('pins a user update to the token whose scope passed the preflight', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    mockGetUser.mockResolvedValue(user);
    mockUpdateUserApi.mockResolvedValue(user);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    await renderProvider().updatePhone('+41790000000');

    expect(mockUpdateUserApi).toHaveBeenCalledWith({ phone: '+41790000000' }, undefined, 'auth-token-a');
  });

  it('pins reloads to the preflight token and ignores a result after a raw scope change', async () => {
    const originalUser = {
      accountId: 101,
      mail: 'user-a@example.com',
      addresses: [{ address: 'address-a' }],
    } as User;
    const foreignUser = {
      accountId: 101,
      mail: 'user-b@example.com',
      addresses: [{ address: 'address-b' }],
    } as User;
    const refresh = deferred<User>();
    mockGetUser.mockResolvedValueOnce(originalUser).mockReturnValueOnce(refresh.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const reload = renderProvider().reloadUser();
    expect(mockGetUser).toHaveBeenLastCalledWith('auth-token-a');

    mockAuthToken = 'foreign-auth-token';
    mockAuthTokenSession = { account: 101, user: 21, address: 'address-b' };
    refresh.resolve(foreignUser);
    await reload;

    expect(renderProvider().user).toMatchObject({ mail: 'user-a@example.com' });
  });

  it('masks the previous same-account profile and load state while another user scope loads', async () => {
    const userA = { accountId: 101, mail: 'user-a@example.com', addresses: [{ address: 'address-a' }] } as User;
    const requestB = deferred<User>();
    mockGetUser.mockResolvedValueOnce(userA).mockReturnValueOnce(requestB.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    mockAuthToken = 'auth-token-user-b';
    mockAuthTokenSession = { account: 101, user: 13, address: 'address-b', role: 'User' };
    mockSession = { ...mockAuthTokenSession, account: 101 };

    expect(renderProvider()).toMatchObject({ user: undefined, isUserLoading: true, userLoadError: false });
    expect(mockGetUser).toHaveBeenLastCalledWith('auth-token-user-b');

    requestB.reject(new Error('user B load failed'));
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ user: undefined, isUserLoading: false, userLoadError: true });
  });

  it('masks the previous profile and reload state when only the session role changes', async () => {
    const user = { accountId: 101, mail: 'user@example.com', addresses: [{ address: 'address-a' }] } as User;
    const adminRefresh = deferred<User>();
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(adminRefresh.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    mockAuthToken = 'admin-role-token';
    mockAuthTokenSession = { account: 101, user: 11, address: 'address-a', role: 'Admin' };
    mockSession = { account: 101, user: 11, address: 'address-a', role: 'Admin' };

    expect(renderProvider()).toMatchObject({ user: undefined, isUserLoading: true, userLoadError: false });
    expect(mockGetUser).toHaveBeenLastCalledWith('admin-role-token');

    adminRefresh.resolve(user);
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ user, isUserLoading: false, userLoadError: false });
  });

  it('exposes a failed initial load and clears it when retry loads the account', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    mockGetUser.mockRejectedValueOnce(new Error('network unavailable')).mockResolvedValueOnce(user);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ isUserLoading: false, userLoadError: true, user: undefined });

    const retry = renderProvider().reloadUser();
    expect(renderProvider()).toMatchObject({ isUserLoading: true, userLoadError: false });
    await retry;
    expect(renderProvider()).toMatchObject({ isUserLoading: false, userLoadError: false, user });
    expect(mockGetUser).toHaveBeenCalledTimes(2);
  });

  it('does not let a failed pending account A load set the error for account B', async () => {
    const requestA = deferred<User>();
    const requestB = deferred<User>();
    mockGetUser.mockReturnValueOnce(requestA.promise).mockReturnValueOnce(requestB.promise);

    renderProvider();
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    mockSession = { account: 202, user: 12, address: 'address-b', role: 'User' };
    mockAuthToken = 'auth-token-b';
    mockAuthTokenSession = { ...mockSession };
    expect(renderProvider()).toMatchObject({ isUserLoading: true, userLoadError: false, user: undefined });
    expect(mockGetUser).toHaveBeenCalledTimes(2);

    requestA.reject(new Error('late account A failure'));
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ isUserLoading: true, userLoadError: false, user: undefined });

    const userB = { accountId: 202, addresses: [{ address: 'address-b' }] } as User;
    requestB.resolve(userB);
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ isUserLoading: false, userLoadError: false, user: userB });
  });

  it('does not let an older same-account load overwrite the newer user', async () => {
    const olderRequest = deferred<User>();
    const newerRequest = deferred<User>();
    mockGetUser.mockReturnValueOnce(olderRequest.promise).mockReturnValueOnce(newerRequest.promise);

    renderProvider();
    const newerReload = renderProvider().reloadUser();

    const newerUser = { accountId: 101, addresses: [{ address: 'address-a', label: 'newer' }] } as User;
    newerRequest.resolve(newerUser);
    await newerReload;
    expect(renderProvider()).toMatchObject({ isUserLoading: false, user: newerUser });

    const olderUser = { accountId: 101, addresses: [{ address: 'address-a', label: 'older' }] } as User;
    olderRequest.resolve(olderUser);
    await Promise.resolve();
    expect(renderProvider()).toMatchObject({ isUserLoading: false, user: newerUser });
  });

  it('does not return a generated key when the auth scope changes during the refresh', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const refresh = deferred<User>();
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise).mockResolvedValue(user);
    mockGenerateCTApiKey.mockResolvedValue({ key: 'key', secret: 'secret' });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().generateKeyCT();
    await Promise.resolve();

    mockAuthToken = 'auth-token-b';
    mockSession = { account: 202, user: 12, address: 'address-b', role: 'User' };
    mockAuthTokenSession = { account: 202, user: 12, address: 'address-b', role: 'User' };
    renderProvider();
    refresh.resolve(user);

    await expect(operation).resolves.toBeUndefined();
  });

  it('does not install a stale address-change token after same-tuple re-login', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const change = deferred<{ accessToken: string }>();
    mockGetUser.mockResolvedValue(user);
    mockChangeUserAddress.mockReturnValue(change.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().changeAddress('address-a');
    mockAuthToken = 'auth-token-b';
    renderProvider();
    change.resolve({ accessToken: 'stale-access-token' });

    await operation;
    expect(mockUpdateSession).not.toHaveBeenCalled();
  });

  it('installs the returned token for a current address change', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    mockGetUser.mockResolvedValue(user);
    mockChangeUserAddress.mockResolvedValue({ accessToken: 'current-access-token' });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    await renderProvider().changeAddress('address-a');

    expect(mockUpdateSession).toHaveBeenCalledWith('current-access-token');
  });

  it('installs only the latest result when address changes overlap', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }, { address: 'address-b' }] } as User;
    const firstChange = deferred<{ accessToken: string }>();
    const secondChange = deferred<{ accessToken: string }>();
    mockGetUser.mockResolvedValue(user);
    mockChangeUserAddress.mockReturnValueOnce(firstChange.promise).mockReturnValueOnce(secondChange.promise);
    mockDecodedTokenSessions['new-address-b-token'] = {
      account: 101,
      user: 11,
      address: 'address-b',
      role: 'User',
    };
    mockDecodedTokenSessions['old-address-a-token'] = {
      account: 101,
      user: 11,
      address: 'address-a',
      role: 'User',
    };

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const older = renderProvider().changeAddress('address-a');
    const newer = renderProvider().changeAddress('address-b');

    secondChange.resolve({ accessToken: 'new-address-b-token' });
    await newer;
    firstChange.resolve({ accessToken: 'old-address-a-token' });
    await older;

    expect(mockUpdateSession).toHaveBeenCalledTimes(1);
    expect(mockUpdateSession).toHaveBeenCalledWith('new-address-b-token');
  });

  it.each([
    ['an empty token', '', { account: 101, user: 11, address: 'address-b', role: 'User' }],
    [
      'a token for another user scope',
      'wrong-scope-token',
      { account: 202, user: 12, address: 'address-b', role: 'User' },
    ],
    [
      'a token for a different address',
      'wrong-address-token',
      { account: 101, user: 11, address: 'address-c', role: 'User' },
    ],
  ])(
    'does not install %s after an address change',
    async (
      _description: string,
      accessToken: string,
      decodedScope: { account?: number; user?: number; address?: string; role?: string },
    ) => {
      const user = { accountId: 101, addresses: [{ address: 'address-a' }, { address: 'address-b' }] } as User;
      mockGetUser.mockResolvedValue(user);
      mockChangeUserAddress.mockResolvedValue({ accessToken });
      mockDecodedTokenSessions[accessToken] = decodedScope;

      renderProvider();
      await Promise.resolve();
      await Promise.resolve();
      await renderProvider().changeAddress('address-b');

      expect(mockUpdateSession).not.toHaveBeenCalled();
    },
  );

  it('does not log out a newer foreign account when account deletion resolves before rerender', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAccount.mockReturnValue(deletion.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAccount();
    expect(mockDeleteUserAccount).toHaveBeenCalledWith('auth-token-a');
    mockAuthToken = 'auth-token-b';
    mockAuthTokenSession = { account: 202, user: 12, address: 'address-b' };
    deletion.resolve();

    await operation;
    expect(mockDeleteSession).not.toHaveBeenCalled();
  });

  it('logs out a current token for the deleted account when its address changed after rerender', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAccount.mockReturnValue(deletion.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAccount();
    mockAuthToken = 'auth-token-same-account-new-address';
    mockSession = { account: 101, user: 12, address: 'address-b', role: 'User' };
    mockAuthTokenSession = { account: 101, user: 12, address: 'address-b', role: 'User' };
    renderProvider();
    deletion.resolve();

    await operation;
    expect(mockDeleteSession).toHaveBeenCalledTimes(1);
  });

  it('does not log out a token rotated before last-address deletion resolves', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }],
    } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockReturnValue(deletion.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    mockAuthToken = 'auth-token-b';
    mockAuthTokenSession = { account: 202, user: 12, address: 'address-b' };
    deletion.resolve();

    await operation;
    expect(mockDeleteSession).not.toHaveBeenCalled();
  });

  it('logs out the unchanged token after last-address deletion', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }],
    } as User;
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    await renderProvider().deleteAddress('address-a');

    expect(mockDeleteUserAddress).toHaveBeenCalledWith('address-a', 'auth-token-a');
    expect(mockDeleteSession).toHaveBeenCalledTimes(1);
  });

  it('logs out after last-address deletion when the token rotates within the same auth scope', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }],
    } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockReturnValue(deletion.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    mockAuthToken = 'rotated-same-scope-token';
    mockAuthTokenSession = { account: 101, user: 11, address: 'address-a' };
    deletion.resolve();

    await operation;
    expect(mockDeleteSession).toHaveBeenCalledTimes(1);
  });

  it('uses the fallback address when the token rotates within the same auth scope', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockReturnValue(deletion.promise);
    mockChangeUserAddress.mockResolvedValue({ accessToken: 'fallback-session-token' });
    mockDecodedTokenSessions['fallback-session-token'] = {
      account: 101,
      user: 11,
      address: 'address-b',
      role: 'User',
    };

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    mockAuthToken = 'rotated-same-scope-token';
    mockAuthTokenSession = { account: 101, user: 11, address: 'address-a' };
    deletion.resolve();

    await operation;
    expect(mockChangeUserAddress).toHaveBeenCalledWith('address-b', 'rotated-same-scope-token');
    expect(mockUpdateSession).toHaveBeenCalledWith('fallback-session-token');
  });

  it('waits for the fallback address change after deleting the active address', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const fallback = deferred<{ accessToken: string }>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);
    mockChangeUserAddress.mockReturnValue(fallback.promise);
    mockDecodedTokenSessions['fallback-session-token'] = {
      account: 101,
      user: 11,
      address: 'address-b',
      role: 'User',
    };

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    let settled = false;
    const operation = renderProvider()
      .deleteAddress('address-a')
      .then(() => {
        settled = true;
      });
    await waitForMockCalls(mockChangeUserAddress, 1);
    await flushMicrotasks();
    expect(settled).toBe(false);

    fallback.resolve({ accessToken: 'fallback-session-token' });
    await operation;
    expect(settled).toBe(true);
    expect(mockUpdateSession).toHaveBeenCalledWith('fallback-session-token');
  });

  it('lets an active-address delete fallback supersede an overlapping change', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }, { address: 'address-c' }],
    } as User;
    const directChange = deferred<{ accessToken: string }>();
    const fallbackChange = deferred<{ accessToken: string }>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);
    mockChangeUserAddress.mockReturnValueOnce(directChange.promise).mockReturnValueOnce(fallbackChange.promise);
    mockDecodedTokenSessions['fallback-address-token'] = {
      account: 101,
      user: 11,
      address: 'address-b',
      role: 'User',
    };
    mockDecodedTokenSessions['older-address-token'] = {
      account: 101,
      user: 11,
      address: 'address-c',
      role: 'User',
    };

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const olderChange = renderProvider().changeAddress('address-c');
    const deletion = renderProvider().deleteAddress('address-a');
    await waitForMockCalls(mockChangeUserAddress, 2);

    fallbackChange.resolve({ accessToken: 'fallback-address-token' });
    await deletion;
    directChange.resolve({ accessToken: 'older-address-token' });
    await olderChange;

    expect(mockUpdateSession).toHaveBeenCalledTimes(1);
    expect(mockUpdateSession).toHaveBeenCalledWith('fallback-address-token');
  });

  it('propagates a fallback address change rejection from deleteAddress', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const fallback = deferred<{ accessToken: string }>();
    const failure = new Error('fallback address change failed');
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);
    mockChangeUserAddress.mockReturnValue(fallback.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    await waitForMockCalls(mockChangeUserAddress, 1);

    fallback.reject(failure);
    await expect(operation).rejects.toThrow('fallback address change failed');
  });

  it('waits for the user reload after deleting a non-active address', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const refresh = deferred<User>();
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise);
    mockDeleteUserAddress.mockResolvedValue(undefined);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    let settled = false;
    const operation = renderProvider()
      .deleteAddress('address-b')
      .then(() => {
        settled = true;
      });
    await waitForMockCalls(mockGetUser, 2);
    await flushMicrotasks();
    expect(settled).toBe(false);

    refresh.resolve(user);
    await operation;
    expect(settled).toBe(true);
  });

  it('propagates a rejected address deletion request', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockRejectedValue(new Error('address deletion failed'));

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();

    await expect(renderProvider().deleteAddress('address-b')).rejects.toThrow('address deletion failed');
  });

  it('uses the fallback when deleting the active EVM address with different casing', async () => {
    const activeAddress = '0xAbCd1234';
    const user = {
      accountId: 101,
      activeAddress: { address: activeAddress },
      addresses: [{ address: activeAddress }, { address: 'fallback-address' }],
    } as User;
    mockSession = { account: 101, user: 11, address: activeAddress, role: 'User' };
    mockAuthTokenSession = { ...mockSession };
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);
    mockChangeUserAddress.mockResolvedValue({ accessToken: 'fallback-session-token' });
    mockDecodedTokenSessions['fallback-session-token'] = {
      account: 101,
      user: 11,
      address: 'fallback-address',
      role: 'User',
    };

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    await renderProvider().deleteAddress(activeAddress.toLowerCase());

    expect(mockDeleteUserAddress).toHaveBeenCalledWith(activeAddress.toLowerCase(), 'auth-token-a');
    expect(mockChangeUserAddress).toHaveBeenCalledWith('fallback-address', 'auth-token-a');
    expect(mockDeleteSession).not.toHaveBeenCalled();
    expect(mockUpdateSession).toHaveBeenCalledWith('fallback-session-token');
  });

  it('treats differently cased non-EVM addresses as distinct when deleting an address', async () => {
    const activeAddress = 'bc1qExampleAddress';
    const user = {
      accountId: 101,
      activeAddress: { address: activeAddress },
      addresses: [{ address: activeAddress }, { address: 'another-address' }],
    } as User;
    mockSession = { account: 101, user: 11, address: activeAddress, role: 'User' };
    mockAuthTokenSession = { ...mockSession };
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockResolvedValue(undefined);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    await renderProvider().deleteAddress(activeAddress.toUpperCase());

    expect(mockDeleteUserAddress).toHaveBeenCalledWith(activeAddress.toUpperCase(), 'auth-token-a');
    expect(mockChangeUserAddress).not.toHaveBeenCalled();
    expect(mockDeleteSession).not.toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledTimes(2);
  });

  it('skips the address fallback when a different user token becomes current', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockReturnValue(deletion.promise);
    mockChangeUserAddress.mockResolvedValue({ accessToken: 'unexpected-stale-fallback-token' });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    mockAuthToken = 'different-user-token';
    mockAuthTokenSession = { account: 101, user: 12, address: 'address-a' };
    deletion.resolve();

    await operation;
    expect(mockChangeUserAddress).not.toHaveBeenCalled();
    expect(mockDeleteSession).not.toHaveBeenCalled();
  });

  it('skips the address fallback when the current token has a different address', async () => {
    const user = {
      accountId: 101,
      activeAddress: { address: 'address-a' },
      addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    } as User;
    const deletion = deferred<void>();
    mockGetUser.mockResolvedValue(user);
    mockDeleteUserAddress.mockReturnValue(deletion.promise);
    mockChangeUserAddress.mockResolvedValue({ accessToken: 'unexpected-stale-fallback-token' });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().deleteAddress('address-a');
    mockAuthToken = 'different-address-token';
    mockAuthTokenSession = { account: 101, user: 11, address: 'address-c' };
    deletion.resolve();

    await operation;
    expect(mockChangeUserAddress).not.toHaveBeenCalled();
    expect(mockDeleteSession).not.toHaveBeenCalled();
  });

  it('returns a generated key when token rotation keeps the same identity before refresh', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const refresh = deferred<User>();
    const key = { key: 'new-key', secret: 'one-time-secret' };
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise);
    mockGenerateCTApiKey.mockImplementation(async () => {
      mockAuthToken = 'rotated-same-account-token';
      mockAuthTokenSession = { account: 101, user: 11, address: 'address-a' };
      return key;
    });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().generateKeyCT();
    await Promise.resolve();
    refresh.resolve(user);

    await expect(operation).resolves.toEqual(key);
  });

  it('returns a generated key when token rotation keeps the same identity during refresh', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const refresh = deferred<User>();
    const key = { key: 'new-key', secret: 'one-time-secret' };
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise);
    mockGenerateCTApiKey.mockResolvedValue(key);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    const operation = renderProvider().generateKeyCT();
    await Promise.resolve();
    mockAuthToken = 'rotated-same-account-token';
    mockAuthTokenSession = { account: 101, user: 11, address: 'address-a' };
    refresh.resolve(user);

    await expect(operation).resolves.toEqual(key);
  });

  it('does not return a generated key after the current identity changes before refresh', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const key = { key: 'new-key', secret: 'one-time-secret' };
    mockGetUser.mockResolvedValueOnce(user);
    mockGenerateCTApiKey.mockImplementation(async () => {
      mockAuthToken = 'other-account-token';
      mockAuthTokenSession = { account: 202, user: 12, address: 'address-b' };
      return key;
    });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();

    await expect(renderProvider().generateKeyCT()).resolves.toBeUndefined();
    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });

  it('rejects a generated key for a changed address on the same account before rerender', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const key = { key: 'new-key', secret: 'one-time-secret' };
    mockGetUser.mockResolvedValueOnce(user);
    mockGenerateCTApiKey.mockImplementation(async () => {
      mockAuthToken = 'same-account-different-address-token';
      mockAuthTokenSession = { account: 101, user: 11, address: 'address-b' };
      return key;
    });

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();

    await expect(renderProvider().generateKeyCT()).resolves.toBeUndefined();
    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });

  it('returns a generated key when refresh fails but the current identity is unchanged', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const key = { key: 'new-key', secret: 'one-time-secret' };
    mockGetUser.mockResolvedValueOnce(user).mockRejectedValueOnce(new Error('refresh failed'));
    mockGenerateCTApiKey.mockResolvedValue(key);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();

    await expect(renderProvider().generateKeyCT()).resolves.toEqual(key);
  });

  it('waits for deleteKeyCT and propagates its rejection', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const refresh = deferred<User>();
    const pending = deferred<void>();
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise).mockResolvedValue(user);
    mockDeleteCTApiKey.mockReturnValue(pending.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    let settled = false;
    const operation = renderProvider()
      .deleteKeyCT()
      .then(
        () => {
          settled = true;
        },
        () => {
          settled = true;
        },
      );
    await Promise.resolve();
    expect(settled).toBe(false);
    pending.resolve();
    await Promise.resolve();
    expect(settled).toBe(false);
    refresh.resolve(user);
    await operation;
    expect(settled).toBe(true);

    mockDeleteCTApiKey.mockRejectedValueOnce(new Error('delete rejected'));
    await expect(renderProvider().deleteKeyCT()).rejects.toThrow('delete rejected');
  });

  it('waits for updateFilterCT and propagates its rejection', async () => {
    const user = { accountId: 101, addresses: [{ address: 'address-a' }] } as User;
    const refresh = deferred<User>();
    const pending = deferred<void>();
    mockGetUser.mockResolvedValueOnce(user).mockReturnValueOnce(refresh.promise).mockResolvedValue(user);
    mockUpdateCTApiFilter.mockReturnValue(pending.promise);

    renderProvider();
    await Promise.resolve();
    await Promise.resolve();
    let settled = false;
    const operation = renderProvider()
      .updateFilterCT()
      .then(
        () => {
          settled = true;
        },
        () => {
          settled = true;
        },
      );
    await Promise.resolve();
    expect(settled).toBe(false);
    pending.resolve();
    await Promise.resolve();
    expect(settled).toBe(false);
    refresh.resolve(user);
    await operation;
    expect(settled).toBe(true);

    mockUpdateCTApiFilter.mockRejectedValueOnce(new Error('filter rejected'));
    await expect(renderProvider().updateFilterCT()).rejects.toThrow('filter rejected');
  });
});
