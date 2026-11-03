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
        // The session token goes out only with an explicit chain filter. Without one, the list stays
        // anonymous, so jwt.blockchains cannot narrow it.
        token: blockchains?.length && includePrivate ? undefined : false,
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
