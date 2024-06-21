import { useMemo } from 'react';
import { useApi } from './api.hook';
import {
  DetailTransaction,
  Transaction,
  TransactionTarget,
  TransactionUrl,
  UnassignedTransaction,
} from '../definitions/transaction';
import { useAuthContext } from '../contexts/auth.context';

export interface TransactionInterface {
  getTransactions: () => Promise<Transaction[]>;
  getDetailTransactions: (from?: Date, to?: Date) => Promise<DetailTransaction[]>;
  getTransactionByUid: (uid: string) => Promise<Transaction>;
  getTransactionByCkoId: (ckoId: string) => Promise<Transaction>;
  getTransactionByRequestId: (requestId: string) => Promise<Transaction>;
  getTransactionCsv: (from?: Date, to?: Date) => Promise<string>;
  getUnassignedTransactions: () => Promise<UnassignedTransaction[]>;
  getTransactionTargets: () => Promise<TransactionTarget[]>;
  setTransactionTarget: (transactionId: number, buyId: number) => Promise<void>;
}

export function useTransaction(): TransactionInterface {
  const { defaultUrl, call } = useApi();
  const { session } = useAuthContext();

  async function getTransactions(): Promise<Transaction[]> {
    if (!session) throw new Error('No active session');

    return call<Transaction[]>({ url: `${TransactionUrl.get}?userAddress=${session.address}`, method: 'GET' });
  }

  async function getDetailTransactions(from?: Date, to?: Date): Promise<DetailTransaction[]> {
    return call<Transaction[]>({
      url: `${TransactionUrl.detail}?${createFilterParams(from, to)}`,
      method: 'GET',
    });
  }

  async function getTransactionByUid(uid: string): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?uid=${uid}`, method: 'GET' });
  }

  async function getTransactionByCkoId(ckoId: string): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?cko-id=${ckoId}`, method: 'GET' });
  }

  async function getTransactionByRequestId(requestId: string): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?request-id=${requestId}`, method: 'GET' });
  }

  async function getTransactionCsv(from?: Date, to?: Date): Promise<string> {
    return call<string>({
      url: `${TransactionUrl.csv}?${createFilterParams(from, to)}`,
      method: 'PUT',
    }).then((key) => `${defaultUrl}/transaction/csv?key=${key}`);
  }

  async function getUnassignedTransactions(): Promise<UnassignedTransaction[]> {
    return call<Transaction[]>({ url: `${TransactionUrl.unassigned}`, method: 'GET' });
  }

  async function getTransactionTargets(): Promise<TransactionTarget[]> {
    return call<TransactionTarget[]>({ url: `${TransactionUrl.target}`, method: 'GET' });
  }

  async function setTransactionTarget(transactionId: number, buyId: number): Promise<void> {
    return call({ url: `${TransactionUrl.setTarget(transactionId)}?buyId=${buyId}`, method: 'PUT' });
  }

  return useMemo(
    () => ({
      getTransactions,
      getDetailTransactions,
      getTransactionByUid,
      getTransactionByCkoId,
      getTransactionByRequestId,
      getTransactionCsv,
      getUnassignedTransactions,
      getTransactionTargets,
      setTransactionTarget,
    }),
    [call],
  );

  function createFilterParams(from?: Date, to?: Date): string {
    const params = new URLSearchParams();

    from && params.append('from', from.toISOString());
    to && params.append('to', to.toISOString());

    return params.toString();
  }
}
