import { useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { Session } from '../definitions/session';
import { useAuth } from './auth.hook';
import { AuthWalletType } from '../definitions/auth';

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
    walletType?: AuthWalletType,
    recommendationCode?: string,
  ) => Promise<string>;
  createSessionNew: (
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
    walletType?: AuthWalletType,
    recommendationCode?: string,
  ) => Promise<string>;
  updateSession: (token: string) => void;
  deleteSession: () => Promise<void>;
}

export function useApiSession(): ApiSessionInterface {
  const { isInitialized, isLoggedIn, session, setAuthToken } = useAuthContext();
  const { getSignMessage, authenticate, signIn, signUp } = useAuth();

  async function createSession(
    isSignUp: boolean,
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
    walletType?: AuthWalletType,
    recommendationCode?: string,
  ): Promise<string> {
    return (
      isSignUp
        ? signUp(address, signature, key, discount, wallet, ref, walletType, recommendationCode)
        : signIn(address, signature, key, discount, walletType)
    ).then(({ accessToken }) => {
      setAuthToken(accessToken);
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
    walletType?: AuthWalletType,
    recommendationCode?: string,
  ) {
    return authenticate(address, signature, key, discount, wallet, ref, walletType, recommendationCode).then(
      ({ accessToken }) => {
        setAuthToken(accessToken);
        return accessToken;
      },
    );
  }

  function updateSession(token: string) {
    setAuthToken(token);
  }

  async function deleteSession(): Promise<void> {
    setAuthToken(undefined);
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
    [isInitialized, isLoggedIn, session, setAuthToken, getSignMessage, signIn, signUp, authenticate],
  );
}
