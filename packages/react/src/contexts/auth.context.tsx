import jwtDecode from 'jwt-decode';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Jwt } from '../definitions/jwt';
import { Session } from '../definitions/session';
import { useStore } from '../hooks/store.hook';

interface AuthInterface {
  authenticationToken?: string;
  session?: Session;
  setAuthenticationToken: (authenticationToken?: string) => void;
  isInitialized: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthInterface>(undefined as any);

export function useAuthContext(): AuthInterface {
  return useContext(AuthContext);
}

export function AuthContextProvider(props: PropsWithChildren): JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState<string>();
  const [jwt, setJwt] = useState<Jwt>();
  const { authenticationToken } = useStore();

  const isLoggedIn = token != null && !isExpired();

  const session = useMemo(
    () =>
      jwt
        ? ({
            address: jwt?.address,
            user: jwt?.user,
            account: jwt?.account,
            role: jwt?.role,
            blockchains: jwt?.blockchains,
          } as Session)
        : undefined,
    [jwt],
  );

  useEffect(() => {
    if (!token) {
      setAuthenticationToken(authenticationToken.get());
    }

    setIsInitialized(true);
  }, []);

  function isExpired(): boolean {
    if (!token) return true;

    const decoded = jwt ?? decodeJwt(token);

    if (decoded) {
      return decoded.exp != null && Date.now() > new Date(decoded.exp * 1000).getTime();
    } else {
      authenticationToken.remove();
      setToken(undefined);
      setJwt(undefined);
      return true;
    }
  }

  function setAuthenticationToken(newToken?: string) {
    newToken ? authenticationToken.set(newToken) : authenticationToken.remove();
    setToken(newToken);
    setJwt(decodeJwt(newToken));
  }

  function decodeJwt(token: string | undefined): Jwt | undefined {
    if (!token) return undefined;

    try {
      return jwtDecode<Jwt>(token);
    } catch {
      return undefined;
    }
  }

  const context: AuthInterface = useMemo(
    () => ({
      authenticationToken: token,
      session,
      setAuthenticationToken,
      isInitialized,
      isLoggedIn,
    }),
    [token, session, jwt, setAuthenticationToken, authenticationToken, isInitialized, isLoggedIn],
  );

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
}
