import { useCallback, useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Blockchain } from '../definitions/blockchain';
import { Fiat } from '../definitions/fiat';
import { Sell, SellPaymentInfo, SellAddressCheck, SellUrl, ConfirmSellData } from '../definitions/sell';
import { Transaction } from '../definitions/transaction';
import { useApi } from './api.hook';

export interface SellInterface {
  receiveFor: (info: SellPaymentInfo, includeTx?: boolean) => Promise<Sell>;
  confirmSell: (id: number, data: ConfirmSellData) => Promise<Transaction>;
  checkAddress: (blockchain: Blockchain) => Promise<SellAddressCheck>;
  currencies?: Fiat[];
}

export function useSell(): SellInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  const receiveFor = useCallback(
    async (info: SellPaymentInfo, includeTx = false): Promise<Sell> => {
      const url = includeTx ? `${SellUrl.receive}?includeTx=true` : SellUrl.receive;
      return call<Sell>({ url, method: 'PUT', data: info });
    },
    [call],
  );

  const confirmSell = useCallback(
    async (id: number, data: ConfirmSellData): Promise<Transaction> => {
      return call<Transaction>({ url: SellUrl.confirm(id), method: 'PUT', data });
    },
    [call],
  );

  const checkAddress = useCallback(
    async (blockchain: Blockchain): Promise<SellAddressCheck> => {
      return call<SellAddressCheck>({
        url: `${SellUrl.addressCheck}?blockchain=${encodeURIComponent(blockchain)}`,
        method: 'GET',
      });
    },
    [call],
  );

  return useMemo(
    () => ({
      receiveFor,
      confirmSell,
      checkAddress,
      currencies: currencies?.filter((c) => c.buyable || c.cardBuyable || c.instantBuyable),
    }),
    [receiveFor, confirmSell, checkAddress, currencies],
  );
}
