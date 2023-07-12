import jwtDecode from 'jwt-decode';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Jwt } from '../definitions/jwt';
import { Session } from '../definitions/session';
import { Utils } from '../utils';
import { useStore } from '../hooks/store.hook';

interface AuthInterface {
  authenticationToken?: string;
  session?: Session;
  setAuthenticationToken: (authenticationToken?: string) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthInterface>(undefined as any);

export function useAuthContext(): AuthInterface {
  return useContext(AuthContext);
}

export function AuthContextProvider(props: PropsWithChildren): JSX.Element {
  const [token, setToken] = useState<string>();
  const [jwt, setJwt] = useState<Jwt>();
  const { authenticationToken } = useStore();

  const isLoggedIn = token != null && !isExpired();

  const session = useMemo(
    () => (jwt ? ({ address: jwt?.address, blockchains: jwt?.blockchains } as Session) : undefined),
    [jwt],
  );

  useEffect(() => {
    if (!token) setAuthenticationToken(authenticationToken.get());
  }, []);

  function isExpired(): boolean {
    if (!token) return true;

    try {
      const decoded = jwt ?? jwtDecode<Jwt>(token);
      return decoded?.exp != null && Date.now() > new Date(decoded?.exp * 1000).getTime();
    } catch {
      authenticationToken.remove();
      setToken(undefined);
      setJwt(undefined);
      return true;
    }
  }

  function setAuthenticationToken(newToken?: string) {
    newToken ? authenticationToken.set(newToken) : authenticationToken.remove();
    setToken(newToken);
    if (newToken && Utils.isJwt(newToken)) {
      setJwt(jwtDecode<Jwt>(newToken));
    } else {
      setJwt(undefined);
    }
  }

  const context: AuthInterface = useMemo(
    () => ({
      authenticationToken: token,
      session,
      setAuthenticationToken,
      isLoggedIn,
    }),
    [token, session, jwt, setAuthenticationToken, authenticationToken, isLoggedIn],
  );

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
}
