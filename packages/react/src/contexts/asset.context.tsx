import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Asset } from '../definitions/asset';
import { Blockchain } from '../definitions/blockchain';
import { useAsset } from '../hooks/asset.hook';
import { Utils } from '../utils';
import { useApiSession } from '../hooks/api-session.hook';

interface AssetInterface {
  assets: Map<Blockchain, Asset[]>;
  assetsLoading: boolean;
  getAssets: (
    blockchains: Blockchain[],
    filter?: { buyable?: boolean; sellable?: boolean; comingSoon?: boolean },
  ) => Asset[];
}

const AssetContext = createContext<AssetInterface>(undefined as any);

export function useAssetContext(): AssetInterface {
  return useContext(AssetContext);
}

export function AssetContextProvider(props: PropsWithChildren): JSX.Element {
  const { session } = useApiSession();
  const { getAssets: getApiAssets } = useAsset();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAssetsLoading(true);
    getApiAssets()
      .then(updateAssets)
      .finally(() => setAssetsLoading(false));
  }, [session]);

  function updateAssets(assets: Asset[]) {
    setAssets(
      assets
        .filter((a) => a.buyable || a.sellable || a.comingSoon)
        .sort((a, b) => (a.sortOrder ?? 1) - (b.sortOrder ?? 1)),
    );
  }

  function getAssets(
    blockchains: Blockchain[],
    filter?: { buyable?: boolean; sellable?: boolean; comingSoon?: boolean },
  ) {
    return assets
      .filter((a) => blockchains.includes(a.blockchain))
      .filter(
        (a) =>
          filter == null ||
          ((filter.buyable == null || filter.buyable === a.buyable) &&
            (filter.sellable == null || filter.sellable === a.sellable) &&
            (filter.comingSoon == null || filter.comingSoon === a.comingSoon)),
      );
  }

  const context: AssetInterface = useMemo(
    () => ({
      assets: Utils.groupBy(assets, 'blockchain'),
      assetsLoading,
      getAssets,
    }),
    [assets, assetsLoading, getApiAssets],
  );

  return <AssetContext.Provider value={context}>{props.children}</AssetContext.Provider>;
}
