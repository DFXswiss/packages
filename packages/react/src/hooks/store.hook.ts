import { useMemo } from 'react';

export interface StoreInterface {
  authenticationToken: {
    get: () => string | undefined;
    set: (token: string) => void;
    remove: () => void;
  };
}

enum StoreKey {
  AUTH_TOKEN = 'dfx.authenticationToken',
}

export function useStore(): StoreInterface {
  const { localStorage } = window;

  function set(key: StoreKey, value: string) {
    localStorage.setItem(key, value);
  }

  function get(key: StoreKey): string | undefined {
    return localStorage.getItem(key) ?? undefined;
  }

  function remove(key: StoreKey) {
    localStorage.removeItem(key);
  }

  return useMemo(
    () => ({
      authenticationToken: {
        get: () => get(StoreKey.AUTH_TOKEN),
        set: (value: string) => set(StoreKey.AUTH_TOKEN, value),
        remove: () => remove(StoreKey.AUTH_TOKEN),
      },
    }),
    [],
  );
}
