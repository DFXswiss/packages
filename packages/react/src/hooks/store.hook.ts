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

function read(): string | undefined {
  try {
    return window.localStorage.getItem(StoreKey.AUTH_TOKEN) ?? undefined;
  } catch {
    return undefined;
  }
}

function write(value: string): void {
  try {
    window.localStorage.setItem(StoreKey.AUTH_TOKEN, value);
  } catch {
    // no-op when storage is blocked or full
  }
}

function forget(): void {
  try {
    window.localStorage.removeItem(StoreKey.AUTH_TOKEN);
  } catch {
    // no-op when storage is blocked
  }
}

export function createAuthTokenStore(): StoreInterface['authTokenStore'] {
  return {
    get: () => read(),
    set: (token: string) => write(token),
    remove: () => forget(),
  };
}

export function useStore(): StoreInterface {
  return useMemo(
    () => ({
      authTokenStore: createAuthTokenStore(),
    }),
    [], // No dependencies - this object should be stable
  );
}
