import { useCallback, useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Fiat } from '../definitions/fiat';
import { Sell, SellPaymentInfo, SellUrl, ConfirmSellData } from '../definitions/sell';
import { Transaction } from '../definitions/transaction';
import { useApi } from './api.hook';

export interface SellInterface {
  receiveFor: (info: SellPaymentInfo) => Promise<Sell>;
  confirmSell: (id: number, data: ConfirmSellData) => Promise<Transaction>;
  currencies?: Fiat[];
}

export function useSell(): SellInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  const receiveFor = useCallback(
    async (info: SellPaymentInfo): Promise<Sell> => {
      return call<Sell>({ url: `${SellUrl.receive}?includeTx=true`, method: 'PUT', data: info });
    },
    [call],
  );

  const confirmSell = useCallback(
    async (id: number, data: ConfirmSellData): Promise<Transaction> => {
      return call<Transaction>({ url: SellUrl.confirm.replace(':id', id.toString()), method: 'PUT', data });
    },
    [call],
  );

  return useMemo(
    () => ({ receiveFor, confirmSell, currencies: currencies?.filter((c) => c.buyable || c.cardBuyable || c.instantBuyable) }),
    [receiveFor, confirmSell, currencies],
  );
}
