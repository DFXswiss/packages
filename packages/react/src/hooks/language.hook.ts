import { useCallback, useMemo } from 'react';
import { useApi } from './api.hook';
import { Language, LanguageUrl } from '../definitions/language';

export interface LanguageInterface {
  getLanguages: () => Promise<Language[]>;
  getDefaultLanguage: (languages?: Language[]) => Language | undefined;
}

export function useLanguage(): LanguageInterface {
  const { call } = useApi();

  const getLanguages = useCallback(async (): Promise<Language[]> => {
    return call<Language[]>({ url: LanguageUrl.get, method: 'GET' });
  }, [call]);

  const getDefaultLanguage = useCallback((languages: Language[] = []) => languages.find((f) => f.symbol === 'EN'), []);

  return useMemo(
    () => ({
      getLanguages,
      getDefaultLanguage,
    }),
    [getLanguages, getDefaultLanguage],
  );
}
