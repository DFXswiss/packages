import { useMemo } from 'react';
import { useApi } from './api.hook';
import { CreateSupportMessage, CreateSupportIssue, SupportUrl } from '../definitions/support';

export interface SupportInterface {
  createIssue: (issue: CreateSupportIssue) => Promise<void>;
  createMessage: (issueId: number, message: CreateSupportMessage) => Promise<void>;
}

export function useSupport(): SupportInterface {
  const { call } = useApi();

  async function createIssue(issue: CreateSupportIssue): Promise<void> {
    return call({ url: SupportUrl.createGeneralIssue, method: 'POST', data: issue });
  }

  async function createMessage(issueId: number, message: CreateSupportMessage): Promise<void> {
    return call({ url: SupportUrl.createMessage(issueId), method: 'POST', data: message });
  }

  return useMemo(() => ({ createIssue, createMessage }), [call]);
}
