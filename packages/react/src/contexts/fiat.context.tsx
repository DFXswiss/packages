import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Fiat } from '../definitions/fiat';
import { useFiat } from '../hooks/fiat.hook';
import { useAuthContext } from './auth.context';

interface FiatInterface {
  currencies?: Fiat[];
}

const FiatContext = createContext<FiatInterface>(undefined as any);

export function useFiatContext(): FiatInterface {
  return useContext(FiatContext);
}

export function FiatContextProvider(props: PropsWithChildren): JSX.Element {
  const { isLoggedIn } = useAuthContext();
  const [currencies, setCurrencies] = useState<Fiat[]>();
  const { getCurrencies } = useFiat();

  useEffect(() => {
    if (isLoggedIn) {
      getCurrencies().then(setCurrencies).catch(console.error); // TODO: (Krysh) add real error handling
    }
  }, [isLoggedIn]);

  const context: FiatInterface = useMemo(
    () => ({
      currencies,
    }),
    [currencies],
  );

  return <FiatContext.Provider value={context}>{props.children}</FiatContext.Provider>;
}
