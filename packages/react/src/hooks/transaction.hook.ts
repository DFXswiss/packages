import { useMemo } from 'react';
import { useApi } from './api.hook';
import { DetailTransaction, Transaction, TransactionUrl, UnassignedTransaction } from '../definitions/transaction';
import { useAuthContext } from '../contexts/auth.context';

export interface TransactionInterface {
  getTransactions: () => Promise<Transaction[]>;
  getDetailTransactions: (from?: Date, to?: Date) => Promise<DetailTransaction[]>;
  getUnassignedTransactions: () => Promise<UnassignedTransaction[]>;
}

export function useTransaction(): TransactionInterface {
  const { call } = useApi();
  const { session } = useAuthContext();

  async function getTransactions(): Promise<Transaction[]> {
    if (!session) throw new Error('No active session');

    return call<Transaction[]>({ url: `${TransactionUrl.get}?userAddress=${session.address}`, method: 'GET' });
  }

  async function getDetailTransactions(from?: Date, to?: Date): Promise<DetailTransaction[]> {
    const params = new URLSearchParams();
    from && params.append('from', from.toISOString());
    to && params.append('to', to.toISOString());

    return call<Transaction[]>({ url: `${TransactionUrl.detail}?${params.toString()}`, method: 'GET' });
  }

  async function getUnassignedTransactions(): Promise<UnassignedTransaction[]> {
    return call<Transaction[]>({ url: `${TransactionUrl.unassigned}`, method: 'GET' });
  }

  return useMemo(
    () => ({
      getTransactions,
      getDetailTransactions,
      getUnassignedTransactions,
    }),
    [call],
  );
}
