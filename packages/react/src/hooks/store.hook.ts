import { useMemo } from 'react';

export interface StoreInterface {
  authTokenStore: {
    get: () => string | undefined;
    set: (token: string) => void;
    remove: () => void;
  };
}

enum StoreKey {
  AUTH_TOKEN = 'dfx.authenticationToken',
}

export function useStore(): StoreInterface {
  return useMemo(
    () => ({
      authTokenStore: {
        get: () => window.localStorage.getItem(StoreKey.AUTH_TOKEN) ?? undefined,
        set: (value: string) => window.localStorage.setItem(StoreKey.AUTH_TOKEN, value),
        remove: () => window.localStorage.removeItem(StoreKey.AUTH_TOKEN),
      },
    }),
    [], // No dependencies - this object should be stable
  );
}
