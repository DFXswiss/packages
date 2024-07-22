import { useMemo } from 'react';
import { useApi } from './api.hook';
import { PaymentRoutesDto, PaymentRoutesUrl } from '../definitions/route';

export interface PaymentRoutesInterface {
  getPaymentRoutes: () => Promise<PaymentRoutesDto>;
}

export function usePaymentRoutes(): PaymentRoutesInterface {
  const { call } = useApi();

  async function getPaymentRoutes(): Promise<PaymentRoutesDto> {
    return call<PaymentRoutesDto>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }

  return useMemo(() => ({ getPaymentRoutes }), [call]);
}
