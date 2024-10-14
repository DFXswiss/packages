import { useMemo } from 'react';
import { Asset, AssetUrl } from '../definitions/asset';
import { useApi } from './api.hook';
import { Blockchain } from '../definitions/blockchain';

export interface AssetInterface {
  getAssets: (blockchains: Blockchain[], includePrivate: boolean) => Promise<Asset[]>;
  getAsset: (assets?: Asset[], identifier?: string) => Asset | undefined;
  isSameAsset: (asset: Asset, identifier: string) => boolean;
}

export function useAsset(): AssetInterface {
  const { call } = useApi();

  async function getAssets(blockchains: Blockchain[], includePrivate: boolean): Promise<Asset[]> {
    return call<Asset[]>({
      url: `${AssetUrl.get}?blockchains=${blockchains.join(',')}&includePrivate=${includePrivate}`,
      method: 'GET',
    });
  }

  function getAsset(assets: Asset[] = [], identifier?: string): Asset | undefined {
    if (!identifier) return undefined;

    return assets.find((a) => isSameAsset(a, identifier));
  }

  function isSameAsset(asset: Asset, identifier: string): boolean {
    return (
      asset.id === +identifier ||
      asset.uniqueName.toLowerCase() === identifier.toLowerCase() ||
      asset.name.toLowerCase() === identifier.toLowerCase() ||
      asset.chainId?.toLowerCase() === identifier.toLowerCase()
    );
  }

  return useMemo(() => ({ getAssets, getAsset, isSameAsset }), [call]);
}
