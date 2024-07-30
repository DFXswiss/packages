import { Limit, InvestmentDate, FundOrigin } from './kyc';

export const SupportUrl = {
  createGeneralIssue: 'support/issue',
  createTransactionIssue: (id: number) => `support/issue/transaction?id=${id}`,
  createMessage: (id: number) => `support/issue/${id}/message`,
};

export enum SupportIssueType {
  GENERIC_ISSUE = 'GenericIssue',
  TRANSACTION_ISSUE = 'TransactionIssue',
  KYC_ISSUE = 'KycIssue',
  LIMIT_REQUEST = 'LimitRequest',
  PARTNERSHIP_REQUEST = 'PartnershipRequest',
}

export enum SupportIssueReason {
  OTHER = 'Other',

  // transaction
  FUNDS_NOT_RECEIVED = 'FundsNotReceived',
  TRANSACTION_MISSING = 'TransactionMissing',
}

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
  fundOriginText: string;
}

export interface CreateSupportMessage {
  message: string;
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
