import { useAuthContext } from '../contexts/auth.context';
import { Session } from '../definitions/session';
import { useAuth } from './auth.hook';

export interface ApiSessionInterface {
  isLoggedIn: boolean;
  session?: Session;
  getSignMessage: (address: string) => Promise<string>;
  createSession: (address: string, signature: string, isSignUp: boolean, walletId?: number) => Promise<string>;
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
    walletId?: number,
  ): Promise<string> {
    return (isSignUp ? signUp(address, signature, walletId) : signIn(address, signature)).then(({ accessToken }) => {
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

  return { isLoggedIn, session, getSignMessage, createSession, updateSession, deleteSession };
}
