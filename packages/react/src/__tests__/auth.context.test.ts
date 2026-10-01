let mockHookSlots: unknown[] = [];
let mockHookCursor = 0;
let mockStoredAuthToken: string | undefined;
let mockPendingEffects: Array<() => void> = [];
let mockMountEffectQueued = false;
let mockAuthContextValue: unknown;
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
    useContext: () => mockAuthContextValue,
    useCallback: (callback: (...args: unknown[]) => unknown, deps: unknown[]) => memo(() => callback, deps),
    useEffect: (effect: () => void) => {
      mockHookCursor++;
      if (!mockMountEffectQueued) {
        mockMountEffectQueued = true;
        mockPendingEffects.push(effect);
      }
    },
  };
});

jest.mock('../hooks/store.hook', () => ({
  useStore: () => ({ authTokenStore: mockAuthTokenStore }),
}));

import { AuthContextProvider, useAuthContext } from '../contexts/auth.context';
import type { Session } from '../definitions/session';

interface AuthValue {
  session?: Session;
  getAuthToken: () => string | undefined;
  getAuthTokenSession: (token?: string) => Session | undefined;
  setAuthToken: (token?: string) => void;
  isInitialized: boolean;
  isLoggedIn: boolean;
}

function renderAuth(): AuthValue {
  mockHookCursor = 0;
  const value = (AuthContextProvider({ children: null }) as any).props.value as AuthValue;
  mockAuthContextValue = value;
  return value;
}

function initializeAuth(): AuthValue {
  renderAuth();
  mockPendingEffects.splice(0).forEach((effect) => effect());
  return renderAuth();
}

function tokenFor(claims: Record<string, unknown>): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(claims)}.signature`;
}

describe('AuthContextProvider synchronous token identity', () => {
  beforeEach(() => {
    mockHookSlots = [];
    mockHookCursor = 0;
    mockPendingEffects = [];
    mockMountEffectQueued = false;
    mockAuthContextValue = undefined;
    mockStoredAuthToken = undefined;
    jest.clearAllMocks();
  });

  it('reads the synchronously set token session before rerender and clears it synchronously', () => {
    const auth = initializeAuth();
    const tokenB =
      'eyJhbGciOiJub25lIn0.eyJhY2NvdW50IjoyMDIsInVzZXIiOjIwMiwiYWRkcmVzcyI6ImFkZHItYiIsInJvbGUiOiJVc2VyIn0.';
    mockStoredAuthToken = tokenB;

    expect(auth.getAuthToken()).toBe(tokenB);
    const storedSession = auth.getAuthTokenSession();
    expect(storedSession).toMatchObject({ account: 202, user: 202, address: 'addr-b', role: 'User' });

    auth.setAuthToken(tokenB);
    expect(auth.getAuthTokenSession()).toEqual(storedSession);

    auth.setAuthToken(undefined);
    expect(auth.getAuthTokenSession()).toBeUndefined();
    expect(mockAuthTokenStore.remove).toHaveBeenCalled();
    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoggedIn).toBe(false);
  });

  it('initializes from storage and decodes only the requested token session', () => {
    const storedToken = tokenFor({
      account: 202,
      user: 9,
      address: '0xAbC',
      role: 'Admin',
      blockchains: ['Ethereum'],
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const explicitToken = tokenFor({ account: 303, user: 10, address: 'other', role: 'User' });
    mockStoredAuthToken = storedToken;

    const auth = initializeAuth();

    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.session).toMatchObject({
      account: 202,
      user: 9,
      address: '0xAbC',
      role: 'Admin',
      blockchains: ['Ethereum'],
    });
    expect(auth.getAuthToken()).toBe(storedToken);
    expect(auth.getAuthTokenSession()).toMatchObject({ account: 202, user: 9, address: '0xAbC', role: 'Admin' });
    expect(auth.getAuthTokenSession(explicitToken)).toMatchObject({
      account: 303,
      user: 10,
      address: 'other',
      role: 'User',
    });
    expect(mockAuthTokenStore.get).toHaveBeenCalled();
  });

  it('does not treat an expired stored token as logged in', () => {
    mockStoredAuthToken = tokenFor({ account: 202, user: 9, role: 'User', exp: 1 });

    const auth = initializeAuth();

    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.getAuthToken()).toBe(mockStoredAuthToken);
    expect(mockAuthTokenStore.remove).not.toHaveBeenCalled();
  });

  it('clears an undecodable stored token and remains initialized while signed out', () => {
    mockStoredAuthToken = 'not-a-jwt';

    const auth = initializeAuth();

    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoggedIn).toBe(false);
    expect(mockAuthTokenStore.remove).toHaveBeenCalledTimes(1);
    expect(auth.getAuthToken()).toBeUndefined();
    expect(auth.getAuthTokenSession('not-a-jwt')).toBeUndefined();
  });

  it('initializes without a stored token and stays signed out', () => {
    const auth = initializeAuth();

    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.session).toBeUndefined();
    expect(auth.getAuthToken()).toBeUndefined();
    expect(mockAuthTokenStore.get).toHaveBeenCalled();
    expect(mockAuthTokenStore.remove).toHaveBeenCalledTimes(1);
  });

  it('returns the provider value from the public auth-context hook', () => {
    const auth = initializeAuth();

    expect(useAuthContext()).toBe(auth);
  });
});
