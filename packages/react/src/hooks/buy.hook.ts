import { useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Buy, BuyUrl, BuyPaymentInfo } from '../definitions/buy';
import { Fiat } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface BuyInterface {
  receiveFor: (info: BuyPaymentInfo) => Promise<Buy>;
  currencies?: Fiat[];
}

export function useBuy(): BuyInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  async function receiveFor(info: BuyPaymentInfo): Promise<Buy> {
    return call<Buy>({ url: BuyUrl.receive, method: 'PUT', data: info });
  }

  return useMemo(
    () => ({ receiveFor, currencies: currencies?.filter((c) => c.sellable || c.cardSellable) }),
    [call, currencies],
  );
}
