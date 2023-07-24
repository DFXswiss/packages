import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Blockchain } from '../definitions/blockchain';
import { ApiError } from '../definitions/error';
import { useApiSession } from '../hooks/api-session.hook';

export interface SessionInterface {
  address?: string;
  blockchain?: Blockchain;
  availableBlockchains?: Blockchain[];
  isLoggedIn: boolean;
  needsSignUp: boolean;
  isProcessing: boolean;
  login: (address?: string, signature?: string) => Promise<string | undefined>;
  signUp: (address?: string, signature?: string, wallet?: string) => Promise<string | undefined>;
  logout: () => Promise<void>;
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
  };
}

export function SessionContextProvider({ api, data, children }: SessionContextProviderProps): JSX.Element {
  const { isLoggedIn, session, getSignMessage, createSession: createApiSession, deleteSession } = useApiSession();
  const [needsSignUp, setNeedsSignUp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storedSignature, setStoredSignature] = useState<string>();

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!data.address || data.address !== session?.address) {
      deleteSession();
    }
  }, [data.address]);

  async function login(address = data.address, signature = storedSignature): Promise<string | undefined> {
    if (!address) throw new Error('Address is not defined');
    if (isLoggedIn && session?.address === address) return undefined;

    signature ??= await getSignature(address);

    return createSession(address, signature);
  }

  async function createSession(address: string, signature: string): Promise<string | undefined> {
    setIsProcessing(true);
    return createApiSession(address, signature, false)
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
    address = data.address,
    signature = storedSignature,
    wallet = data.wallet,
  ): Promise<string | undefined> {
    if (!address || !signature) throw new Error('Address or signature not defined');

    setIsProcessing(true);
    return createApiSession(address, signature, true, wallet).finally(() => {
      setStoredSignature(undefined);
      setNeedsSignUp(false);
      setIsProcessing(false);
    });
  }

  async function logout(): Promise<void> {
    setNeedsSignUp(false);
    await deleteSession();
  }

  async function getSignature(address: string): Promise<string> {
    if (!api.signMessage) throw new Error('No sign message API provided');

    const message = await getSignMessage(address);
    return await api.signMessage(message, address);
  }

  const context = useMemo(
    () => ({
      address: data.address,
      blockchain: data.blockchain,
      availableBlockchains: session?.blockchains,
      isLoggedIn,
      needsSignUp,
      isProcessing,
      login,
      signUp,
      logout,
    }),
    [data.address, data.blockchain, session, isLoggedIn, needsSignUp, isProcessing, login, signUp, logout],
  );

  return <SessionContext.Provider value={context}>{children}</SessionContext.Provider>;
}
