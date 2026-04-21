import { Limit, InvestmentDate, FundOrigin } from './kyc';

export const SupportUrl = {
  supportIssue: 'support/issue',
  createMessage: (uid: string) => `support/issue/${uid}/message`,
  getIssue: (uid: string, fromMessageId?: number) =>
    `support/issue/${uid}${fromMessageId ? `?fromMessageId=${fromMessageId}` : ''}`,
  fetchFileData: (uid: string, messageId: number) => `support/issue/${uid}/message/${messageId}/file`,
};

export enum SupportIssueType {
  GENERIC_ISSUE = 'GenericIssue',
  TRANSACTION_ISSUE = 'TransactionIssue',
  VERIFICATION_CALL = 'VerificationCall',
  KYC_ISSUE = 'KycIssue',
  LIMIT_REQUEST = 'LimitRequest',
  PARTNERSHIP_REQUEST = 'PartnershipRequest',
  NOTIFICATION_OF_CHANGES = 'NotificationOfChanges',
  BUG_REPORT = 'BugReport',
}

export enum SupportIssueReason {
  // general
  OTHER = 'Other',

  // support
  DATA_REQUEST = 'DataRequest',

  // transaction issue
  FUNDS_NOT_RECEIVED = 'FundsNotReceived',
  TRANSACTION_MISSING = 'TransactionMissing',

  // verification call
  REJECT_CALL = 'RejectCall',
  REPEAT_CALL = 'RepeatCall',

  // notification of changes issue
  NAME_CHANGED = 'NameChanged',
  ADDRESS_CHANGED = 'AddressChanged',
  CIVIL_STATUS_CHANGED = 'CivilStatusChanged',
}

export enum SupportIssueState {
  CREATED = 'Created',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
}

export enum SupportIssueInternalState {
  CREATED = 'Created',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
  ON_HOLD = 'OnHold',
}

export enum Department {
  SUPPORT = 'Support',
  COMPLIANCE = 'Compliance',
  MARKETING = 'Marketing',
  COOPERATION = 'Cooperation',
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
  author?: string;
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
  uid: string;
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
  uid?: string;
  orderUid?: string;
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
