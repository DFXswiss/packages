import { useMemo } from 'react';
import { useFiatContext } from '../contexts/fiat.context';
import { Fiat } from '../definitions/fiat';
import { useApi } from './api.hook';
import { CreateTransactionIssue, SupportUrl } from '../definitions/support';

export interface SupportInterface {
  createTransactionIssue: (issue: CreateTransactionIssue) => Promise<void>;
}

export function useSupport(): SupportInterface {
  const { call } = useApi();

  async function createTransactionIssue(issue: CreateTransactionIssue): Promise<void> {
    return call({ url: SupportUrl.createTransactionIssue, method: 'POST', data: issue });
  }

  return useMemo(() => ({ createTransactionIssue }), [call]);
}
