import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Blockchain } from '../definitions/blockchain';
import { ApiError } from '../definitions/error';
import { useApiSession } from '../hooks/api-session.hook';
import { useAuthContext } from './auth.context';

export interface SessionInterface {
  address?: string;
  blockchain?: Blockchain;
  availableBlockchains?: Blockchain[];
  isInitialized: boolean;
  isLoggedIn: boolean;
  needsSignUp: boolean;
  isProcessing: boolean;
  authenticate: (
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ) => Promise<string>;
  login: (address?: string, signature?: string, discount?: string) => Promise<string | undefined>;
  signUp: (
    address?: string,
    signature?: string,
    wallet?: string,
    ref?: string,
    discount?: string,
  ) => Promise<string | undefined>;
  logout: () => Promise<void>;
  sync: () => void;
}

const SessionContext = createContext<SessionInterface>(undefined as any);

export function useSessionContext(): SessionInterface {
  return useContext(SessionContext);
}

export interface SessionContextProviderProps extends PropsWithChildren {
  api: {
    signMessage?: (message: string, address: string) => Promise<string>;
  };
  data: {
    wallet?: string;
    address?: string;
    blockchain?: Blockchain;
    ref?: string;
    discount?: string;
  };
}

export function SessionContextProvider({ api, data, children }: SessionContextProviderProps): JSX.Element {
  const {
    isInitialized,
    isLoggedIn,
    session,
    getSignMessage,
    createSession: createApiSession,
    createSessionNew: createApiSessionNew,
    deleteSession,
  } = useApiSession();
  const { authenticationToken, setAuthenticationToken } = useAuthContext();
  const [needsSignUp, setNeedsSignUp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storedSignature, setStoredSignature] = useState<string>();
  const [storedAddress, setStoredAddress] = useState<string>();

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!data.address || data.address !== session?.address) {
      deleteSession();
      setStoredAddress(undefined);
    } else {
      setStoredAddress(data.address);
    }
  }, [data.address]);

  async function authenticate(
    address: string,
    signature: string,
    key?: string,
    discount?: string,
    wallet?: string,
    ref?: string,
  ): Promise<string> {
    setIsProcessing(true);
    return createApiSessionNew(address, signature, key, discount, wallet, ref).finally(() => setIsProcessing(false));
  }

  async function login(
    address = storedAddress,
    signature = storedSignature,
    discount = data.discount,
  ): Promise<string | undefined> {
    if (!address) throw new Error('Address is not defined');
    if (isLoggedIn && session?.address === address) authenticationToken;

    signature ??= await getSignature(address);

    return createSession(address, signature, discount);
  }

  async function createSession(address: string, signature: string, discount?: string): Promise<string | undefined> {
    setIsProcessing(true);
    return createApiSession(false, address, signature, undefined, discount)
      .catch((error: ApiError) => {
        if (error.statusCode === 404) {
          setStoredSignature(signature);
          setNeedsSignUp(true);
        } else {
          throw error;
        }

        return undefined;
      })
      .finally(() => setIsProcessing(false));
  }

  async function signUp(
    address = storedAddress,
    signature = storedSignature,
    wallet = data.wallet,
    ref = data.ref,
    discount = data.discount,
  ): Promise<string | undefined> {
    if (!address || !signature) throw new Error('Address or signature not defined');

    setIsProcessing(true);
    return createApiSession(true, address, signature, undefined, discount, wallet, ref).finally(() => {
      setStoredSignature(undefined);
      setNeedsSignUp(false);
      setIsProcessing(false);
    });
  }

  async function logout(): Promise<void> {
    setNeedsSignUp(false);
    setStoredAddress(undefined);
    await deleteSession();
  }

  async function getSignature(address: string): Promise<string> {
    if (!api.signMessage) throw new Error('No sign message API provided');

    const message = await getSignMessage(address);
    return await api.signMessage(message, address);
  }

  function sync(): void {
    const token = localStorage.getItem('dfx.authenticationToken');
    if (token) setAuthenticationToken(token);
  }

  const context = useMemo(
    () => ({
      address: storedAddress,
      blockchain: data.blockchain,
      availableBlockchains: session?.blockchains,
      isInitialized,
      isLoggedIn,
      needsSignUp,
      isProcessing,
      authenticate,
      login,
      signUp,
      logout,
      sync,
    }),
    [
      storedAddress,
      data.blockchain,
      session,
      isInitialized,
      isLoggedIn,
      needsSignUp,
      isProcessing,
      login,
      signUp,
      logout,
      sync,
    ],
  );

  return <SessionContext.Provider value={context}>{children}</SessionContext.Provider>;
}
