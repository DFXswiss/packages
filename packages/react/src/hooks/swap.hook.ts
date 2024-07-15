import { useMemo, useRef } from 'react';
import { CallConfig, useApi } from './api.hook';
import { Swap, SwapPaymentInfo, SwapUrl } from '../definitions/swap';
import { useUser } from './user.hook';
import { useUserContext } from '../contexts/user.context';

export interface SwapInterface {
  receiveFor: (info: SwapPaymentInfo) => Promise<Swap>;
}

export function useSwap(): SwapInterface {
  const { call } = useApi();
  const { changeUserAddress } = useUser();
  const { user } = useUserContext();

  const accessToken = useRef<string | undefined>();

  async function receiveFor(info: SwapPaymentInfo): Promise<Swap> {
    const request = { url: SwapUrl.receive, method: 'PUT', data: info } as CallConfig;
    if (info.receiverAddress && user?.activeAddress?.address !== info.receiverAddress) {
      accessToken.current ??= (await changeUserAddress(info.receiverAddress)).accessToken;
      return call<Swap>({ ...request, headers: { Authorization: `Bearer ${accessToken.current}` } });
    } else {
      return call<Swap>(request);
    }
  }

  return useMemo(() => ({ receiveFor }), [call]);
}
