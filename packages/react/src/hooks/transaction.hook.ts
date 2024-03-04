import { useMemo } from 'react';
import { useApi } from './api.hook';
import { Transaction, TransactionUrl } from '../definitions/transaction';
import { useAuthContext } from '../contexts/auth.context';

export interface TransactionInterface {
  getTransactions: () => Promise<Transaction[]>;
}

export function useTransaction(): TransactionInterface {
  const { call } = useApi();
  const { session } = useAuthContext();

  async function getTransactions(): Promise<Transaction[]> {
    if (!session) throw new Error('No active session');

    return call<Transaction[]>({ url: `${TransactionUrl.get}?userAddress=${session.address}`, method: 'GET' });
  }

  return useMemo(
    () => ({
      getTransactions,
    }),
    [call],
  );
}
