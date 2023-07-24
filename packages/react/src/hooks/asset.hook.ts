import { useMemo } from 'react';
import { Asset, AssetUrl } from '../definitions/asset';
import { useApi } from './api.hook';

export interface AssetInterface {
  getAssets: () => Promise<Asset[]>;
  getAsset: (assets?: Asset[], identifier?: string) => Asset | undefined;
}

export function useAsset(): AssetInterface {
  const { call } = useApi();

  async function getAssets(): Promise<Asset[]> {
    return call<Asset[]>({ url: AssetUrl.get, method: 'GET' });
  }

  function getAsset(assets: Asset[] = [], identifier?: string): Asset | undefined {
    if (!identifier) return undefined;

    return (
      assets.find((a) => a.id === +identifier) ??
      assets.find((a) => a.uniqueName.toLowerCase() === identifier.toLowerCase()) ??
      assets.find((a) => a.name.toLowerCase() === identifier.toLowerCase())
    );
  }

  return useMemo(() => ({ getAssets, getAsset }), [call]);
}
