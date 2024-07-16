import { useMemo, useRef } from 'react';
import { CallConfig, useApi } from './api.hook';
import { Swap, SwapPaymentInfo, SwapUrl } from '../definitions/swap';
import { useUser } from './user.hook';
import { useUserContext } from '../contexts/user.context';
import { ApiError } from '../definitions/error';
import { useSessionContext } from '../contexts/session.context';

export interface SwapInterface {
  receiveFor: (info: SwapPaymentInfo) => Promise<Swap>;
}

export function useSwap(): SwapInterface {
  const { call } = useApi();
  const { changeUserAddress } = useUser();
  const { user } = useUserContext();
  const { tokenStore } = useSessionContext();

  async function receiveFor(info: SwapPaymentInfo): Promise<Swap> {
    const request = { url: SwapUrl.receive, method: 'PUT', data: info } as CallConfig;
    const { receiverAddress } = info;

    if (receiverAddress && user?.activeAddress?.address !== receiverAddress) {
      let token = tokenStore.get(receiverAddress);
      if (!token) {
        token = (await changeUserAddress(receiverAddress)).accessToken;
        tokenStore.set(receiverAddress, token);
      }
      return call<Swap>({ ...request, token }).catch((error: ApiError) => {
        if (error.statusCode === 401) {
          tokenStore.set(receiverAddress, null);
        }
        throw error;
      });
    } else {
      return call<Swap>(request);
    }
  }

  return useMemo(() => ({ receiveFor }), [call, tokenStore, user?.activeAddress?.address]);
}
