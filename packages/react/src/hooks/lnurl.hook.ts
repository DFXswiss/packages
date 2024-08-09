import { useMemo } from 'react';
import { useApi } from './api.hook';
import { PaymentLinkPayRequest, LnUrlUrl } from '../definitions/lnurl';

export interface LnUrlInterface {
  getLnUrlPayment: (id: string) => Promise<PaymentLinkPayRequest>;
}

export function useLnUrl(): LnUrlInterface {
  const { call } = useApi();

  async function getLnUrlPayment(id: string): Promise<PaymentLinkPayRequest> {
    return call<PaymentLinkPayRequest>({
      url: `${LnUrlUrl.get}/${id}`,
      method: 'GET',
    });
  }

  return useMemo(
    () => ({
      getLnUrlPayment,
    }),
    [call],
  );
}
