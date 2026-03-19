import { InfoBanner, SettingsUrl } from '../definitions/settings';
import { DfxHttpClient } from './DfxHttpClient';

export class SettingsApi {
  constructor(private readonly http: DfxHttpClient) {}

  async getInfoBanner(): Promise<InfoBanner> {
    return this.http.request<InfoBanner>({ url: SettingsUrl.infoBanner, method: 'GET', token: false });
  }
}
