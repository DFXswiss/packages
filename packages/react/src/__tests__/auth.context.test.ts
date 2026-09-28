let mockHookSlots: unknown[] = [];
let mockHookCursor = 0;
let mockStoredAuthToken: string | undefined;
const mockAuthTokenStore = {
  get: jest.fn(() => mockStoredAuthToken),
  set: jest.fn((token: string) => {
    mockStoredAuthToken = token;
  }),
  remove: jest.fn(() => {
    mockStoredAuthToken = undefined;
  }),
};

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
      return [slot.value, (next: unknown) => (slot.value = next)];
    },
    useRef: (initial: unknown) => {
      const index = mockHookCursor++;
      return (mockHookSlots[index] ??= { current: initial }) as { current: unknown };
    },
    useMemo: memo,
    useCallback: (callback: (...args: unknown[]) => unknown, deps: unknown[]) => memo(() => callback, deps),
    useEffect: () => undefined,
  };
});

jest.mock('../hooks/store.hook', () => ({
  useStore: () => ({ authTokenStore: mockAuthTokenStore }),
}));

import { AuthContextProvider } from '../contexts/auth.context';
import type { Session } from '../definitions/session';

describe('AuthContextProvider synchronous token identity', () => {
  beforeEach(() => {
    mockHookSlots = [];
    mockHookCursor = 0;
    mockStoredAuthToken = undefined;
    jest.clearAllMocks();
  });

  it('reads the synchronously set token session before rerender and clears it synchronously', () => {
    mockHookCursor = 0;
    const auth = (AuthContextProvider({ children: null }) as any).props.value as {
      getAuthToken: () => string | undefined;
      getAuthTokenSession: () => Session | undefined;
      setAuthToken: (token?: string) => void;
    };
    const tokenB =
      'eyJhbGciOiJub25lIn0.eyJhY2NvdW50IjoyMDIsInVzZXIiOjIwMiwiYWRkcmVzcyI6ImFkZHItYiIsInJvbGUiOiJVc2VyIn0.';
    mockStoredAuthToken = tokenB;

    if (typeof auth.getAuthTokenSession !== 'function') {
      expect(auth.getAuthTokenSession).toBeDefined();
      return;
    }

    expect(auth.getAuthToken()).toBe(tokenB);
    const storedSession = auth.getAuthTokenSession();
    expect(storedSession).toMatchObject({ account: 202, user: 202, address: 'addr-b', role: 'User' });

    auth.setAuthToken(tokenB);
    expect(auth.getAuthTokenSession()).toEqual(storedSession);

    auth.setAuthToken(undefined);
    expect(auth.getAuthTokenSession()).toBeUndefined();
  });
});
