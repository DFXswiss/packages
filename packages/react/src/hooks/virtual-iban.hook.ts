import { useCallback, useMemo } from 'react';
import { BuyUrl, CreateVirtualIban, VirtualIban } from '../definitions/buy';
import { useApi } from './api.hook';

export interface VirtualIbanInterface {
  /** Personal IBANs of the authenticated account, across all currencies. */
  getPersonalIbans: () => Promise<VirtualIban[]>;
  /**
   * Issues a personal IBAN for the authenticated account.
   *
   * Rejections - an insufficient KYC level, an unsupported currency - arrive as an ApiException,
   * never as a VirtualIban.
   */
  createPersonalIban: (data: CreateVirtualIban) => Promise<VirtualIban>;
}

export function useVirtualIban(): VirtualIbanInterface {
  const { call } = useApi();

  const getPersonalIbans = useCallback(async (): Promise<VirtualIban[]> => {
    return call<VirtualIban[]>({ url: BuyUrl.personalIban, method: 'GET' });
  }, [call]);

  const createPersonalIban = useCallback(
    async (data: CreateVirtualIban): Promise<VirtualIban> => {
      return call<VirtualIban>({ url: BuyUrl.personalIban, method: 'POST', data });
    },
    [call],
  );

  return useMemo(() => ({ getPersonalIbans, createPersonalIban }), [getPersonalIbans, createPersonalIban]);
}
