import { Asset, AssetUrl } from '../definitions/asset';
import { Blockchain } from '../definitions/blockchain';
import { DfxHttpClient } from './DfxHttpClient';

export interface AssetListParams {
  blockchains?: Blockchain[];
  includePrivate?: boolean;
}

export class AssetApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(params?: AssetListParams): Promise<Asset[]> {
    const queryParts: string[] = [];
    if (params?.blockchains?.length) {
      queryParts.push(`blockchains=${params.blockchains.join(',')}`);
    }
    if (params?.includePrivate) {
      queryParts.push('includePrivate=true');
    }
    const query = queryParts.length ? `?${queryParts.join('&')}` : '';
    return this.http.request<Asset[]>({ url: `${AssetUrl.get}${query}`, method: 'GET', token: false });
  }
}
