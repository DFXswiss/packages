import { useMemo } from 'react';
import { useApi } from './api.hook';
import {
  DetailTransaction,
  ExportType,
  Transaction,
  TransactionHistoryQuery,
  TransactionRefundData,
  TransactionRefundTarget,
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
  getTransactionByRequestId: (requestId: number) => Promise<Transaction>;
  getTransactionCsv: (from?: Date, to?: Date) => Promise<string>;
  getTransactionHistory: (type: ExportType, queryParams: TransactionHistoryQuery) => Promise<string>;
  getUnassignedTransactions: () => Promise<UnassignedTransaction[]>;
  getTransactionTargets: () => Promise<TransactionTarget[]>;
  setTransactionTarget: (transactionId: number, buyId: number) => Promise<void>;
  getTransactionRefund: (id: number) => Promise<TransactionRefundData>;
  setTransactionRefundTarget: (id: number, target: TransactionRefundTarget) => Promise<void>;
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
      url: `${TransactionUrl.detail}?${createFilterParams({ from, to })}`,
      method: 'GET',
    });
  }

  async function getTransactionByUid(uid: string): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?uid=${uid}`, method: 'GET' });
  }

  async function getTransactionByCkoId(ckoId: string): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?cko-id=${ckoId}`, method: 'GET' });
  }

  async function getTransactionByRequestId(requestId: number): Promise<Transaction> {
    return call<Transaction>({ url: `${TransactionUrl.single}?request-id=${requestId}`, method: 'GET' });
  }

  async function getTransactionCsv(from?: Date, to?: Date): Promise<string> {
    return call<string>({
      url: `${TransactionUrl.csv}?${createFilterParams({ from, to })}`,
      method: 'PUT',
    }).then((key) => `${defaultUrl}/transaction/csv?key=${key}`);
  }

  async function getTransactionHistory(type: ExportType, queryParams: TransactionHistoryQuery): Promise<string> {
    if (!queryParams.userAddress) throw new Error('No user address provided');

    return call<string>({
      url: `transaction/${type}?${createFilterParams(queryParams)}`,
      method: 'GET',
      noJson: true,
    });
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

  async function getTransactionRefund(id: number): Promise<TransactionRefundData> {
    return call<TransactionRefundData>({ url: `${TransactionUrl.refund(id)}`, method: 'GET' });
  }

  async function setTransactionRefundTarget(id: number, target: TransactionRefundTarget): Promise<void> {
    return call<void>({ url: `${TransactionUrl.refund(id)}`, method: 'PUT', data: target });
  }

  return useMemo(
    () => ({
      getTransactions,
      getDetailTransactions,
      getTransactionByUid,
      getTransactionByCkoId,
      getTransactionByRequestId,
      getTransactionCsv,
      getTransactionHistory,
      getUnassignedTransactions,
      getTransactionTargets,
      setTransactionTarget,
      getTransactionRefund,
      setTransactionRefundTarget,
    }),
    [call],
  );

  // --- HELPER FUNCTIONS --- //

  function createFilterParams(query: TransactionHistoryQuery): string {
    const params = new URLSearchParams();

    query.from && params.append('from', query.from.toISOString());
    query.to && params.append('to', query.to.toISOString());
    query.format && params.append('format', query.format);
    query.userAddress && params.append('userAddress', query.userAddress);

    ['buy', 'sell', 'staking', 'ref', 'lm'].forEach((key) => {
      const value = query[key as keyof TransactionHistoryQuery];
      if (typeof value === 'boolean') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }
}
