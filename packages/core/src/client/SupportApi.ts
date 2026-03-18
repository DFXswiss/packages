import {
  SupportUrl,
  SupportIssue,
  CreateSupportIssue,
  CreateSupportMessage,
  SupportMessage,
  BlobContent,
} from '../definitions/support';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

export class SupportApi {
  constructor(private readonly http: DfxHttpClient) {}

  async createIssue(data: CreateSupportIssue): Promise<SupportIssue> {
    return this.http.request<SupportIssue>({ url: SupportUrl.supportIssue, method: 'POST', data });
  }

  async listIssues(): Promise<SupportIssue[]> {
    return this.http.request<SupportIssue[]>({ url: SupportUrl.supportIssue, method: 'GET' });
  }

  async getIssue(uid: string, fromMessageId?: number): Promise<SupportIssue> {
    return this.http.request<SupportIssue>({ url: SupportUrl.getIssue(uid, fromMessageId), method: 'GET' });
  }

  async createMessage(uid: string, data: CreateSupportMessage): Promise<SupportMessage> {
    return this.http.request<SupportMessage>({ url: SupportUrl.createMessage(uid), method: 'POST', data });
  }

  async getFileData(uid: string, messageId: number): Promise<BlobContent> {
    return this.http.request<BlobContent>({
      url: SupportUrl.fetchFileData(uid, messageId),
      method: 'GET',
      responseType: ResponseType.BLOB,
    });
  }
}
