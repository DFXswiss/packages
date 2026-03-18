import { Language, LanguageUrl } from '../definitions/language';
import { DfxHttpClient } from './DfxHttpClient';

export class LanguageApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<Language[]> {
    return this.http.request<Language[]>({ url: LanguageUrl.get, method: 'GET', token: false });
  }
}
