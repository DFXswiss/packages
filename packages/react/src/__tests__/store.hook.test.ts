import { createAuthTokenStore } from '../hooks/store.hook';

const AUTH_TOKEN_KEY = 'dfx.authenticationToken';

type StorageMock = {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

function createMemoryStorage(initial: Record<string, string> = {}): StorageMock & { data: Record<string, string> } {
  const data: Record<string, string> = { ...initial };
  return {
    data,
    getItem: jest.fn((key: string) => (key in data ? data[key] : null)),
    setItem: jest.fn((key: string, value: string) => {
      data[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete data[key];
    }),
  };
}

function setWindowLocalStorage(localStorage: StorageMock | undefined): void {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: localStorage
      ? {
          get localStorage() {
            return localStorage;
          },
        }
      : {},
  });
}

function setWindowWithThrowingLocalStorage(error: Error): void {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: {
      get localStorage() {
        throw error;
      },
    },
  });
}

describe('createAuthTokenStore', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
  });

  describe('happy path', () => {
    it('gets, sets, and removes the auth token', () => {
      const storage = createMemoryStorage();
      setWindowLocalStorage(storage);

      const store = createAuthTokenStore();

      expect(store.get()).toBeUndefined();

      store.set('token-1');
      expect(storage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY, 'token-1');
      expect(store.get()).toBe('token-1');

      store.remove();
      expect(storage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(store.get()).toBeUndefined();
    });

    it('returns undefined when the key is missing', () => {
      const storage = createMemoryStorage();
      setWindowLocalStorage(storage);

      const store = createAuthTokenStore();

      expect(store.get()).toBeUndefined();
      expect(storage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
    });
  });

  describe('blocked storage (SecurityError on localStorage getter)', () => {
    function securityError(): Error {
      const error = new Error('The operation is insecure.');
      error.name = 'SecurityError';
      return error;
    }

    it('createAuthTokenStore itself does not throw', () => {
      setWindowWithThrowingLocalStorage(securityError());
      expect(() => createAuthTokenStore()).not.toThrow();
    });

    it('get does not throw and returns undefined', () => {
      setWindowWithThrowingLocalStorage(securityError());
      const store = createAuthTokenStore();
      expect(() => store.get()).not.toThrow();
      expect(store.get()).toBeUndefined();
    });

    it('set does not throw (no-op)', () => {
      setWindowWithThrowingLocalStorage(securityError());
      const store = createAuthTokenStore();
      expect(() => store.set('token')).not.toThrow();
      expect(store.get()).toBeUndefined();
    });

    it('remove does not throw (no-op)', () => {
      setWindowWithThrowingLocalStorage(securityError());
      const store = createAuthTokenStore();
      expect(() => store.remove()).not.toThrow();
    });
  });

  describe('QuotaExceeded on setItem', () => {
    it('set is a no-op and does not throw', () => {
      const storage = createMemoryStorage();
      storage.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });
      setWindowLocalStorage(storage);

      const store = createAuthTokenStore();
      expect(() => store.set('token')).not.toThrow();
      expect(store.get()).toBeUndefined();
    });
  });

  describe('window without usable localStorage', () => {
    it('methods do not throw when window has no localStorage', () => {
      setWindowLocalStorage(undefined);

      const store = createAuthTokenStore();
      expect(() => store.get()).not.toThrow();
      expect(store.get()).toBeUndefined();
      expect(() => store.set('token')).not.toThrow();
      expect(() => store.remove()).not.toThrow();
    });

    it('methods do not throw when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: undefined,
      });

      const store = createAuthTokenStore();
      expect(() => store.get()).not.toThrow();
      expect(store.get()).toBeUndefined();
      expect(() => store.set('token')).not.toThrow();
      expect(() => store.remove()).not.toThrow();
    });
  });
});
