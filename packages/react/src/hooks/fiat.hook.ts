import { useMemo } from 'react';
import { Fiat, FiatUrl } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface FiatInterface {
  getCurrencies: () => Promise<Fiat[]>;
  getCurrency: (currencies: Fiat[], identifier: string) => Fiat | undefined;
  getDefaultCurrency: (currencies: Fiat[]) => Fiat | undefined;

  toDescription: (currency: Fiat) => string;
  toSymbol: (currency: Fiat) => string;
}

export function useFiat(): FiatInterface {
  const { call } = useApi();

  async function getCurrencies(): Promise<Fiat[]> {
    return call<Fiat[]>({ url: FiatUrl.get, method: 'GET' });
  }

  function getCurrency(currencies: Fiat[], identifier: string): Fiat | undefined {
    return currencies.find((a) => a.id === +identifier) ?? currencies.find((a) => a.name === identifier);
  }

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

  return useMemo(
    () => ({
      getCurrencies,
      getCurrency,
      getDefaultCurrency: (currencies: Fiat[]) => currencies.find((f) => f.name === 'EUR'),
      toDescription: (currency: Fiat) => definitions.description[currency.name],
      toSymbol: (currency: Fiat) => definitions.symbol[currency.name],
    }),
    [call],
  );
}
