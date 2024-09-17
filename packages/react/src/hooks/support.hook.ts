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
  createMessage: (issueUid: string, message: CreateSupportMessage) => Promise<SupportMessage>;
  getIssue: (issueUid: string, fromMessageId?: number) => Promise<SupportIssue>;
  fetchFileData: (issueUid: string, messageId: number) => Promise<BlobContent>;
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

  async function getIssue(issueUid: string, fromMessageId?: number): Promise<SupportIssue> {
    return call<SupportIssue>({
      url: SupportUrl.getIssue(issueUid, fromMessageId),
      method: 'GET',
    });
  }

  async function createMessage(issueUid: string, message: CreateSupportMessage): Promise<SupportMessage> {
    return call<SupportMessage>({
      url: SupportUrl.createMessage(issueUid),
      method: 'POST',
      data: message,
    });
  }

  async function fetchFileData(issueUid: string, messageId: number): Promise<BlobContent> {
    return call<BlobContent>({
      url: SupportUrl.fetchFileData(issueUid, messageId),
      method: 'GET',
    });
  }

  return useMemo(() => ({ createIssue, createMessage, getIssue, fetchFileData }), [call]);
}
