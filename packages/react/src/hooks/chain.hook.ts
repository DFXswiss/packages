import { useCallback, useMemo } from 'react';
import { ChainInfo, ChainUrl } from '@dfx.swiss/core';
import { useApi } from './api.hook';

/** Public chain classification of the wallet data capability (D23). */
export function useChainApi(): { list: () => Promise<ChainInfo[]> } {
  const { call } = useApi();

  const list = useCallback(
    () => call<ChainInfo[]>({ url: ChainUrl.classification, method: 'GET', token: false }),
    [call],
  );

  return useMemo(() => ({ list }), [list]);
}
