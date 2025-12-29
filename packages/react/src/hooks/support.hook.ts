import { useCallback, useMemo } from 'react';
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
  getIssues: () => Promise<SupportIssue[]>;
  getIssue: (issueUid: string, fromMessageId?: number) => Promise<SupportIssue>;
  fetchFileData: (issueUid: string, messageId: number) => Promise<BlobContent>;
}

export function useSupportChat(): SupportInterface {
  const { call } = useApi();

  const createIssue = useCallback(
    async (request: CreateSupportIssue): Promise<SupportIssue> => {
      return call<SupportIssue>({
        url: SupportUrl.supportIssue,
        method: 'POST',
        data: request,
      });
    },
    [call],
  );

  const getIssues = useCallback(async (): Promise<SupportIssue[]> => {
    return call<SupportIssue[]>({
      url: SupportUrl.supportIssue,
      method: 'GET',
    });
  }, [call]);

  const getIssue = useCallback(
    async (issueUid: string, fromMessageId?: number): Promise<SupportIssue> => {
      return call<SupportIssue>({
        url: SupportUrl.getIssue(issueUid, fromMessageId),
        method: 'GET',
      });
    },
    [call],
  );

  const createMessage = useCallback(
    async (issueUid: string, message: CreateSupportMessage): Promise<SupportMessage> => {
      return call<SupportMessage>({
        url: SupportUrl.createMessage(issueUid),
        method: 'POST',
        data: message,
      });
    },
    [call],
  );

  const fetchFileData = useCallback(
    async (issueUid: string, messageId: number): Promise<BlobContent> => {
      return call<BlobContent>({
        url: SupportUrl.fetchFileData(issueUid, messageId),
        method: 'GET',
      });
    },
    [call],
  );

  return useMemo(
    () => ({ createIssue, createMessage, getIssues, getIssue, fetchFileData }),
    [createIssue, createMessage, getIssues, getIssue, fetchFileData],
  );
}
