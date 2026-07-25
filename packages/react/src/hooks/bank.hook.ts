import { useMemo } from 'react';
import { Bank, BankUrl, ReceiveIbanCheck } from '../definitions/bank';
import { useApi } from './api.hook';

export interface BankInterface {
  getBanks: () => Promise<Bank[]>;
  checkReceiveIban: (iban: string) => Promise<ReceiveIbanCheck>;
}

export function useBank(): BankInterface {
  const { call } = useApi();

  async function getBanks(): Promise<Bank[]> {
    return call<Bank[]>({
      url: BankUrl.get,
      method: 'GET',
    });
  }

  async function checkReceiveIban(iban: string): Promise<ReceiveIbanCheck> {
    return call<ReceiveIbanCheck>({
      url: BankUrl.receiveIban,
      method: 'PUT',
      data: { iban },
    });
  }

  return useMemo(() => ({ getBanks, checkReceiveIban }), [call]);
}
