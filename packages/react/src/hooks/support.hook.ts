import { useMemo } from 'react';
import { useApi } from './api.hook';
import { CreateSupportMessage, CreateTransactionIssue, SupportUrl } from '../definitions/support';

export interface SupportInterface {
  createTransactionIssue: (transactionId: number, issue: CreateTransactionIssue) => Promise<void>;
  createMessage: (issueId: number, message: CreateSupportMessage) => Promise<void>;
}

export function useSupport(): SupportInterface {
  const { call } = useApi();

  async function createTransactionIssue(transactionId: number, issue: CreateTransactionIssue): Promise<void> {
    return call({ url: SupportUrl.createTransactionIssue(transactionId), method: 'POST', data: issue });
  }

  async function createMessage(issueId: number, message: CreateSupportMessage): Promise<void> {
    return call({ url: SupportUrl.createMessage(issueId), method: 'POST', data: message });
  }

  return useMemo(() => ({ createTransactionIssue, createMessage }), [call]);
}
