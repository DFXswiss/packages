import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Fiat } from '../definitions/fiat';
import { useFiat } from '../hooks/fiat.hook';

interface FiatInterface {
  currencies?: Fiat[];
}

const FiatContext = createContext<FiatInterface>(undefined as any);

export function useFiatContext(): FiatInterface {
  return useContext(FiatContext);
}

export function FiatContextProvider(props: PropsWithChildren): JSX.Element {
  const [currencies, setCurrencies] = useState<Fiat[]>();
  const { getCurrencies } = useFiat();

  useEffect(() => {
    // eslint-disable-next-line no-console
    getCurrencies().then(setCurrencies).catch(console.error); // TODO: (Krysh) add real error handling
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context: FiatInterface = useMemo(
    () => ({
      currencies: currencies?.filter(
        (c) => c.buyable || c.sellable || c.cardBuyable || c.cardSellable || c.instantBuyable || c.instantSellable,
      ),
    }),
    [currencies],
  );

  return <FiatContext.Provider value={context}>{props.children}</FiatContext.Provider>;
}
