import { useMemo } from 'react';
import { Bank, BankUrl, ReceiveIbanCheck } from '../definitions/bank';
import { useApi } from './api.hook';

export interface BankInterface {
  getBanks: () => Promise<Bank[]>;
  /**
   * Check whether an IBAN is a DFX receiver IBAN.
   *
   * There is no abort signal, so a call can neither be cancelled nor superseded. When driving this from a text
   * field, debounce the input, track the most recent request and discard responses that do not belong to it - a
   * slow answer for a prefix can otherwise overwrite a fast answer for the full IBAN.
   *
   * HTTP failures never arrive as a ReceiveIbanStatus. When the call rejects, it rejects with an ApiException -
   * treat that as "could not check", never as a negative result about the IBAN.
   */
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
