import { useMemo } from 'react';
import { useApi } from './api.hook';
import { InfoBanner, SettingsUrl } from '../definitions/settings';

export interface SettingsInterface {
  getInfoBanner: () => Promise<InfoBanner>;
}

export function useSettings(): SettingsInterface {
  const { call } = useApi();

  async function getInfoBanner(): Promise<InfoBanner> {
    return call<InfoBanner>({ url: SettingsUrl.infoBanner, method: 'GET' });
  }

  return useMemo(() => ({ getInfoBanner }), [call]);
}
