import { useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Buy, BuyUrl, BuyPaymentInfo, Invoice } from '../definitions/buy';
import { Fiat } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface BuyInterface {
  receiveFor: (info: BuyPaymentInfo) => Promise<Buy>;
  invoiceFor: (txId: number) => Promise<Invoice>;
  currencies?: Fiat[];
}

export function useBuy(): BuyInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  async function receiveFor(info: BuyPaymentInfo): Promise<Buy> {
    return call<Buy>({ url: BuyUrl.receive, method: 'PUT', data: info });
  }

  async function invoiceFor(txId: number): Promise<Invoice> {
    return call<Invoice>({ url: BuyUrl.invoice(txId), method: 'PUT' });
  }

  return useMemo(
    () => ({
      receiveFor,
      invoiceFor,
      currencies: currencies?.filter((c) => c.sellable || c.cardSellable || c.instantSellable),
    }),
    [call, currencies],
  );
}
