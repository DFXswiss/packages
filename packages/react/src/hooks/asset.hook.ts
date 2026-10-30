import { useCallback, useMemo } from 'react';
import { Asset, AssetUrl } from '../definitions/asset';
import { useApi } from './api.hook';
import { Blockchain } from '../definitions/blockchain';

export interface AssetInterface {
  getAssets: (blockchains?: Blockchain[], includePrivate?: boolean) => Promise<Asset[]>;
  getAsset: (assets?: Asset[], identifier?: string) => Asset | undefined;
  isSameAsset: (asset: Asset, identifier: string) => boolean;
}

export function useAsset(): AssetInterface {
  const { call } = useApi();

  const isSameAsset = useCallback((asset: Asset, identifier: string): boolean => {
    return (
      asset.id === +identifier ||
      asset.uniqueName.toLowerCase() === identifier.toLowerCase() ||
      asset.name.toLowerCase() === identifier.toLowerCase() ||
      asset.chainId?.toLowerCase() === identifier.toLowerCase()
    );
  }, []);

  const getAssets = useCallback(
    async (blockchains?: Blockchain[], includePrivate = false): Promise<Asset[]> => {
      const chainQuery = blockchains?.length ? `blockchains=${blockchains.join(',')}&` : '';
      return call<Asset[]>({
        url: `${AssetUrl.get}?${chainQuery}includePrivate=${includePrivate}`,
        method: 'GET',
        // Without a chain filter the request is the public asset list (no JWT, no jwt.blockchains fallback).
        token: includePrivate ? undefined : false,
      });
    },
    [call],
  );

  const getAsset = useCallback(
    (assets: Asset[] = [], identifier?: string): Asset | undefined => {
      if (!identifier) return undefined;

      return assets.find((a) => isSameAsset(a, identifier));
    },
    [isSameAsset],
  );

  return useMemo(() => ({ getAssets, getAsset, isSameAsset }), [getAssets, getAsset, isSameAsset]);
}
