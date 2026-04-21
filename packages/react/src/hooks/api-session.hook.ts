import { useCallback, useMemo } from 'react';
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
    language?: string,
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
    language?: string,
  ) => Promise<string>;
  updateSession: (token: string) => void;
  deleteSession: () => Promise<void>;
}

export function useApiSession(): ApiSessionInterface {
  const { isInitialized, isLoggedIn, session, setAuthToken } = useAuthContext();
  const { getSignMessage, authenticate, signIn, signUp } = useAuth();

  const createSession = useCallback(
    async (
      isSignUp: boolean,
      address: string,
      signature: string,
      key?: string,
      discount?: string,
      wallet?: string,
      ref?: string,
      walletType?: AuthWalletType,
      recommendationCode?: string,
      language?: string,
    ): Promise<string> => {
      return (
        isSignUp
          ? signUp(address, signature, key, discount, wallet, ref, walletType, recommendationCode, language)
          : signIn(address, signature, key, discount, walletType)
      ).then(({ accessToken }) => {
        setAuthToken(accessToken);
        return accessToken;
      });
    },
    [signUp, signIn, setAuthToken],
  );

  const createSessionNew = useCallback(
    async (
      address: string,
      signature: string,
      key?: string,
      discount?: string,
      wallet?: string,
      ref?: string,
      walletType?: AuthWalletType,
      recommendationCode?: string,
      language?: string,
    ) => {
      return authenticate(address, signature, key, discount, wallet, ref, walletType, recommendationCode, language).then(
        ({ accessToken }) => {
          setAuthToken(accessToken);
          return accessToken;
        },
      );
    },
    [authenticate, setAuthToken],
  );

  const updateSession = useCallback((token: string) => {
    setAuthToken(token);
  }, [setAuthToken]);

  const deleteSession = useCallback(async (): Promise<void> => {
    setAuthToken(undefined);
  }, [setAuthToken]);

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
    [isInitialized, isLoggedIn, session, getSignMessage, createSession, createSessionNew, updateSession, deleteSession],
  );
}
