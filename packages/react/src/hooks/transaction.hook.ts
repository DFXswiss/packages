import { useCallback, useMemo } from 'react';
import { ResponseType, useApi } from './api.hook';
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
import { PdfDocument } from '../definitions/buy';

export interface TransactionInterface {
  getTransactions: () => Promise<Transaction[]>;
  getDetailTransactions: (from?: Date, to?: Date) => Promise<DetailTransaction[]>;
  getTransactionByUid: (uid: string) => Promise<Transaction>;
  getTransactionByCkoId: (ckoId: string) => Promise<Transaction>;
  getTransactionByRequestId: (requestId: number) => Promise<Transaction>;
  getTransactionCsv: (from?: Date, to?: Date) => Promise<string>;
  getTransactionInvoice: (id: number | string) => Promise<PdfDocument>;
  getTransactionReceipt: (id: number) => Promise<PdfDocument>;
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

  // --- HELPER FUNCTIONS --- //
  const createFilterParams = useCallback((query: TransactionHistoryQuery): string => {
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
  }, []);

  const getTransactions = useCallback(async (): Promise<Transaction[]> => {
    if (!session) throw new Error('No active session');

    return call<Transaction[]>({ url: `${TransactionUrl.get}?userAddress=${session.address}`, method: 'GET' });
  }, [call, session]);

  const getDetailTransactions = useCallback(
    async (from?: Date, to?: Date): Promise<DetailTransaction[]> => {
      return call<Transaction[]>({
        url: `${TransactionUrl.detail}?${createFilterParams({ from, to })}`,
        method: 'GET',
      });
    },
    [call, createFilterParams],
  );

  const getTransactionByUid = useCallback(
    async (uid: string): Promise<Transaction> => {
      return call<Transaction>({ url: `${TransactionUrl.single}?uid=${uid}`, method: 'GET' });
    },
    [call],
  );

  const getTransactionByCkoId = useCallback(
    async (ckoId: string): Promise<Transaction> => {
      return call<Transaction>({ url: `${TransactionUrl.single}?cko-id=${ckoId}`, method: 'GET' });
    },
    [call],
  );

  const getTransactionByRequestId = useCallback(
    async (requestId: number): Promise<Transaction> => {
      return call<Transaction>({ url: `${TransactionUrl.single}?request-id=${requestId}`, method: 'GET' });
    },
    [call],
  );

  const getTransactionCsv = useCallback(
    async (from?: Date, to?: Date): Promise<string> => {
      return call<string>({
        url: `${TransactionUrl.csv}?${createFilterParams({ from, to })}`,
        method: 'PUT',
        responseType: ResponseType.TEXT,
      }).then((key) => `${defaultUrl}/transaction/csv?key=${key}`);
    },
    [call, createFilterParams, defaultUrl],
  );

  const getTransactionInvoice = useCallback(
    async (id: number | string): Promise<PdfDocument> => {
      return call<PdfDocument>({
        url: `${TransactionUrl.invoice(id)}`,
        method: 'PUT',
      });
    },
    [call],
  );

  const getTransactionReceipt = useCallback(
    async (id: number): Promise<PdfDocument> => {
      return call<PdfDocument>({
        url: `${TransactionUrl.receipt(id)}`,
        method: 'PUT',
      });
    },
    [call],
  );

  const getTransactionHistory = useCallback(
    async (type: ExportType, queryParams: TransactionHistoryQuery): Promise<string> => {
      if (!queryParams.userAddress) throw new Error('No user address provided');

      return call<string>({
        url: `transaction/${type}?${createFilterParams(queryParams)}`,
        method: 'GET',
        responseType: ResponseType.TEXT,
      });
    },
    [call, createFilterParams],
  );

  const getUnassignedTransactions = useCallback(async (): Promise<UnassignedTransaction[]> => {
    return call<Transaction[]>({ url: `${TransactionUrl.unassigned}`, method: 'GET' });
  }, [call]);

  const getTransactionTargets = useCallback(async (): Promise<TransactionTarget[]> => {
    return call<TransactionTarget[]>({ url: `${TransactionUrl.target}`, method: 'GET' });
  }, [call]);

  const setTransactionTarget = useCallback(
    async (transactionId: number, buyId: number): Promise<void> => {
      return call({ url: `${TransactionUrl.setTarget(transactionId)}?buyId=${buyId}`, method: 'PUT' });
    },
    [call],
  );

  const getTransactionRefund = useCallback(
    async (id: number): Promise<TransactionRefundData> => {
      return call<TransactionRefundData>({ url: `${TransactionUrl.refund(id)}`, method: 'GET' });
    },
    [call],
  );

  const setTransactionRefundTarget = useCallback(
    async (id: number, target: TransactionRefundTarget): Promise<void> => {
      return call<void>({ url: `${TransactionUrl.refund(id)}`, method: 'PUT', data: target });
    },
    [call],
  );

  return useMemo(
    () => ({
      getTransactions,
      getDetailTransactions,
      getTransactionByUid,
      getTransactionByCkoId,
      getTransactionByRequestId,
      getTransactionCsv,
      getTransactionInvoice,
      getTransactionReceipt,
      getTransactionHistory,
      getUnassignedTransactions,
      getTransactionTargets,
      setTransactionTarget,
      getTransactionRefund,
      setTransactionRefundTarget,
    }),
    [
      getTransactions,
      getDetailTransactions,
      getTransactionByUid,
      getTransactionByCkoId,
      getTransactionByRequestId,
      getTransactionCsv,
      getTransactionInvoice,
      getTransactionReceipt,
      getTransactionHistory,
      getUnassignedTransactions,
      getTransactionTargets,
      setTransactionTarget,
      getTransactionRefund,
      setTransactionRefundTarget,
    ],
  );
}
