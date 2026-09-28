let mockHookSlots: unknown[] = [];
let mockHookCursor = 0;
let mockPendingEffects: Array<() => void> = [];
let mockSession: { account: number; user?: string; address?: string } | undefined;
let mockAuthToken: string | undefined;
let mockGetUser: jest.Mock;
let mockUpdateSession: jest.Mock;
let mockChangeUserAddress: jest.Mock;
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
    deleteSession: jest.fn(),
  }),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({ getAuthToken: () => mockAuthToken }),
}));

jest.mock('../hooks/user.hook', () => ({
  useUser: () => ({
    getUser: mockGetUser,
    updateUser: jest.fn(),
    updateMail: jest.fn(),
    verifyMail: jest.fn(),
    addSpecialCode: jest.fn(),
    renameUserAddress: jest.fn(),
    changeUserAddress: mockChangeUserAddress,
    deleteUserAddress: jest.fn(),
    deleteUserAccount: jest.fn(),
    generateCTApiKey: mockGenerateCTApiKey,
    deleteCTApiKey: mockDeleteCTApiKey,
    updateCTApiFilter: mockUpdateCTApiFilter,
    updateCallSettings: jest.fn(),
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
    changeAddress: (address: string) => Promise<void>;
    generateKeyCT: () => Promise<{ key: string; secret: string } | undefined>;
    deleteKeyCT: () => Promise<void>;
    updateFilterCT: () => Promise<void>;
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

describe('UserContextProvider user-load recovery', () => {
  beforeEach(() => {
    mockHookSlots = [];
    mockHookCursor = 0;
    mockPendingEffects = [];
    mockSession = { account: 101, user: 'token-a', address: 'address-a' };
    mockAuthToken = 'auth-token-a';
    mockGetUser = jest.fn();
    mockUpdateSession = jest.fn();
    mockChangeUserAddress = jest.fn();
    mockGenerateCTApiKey = jest.fn();
    mockDeleteCTApiKey = jest.fn();
    mockUpdateCTApiFilter = jest.fn();
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
    mockSession = { account: 202, user: 'token-b', address: 'address-b' };
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

  it('does not return a generated key when the auth token rotates during the refresh', async () => {
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
