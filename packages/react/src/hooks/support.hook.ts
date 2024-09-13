import { useMemo } from 'react';
import { useApi } from './api.hook';
import {
  CreateSupportMessage,
  CreateSupportIssue,
  SupportUrl,
  SupportIssue,
  SupportMessage,
  BlobContent,
} from '../definitions/support';

export interface SupportInterface {
  createIssue: (request: CreateSupportIssue) => Promise<SupportIssue>;
  createMessage: (issueId: string, message: CreateSupportMessage) => Promise<SupportMessage>;
  getIssue: (issueId: string, fromMessageId?: number) => Promise<SupportIssue>;
  fetchFileData: (issueId: string, messageId: number) => Promise<BlobContent>;
}

export function useSupportChat(): SupportInterface {
  const { call } = useApi();

  async function createIssue(request: CreateSupportIssue): Promise<SupportIssue> {
    return call<SupportIssue>({
      url: SupportUrl.createIssue,
      method: 'POST',
      data: request,
    });
  }

  async function getIssue(issueId: string, fromMessageId?: number): Promise<SupportIssue> {
    return call<SupportIssue>({
      url: SupportUrl.getIssue(issueId, fromMessageId),
      method: 'GET',
    });
  }

  async function createMessage(issueId: string, message: CreateSupportMessage): Promise<SupportMessage> {
    return call<SupportMessage>({
      url: SupportUrl.createMessage(issueId),
      method: 'POST',
      data: message,
    });
  }

  async function fetchFileData(issueId: string, messageId: number): Promise<BlobContent> {
    return call<BlobContent>({
      url: SupportUrl.fetchFileData(issueId, messageId),
      method: 'GET',
    });
  }

  return useMemo(() => ({ createIssue, createMessage, getIssue, fetchFileData }), [call]);
}
