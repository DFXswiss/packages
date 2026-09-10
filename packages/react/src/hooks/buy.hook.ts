import { useCallback, useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Buy, BuyUrl, BuyPaymentInfo, PdfDocument, VirtualIban } from '../definitions/buy';
import { Fiat } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface BuyInterface {
  receiveFor: (info: BuyPaymentInfo) => Promise<Buy>;
  getPersonalIbans: () => Promise<VirtualIban[]>;
  invoiceFor: (txId: number, collectionAccount?: boolean) => Promise<PdfDocument>;
  confirmFor: (txId: number) => Promise<void>;
  currencies?: Fiat[];
}

export function useBuy(): BuyInterface {
  const { call } = useApi();
  const { currencies } = useFiatContext();

  const receiveFor = useCallback(
    async (info: BuyPaymentInfo): Promise<Buy> => {
      return call<Buy>({ url: BuyUrl.receive, method: 'PUT', data: info });
    },
    [call],
  );

  const getPersonalIbans = useCallback(async (): Promise<VirtualIban[]> => {
    return call<VirtualIban[]>({ url: BuyUrl.personalIban, method: 'GET' });
  }, [call]);

  const invoiceFor = useCallback(
    async (txId: number, collectionAccount?: boolean): Promise<PdfDocument> =>
      call<PdfDocument>({
        url: collectionAccount ? `${BuyUrl.invoice(txId)}?collectionAccount=true` : BuyUrl.invoice(txId),
        method: 'PUT',
      }),
    [call],
  );

  const confirmFor = useCallback(
    async (txId: number): Promise<void> => {
      return call<void>({ url: BuyUrl.confirm(txId), method: 'PUT' });
    },
    [call],
  );

  return useMemo(
    () => ({
      receiveFor,
      getPersonalIbans,
      invoiceFor,
      confirmFor,
      currencies: currencies?.filter((c) => c.sellable || c.cardSellable || c.instantSellable),
    }),
    [receiveFor, getPersonalIbans, invoiceFor, confirmFor, currencies],
  );
}
