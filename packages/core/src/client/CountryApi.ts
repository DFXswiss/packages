import { Country, CountryUrl } from '../definitions/country';
import { DfxHttpClient } from './DfxHttpClient';

export class CountryApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<Country[]> {
    return this.http.request<Country[]>({ url: CountryUrl.get, method: 'GET', token: false });
  }
}
