import { useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { Session } from '../definitions/session';
import { useAuth } from './auth.hook';

export interface ApiSessionInterface {
  isLoggedIn: boolean;
  session?: Session;
  getSignMessage: (address: string) => Promise<string>;
  createSession: (address: string, signature: string, isSignUp: boolean, wallet?: string) => Promise<string>;
  updateSession: (token: string) => void;
  deleteSession: () => Promise<void>;
}

export function useApiSession(): ApiSessionInterface {
  const { isLoggedIn, session, setAuthenticationToken } = useAuthContext();
  const { getSignMessage, signIn, signUp } = useAuth();

  async function createSession(
    address: string,
    signature: string,
    isSignUp: boolean,
    wallet?: string,
  ): Promise<string> {
    return (isSignUp ? signUp(address, signature, wallet) : signIn(address, signature)).then(({ accessToken }) => {
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
    () => ({ isLoggedIn, session, getSignMessage, createSession, updateSession, deleteSession }),
    [isLoggedIn, session, setAuthenticationToken, getSignMessage, signIn, signUp],
  );
}
