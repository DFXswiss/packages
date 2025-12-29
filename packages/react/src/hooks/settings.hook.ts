import { useCallback, useMemo } from 'react';
import { useApi } from './api.hook';
import { InfoBanner, SettingsUrl } from '../definitions/settings';

export interface SettingsInterface {
  getInfoBanner: () => Promise<InfoBanner>;
}

export function useSettings(): SettingsInterface {
  const { call } = useApi();

  const getInfoBanner = useCallback(async (): Promise<InfoBanner> => {
    return call<InfoBanner>({ url: SettingsUrl.infoBanner, method: 'GET' });
  }, [call]);

  return useMemo(() => ({ getInfoBanner }), [getInfoBanner]);
}
