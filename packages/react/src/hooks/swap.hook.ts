import { useMemo } from 'react';
import { useApi } from './api.hook';
import { Swap, SwapPaymentInfo, SwapUrl } from '../definitions/swap';

export interface SwapInterface {
  receiveFor: (info: SwapPaymentInfo) => Promise<Swap>;
}

export function useSwap(): SwapInterface {
  const { call } = useApi();

  async function receiveFor(info: SwapPaymentInfo): Promise<Swap> {
    return call<Swap>({ url: SwapUrl.receive, method: 'PUT', data: info });
  }

  return useMemo(() => ({ receiveFor }), [call]);
}
