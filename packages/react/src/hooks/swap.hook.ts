import { useCallback, useMemo, useRef } from 'react';
import { CallConfig, useApi } from './api.hook';
import { Swap, SwapPaymentInfo, SwapUrl, ConfirmSwapData } from '../definitions/swap';
import { useUser } from './user.hook';
import { useUserContext } from '../contexts/user.context';
import { ApiError } from '../definitions/error';
import { useSessionContext } from '../contexts/session.context';
import { Transaction } from '../definitions/transaction';

export interface SwapInterface {
  receiveFor: (info: SwapPaymentInfo, includeTx?: boolean) => Promise<Swap>;
  confirmSwap: (id: number, data: ConfirmSwapData) => Promise<Transaction>;
}

export function useSwap(): SwapInterface {
  const { call } = useApi();
  const { changeUserAddress } = useUser();
  const { user } = useUserContext();
  const { tokenStore } = useSessionContext();

  const receiveFor = useCallback(
    async (info: SwapPaymentInfo, includeTx = false): Promise<Swap> => {
      const url = includeTx ? `${SwapUrl.receive}?includeTx=true` : SwapUrl.receive;
      const request = { url, method: 'PUT', data: info } as CallConfig;
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
    },
    [call, changeUserAddress, tokenStore, user?.activeAddress?.address],
  );

  const confirmSwap = useCallback(
    async (id: number, data: ConfirmSwapData): Promise<Transaction> => {
      return call<Transaction>({ url: SwapUrl.confirm.replace(':id', id.toString()), method: 'POST', data });
    },
    [call],
  );

  return useMemo(() => ({ receiveFor, confirmSwap }), [receiveFor, confirmSwap]);
}
