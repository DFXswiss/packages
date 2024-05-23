import { useMemo } from 'react';
import { useApi } from './api.hook';
import { CreateSupportMessage, CreateSupportIssue, SupportUrl } from '../definitions/support';

export interface SupportInterface {
  createGeneralIssue: (issue: CreateSupportIssue) => Promise<void>;
  createTransactionIssue: (transactionId: number, issue: CreateSupportIssue) => Promise<void>;
  createMessage: (issueId: number, message: CreateSupportMessage) => Promise<void>;
}

export function useSupport(): SupportInterface {
  const { call } = useApi();

  async function createGeneralIssue(issue: CreateSupportIssue): Promise<void> {
    return call({ url: SupportUrl.createGeneralIssue, method: 'POST', data: issue });
  }

  async function createTransactionIssue(transactionId: number, issue: CreateSupportIssue): Promise<void> {
    return call({ url: SupportUrl.createTransactionIssue(transactionId), method: 'POST', data: issue });
  }

  async function createMessage(issueId: number, message: CreateSupportMessage): Promise<void> {
    return call({ url: SupportUrl.createMessage(issueId), method: 'POST', data: message });
  }

  return useMemo(() => ({ createGeneralIssue, createTransactionIssue, createMessage }), [call]);
}
