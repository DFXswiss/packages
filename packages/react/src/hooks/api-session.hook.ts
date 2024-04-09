import { useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { Session } from '../definitions/session';
import { useAuth } from './auth.hook';

export interface ApiSessionInterface {
  isInitialized: boolean;
  isLoggedIn: boolean;
  session?: Session;
  getSignMessage: (address: string) => Promise<string>;
  createSession: (
    isSignUp: boolean,
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ) => Promise<string>;
  createSessionNew: (
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ) => Promise<string>;
  updateSession: (token: string) => void;
  deleteSession: () => Promise<void>;
}

export function useApiSession(): ApiSessionInterface {
  const { isInitialized, isLoggedIn, session, setAuthenticationToken } = useAuthContext();
  const { getSignMessage, authenticate, signIn, signUp } = useAuth();

  async function createSession(
    isSignUp: boolean,
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ): Promise<string> {
    return (
      isSignUp ? signUp(address, signature, key, discount, wallet, ref) : signIn(address, signature, key, discount)
    ).then(({ accessToken }) => {
      setAuthenticationToken(accessToken);
      return accessToken;
    });
  }

  async function createSessionNew(
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ) {
    return authenticate(address, signature, key, discount, wallet, ref).then(({ accessToken }) => {
      setAuthenticationToken(accessToken);
      return accessToken;
    });
  }

  async function updateSession(token: string) {
    setAuthenticationToken(token);
  }

  async function deleteSession(): Promise<void> {
    setAuthenticationToken(undefined);
  }

  return useMemo(
    () => ({
      isInitialized,
      isLoggedIn,
      session,
      getSignMessage,
      createSession,
      createSessionNew,
      updateSession,
      deleteSession,
    }),
    [isInitialized, isLoggedIn, session, setAuthenticationToken, getSignMessage, signIn, signUp],
  );
}
