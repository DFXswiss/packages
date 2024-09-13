import { Limit, InvestmentDate, FundOrigin } from './kyc';

export const SupportUrl = {
  createIssue: 'support/issue',
  createMessage: (id: string) => `support/issue/${id}/message`,
  getIssue: (id: string, fromMessageId?: number) =>
    `support/issue/${id}${fromMessageId ? `?fromMessageId=${fromMessageId}` : ''}`,
  fetchFileData: (id: string, messageId: number) => `support/issue/${id}/message/${messageId}/file`,
};

export enum SupportIssueType {
  GENERIC_ISSUE = 'GenericIssue',
  TRANSACTION_ISSUE = 'TransactionIssue',
  KYC_ISSUE = 'KycIssue',
  LIMIT_REQUEST = 'LimitRequest',
  PARTNERSHIP_REQUEST = 'PartnershipRequest',
  NOTIFICATION_OF_CHANGES = 'NotificationOfChanges',
}

export enum SupportIssueReason {
  OTHER = 'Other',

  // transaction
  FUNDS_NOT_RECEIVED = 'FundsNotReceived',
  TRANSACTION_MISSING = 'TransactionMissing',
}

export enum SupportIssueState {
  CREATED = 'Created',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

export enum SupportMessageStatus {
  SENT = 'Sent',
  RECEIVED = 'Received',
  FAILED = 'Failed',
}

// --- CORE INTERFACES --- //
export interface Reaction {
  emoji: string;
  users: string[];
}

export interface BlobContent {
  data: any;
  contentType: string;
}

export interface DataFile {
  file: string;
  type: string;
  size: number;
  url: string;
}

export interface SupportIssueTransaction {
  uid: string;
  url: string;
}

export interface SupportIssueLimitRequest {
  id: number;
  limit: number;
}

export interface SupportMessage {
  id: number;
  author?: string; // undefined for unsettled messages
  created: Date;
  message?: string;
  fileName?: string;

  // frontend only fields
  file?: DataFile;
  status?: SupportMessageStatus;
  replyTo?: number;
  reactions?: Reaction[];
}

export interface SupportIssue {
  id: string;
  state: SupportIssueState;
  type: SupportIssueType;
  reason: SupportIssueReason;
  name: string;
  created: Date;
  messages: SupportMessage[];
  transaction?: SupportIssueTransaction;
  limitRequest?: SupportIssueLimitRequest;
}

// --- CREATE INTERFACES --- //

export interface TransactionIssue {
  id?: number;
  senderIban?: string;
  receiverIban?: string;
  date?: Date;
}

export interface LimitRequestIssue {
  limit: Limit;
  investmentDate: InvestmentDate;
  fundOrigin: FundOrigin;
  fundOriginText?: string;
}

export interface CreateSupportMessage {
  author?: string;
  message?: string;
  file?: string;
  fileName?: string;
}

export interface CreateSupportIssue extends CreateSupportMessage {
  type: SupportIssueType;
  reason: SupportIssueReason;
  name: string;
  transaction?: TransactionIssue;
  limitRequest?: LimitRequestIssue;
}
