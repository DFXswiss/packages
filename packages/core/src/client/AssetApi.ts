import { Asset, AssetUrl } from '../definitions/asset';
import { Blockchain } from '../definitions/blockchain';
import { Utils } from '../utils';
import { DfxHttpClient } from './DfxHttpClient';

export interface AssetListParams {
  blockchains?: Blockchain[];
  includePrivate?: boolean;
}

export class AssetApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(params?: AssetListParams): Promise<Asset[]> {
    const query = Utils.buildQuery({
      blockchains: params?.blockchains,
      includePrivate: params?.includePrivate || undefined,
    });
    return this.http.request<Asset[]>({ url: `${AssetUrl.get}${query}`, method: 'GET', token: false });
  }
}
