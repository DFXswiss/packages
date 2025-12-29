import { useCallback, useMemo } from 'react';
import { Country, CountryUrl } from '../definitions/country';
import { useApi } from './api.hook';

export interface CountryInterface {
  getCountries: () => Promise<Country[]>;
}

export function useCountry(): CountryInterface {
  const { call } = useApi();

  const getCountries = useCallback(async (): Promise<Country[]> => {
    return call<Country[]>({ url: CountryUrl.get, method: 'GET' });
  }, [call]);

  return useMemo(() => ({ getCountries }), [getCountries]);
}
