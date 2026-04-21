import jwtDecode from 'jwt-decode';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Jwt } from '../definitions/jwt';
import { Session } from '../definitions/session';
import { useStore } from '../hooks/store.hook';

interface AuthInterface {
  session?: Session;
  getAuthToken: () => string | undefined;
  setAuthToken: (authenticationToken?: string) => void;
  isInitialized: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthInterface>(undefined as any);

export function useAuthContext(): AuthInterface {
  return useContext(AuthContext);
}

export function AuthContextProvider(props: PropsWithChildren): JSX.Element {
  const { authTokenStore } = useStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [jwt, setJwt] = useState<Jwt>();

  const tokenRef = useRef<string>();

  const isLoggedIn = tokenRef.current != null && !isExpired();

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
    if (!tokenRef.current) {
      setAuthToken(authTokenStore.get());
    }

    setIsInitialized(true);
  }, []);

  function isExpired(): boolean {
    if (!tokenRef.current) return true;

    const decoded = jwt ?? decodeJwt(tokenRef.current);

    if (decoded) {
      return decoded.exp != null && Date.now() > new Date(decoded.exp * 1000).getTime();
    } else {
      authTokenStore.remove();
      tokenRef.current = undefined;
      setJwt(undefined);
      return true;
    }
  }

  function decodeJwt(token: string | undefined): Jwt | undefined {
    if (!token) return undefined;

    try {
      return jwtDecode<Jwt>(token);
    } catch {
      return undefined;
    }
  }

  const setAuthToken = useCallback(
    (newToken?: string) => {
      newToken ? authTokenStore.set(newToken) : authTokenStore.remove();
      tokenRef.current = newToken;
      setJwt(decodeJwt(newToken));
    },
    [authTokenStore],
  );

  const getAuthToken = useCallback((): string | undefined => {
    return tokenRef.current ?? authTokenStore.get();
  }, [authTokenStore]);

  const context: AuthInterface = useMemo(
    () => ({
      session,
      getAuthToken,
      setAuthToken,
      isInitialized,
      isLoggedIn,
    }),
    [session, getAuthToken, setAuthToken, isInitialized, isLoggedIn],
  );

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
}
