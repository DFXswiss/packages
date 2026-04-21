import { Fiat, FiatUrl } from '../definitions/fiat';
import { DfxHttpClient } from './DfxHttpClient';

export class FiatApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<Fiat[]> {
    return this.http.request<Fiat[]>({ url: FiatUrl.get, method: 'GET', token: false });
  }
}
