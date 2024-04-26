import { useMemo } from 'react';
import { useApi } from './api.hook';
import { CreateTransactionIssue, SupportUrl } from '../definitions/support';

export interface SupportInterface {
  createTransactionIssue: (transactionId: number, issue: CreateTransactionIssue) => Promise<void>;
}

export function useSupport(): SupportInterface {
  const { call } = useApi();

  async function createTransactionIssue(transactionId: number, issue: CreateTransactionIssue): Promise<void> {
    return call({ url: SupportUrl.createTransactionIssue(transactionId), method: 'POST', data: issue });
  }

  return useMemo(() => ({ createTransactionIssue }), [call]);
}
