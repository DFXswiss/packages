let mockHookSlots: unknown[] = [];
let mockHookCursor = 0;
let mockPendingEffects: Array<() => void> = [];
let mockSession: { account: number; user?: string; address?: string } | undefined;
let mockGetUser: jest.Mock;

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
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
  }),
}));

jest.mock('../hooks/user.hook', () => ({
  useUser: () => ({
    getUser: mockGetUser,
    updateUser: jest.fn(),
    updateMail: jest.fn(),
    verifyMail: jest.fn(),
    addSpecialCode: jest.fn(),
    renameUserAddress: jest.fn(),
    changeUserAddress: jest.fn(),
    deleteUserAddress: jest.fn(),
    deleteUserAccount: jest.fn(),
    generateCTApiKey: jest.fn(),
    deleteCTApiKey: jest.fn(),
    updateCTApiFilter: jest.fn(),
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
    mockGetUser = jest.fn();
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
});
