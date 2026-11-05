import { ChainInfo, ChainUrl } from '../definitions/chain';
import { DfxHttpClient } from './DfxHttpClient';

/** Chain classification capability (D23); public, cached 5 min server-side. */
export class ChainApi {
  constructor(private readonly http: DfxHttpClient) {}

  list(): Promise<ChainInfo[]> {
    return this.http.request<ChainInfo[]>({ url: ChainUrl.classification, method: 'GET', token: false });
  }
}
