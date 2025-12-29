import { useCallback, useMemo } from 'react';
import { Fiat, FiatUrl } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface FiatInterface {
  getCurrencies: () => Promise<Fiat[]>;
  getCurrency: (currencies?: Fiat[], identifier?: string) => Fiat | undefined;
  getDefaultCurrency: (currencies?: Fiat[]) => Fiat | undefined;

  toDescription: (currency: Fiat) => string;
  toSymbol: (currency: Fiat) => string;
}

export function useFiat(): FiatInterface {
  const { call } = useApi();

  const getCurrencies = useCallback(async (): Promise<Fiat[]> => {
    return call<Fiat[]>({ url: FiatUrl.get, method: 'GET' });
  }, [call]);

  const getCurrency = useCallback((currencies: Fiat[] = [], identifier?: string): Fiat | undefined => {
    if (!identifier) return undefined;

    return (
      currencies.find((a) => a.id === +identifier) ??
      currencies.find((a) => a.name.toLowerCase() === identifier.toLowerCase())
    );
  }, []);

  const definitions = {
    description: {
      ['EUR']: 'Euro',
      ['USD']: 'US Dollar',
      ['CHF']: 'Swiss Franc',
      ['GBP']: 'British Pound',
    } as Record<string, string>,
    symbol: {
      ['EUR']: '€',
      ['USD']: '$',
      ['CHF']: '₣',
      ['GBP']: '£',
    } as Record<string, string>,
  };

  const getDefaultCurrency = useCallback((currencies: Fiat[] = []) => currencies.find((f) => f.name === 'EUR'), []);

  const toDescription = useCallback((currency: Fiat) => definitions.description[currency.name], []);

  const toSymbol = useCallback((currency: Fiat) => definitions.symbol[currency.name], []);

  return useMemo(
    () => ({
      getCurrencies,
      getCurrency,
      getDefaultCurrency,
      toDescription,
      toSymbol,
    }),
    [getCurrencies, getCurrency, getDefaultCurrency, toDescription, toSymbol],
  );
}
