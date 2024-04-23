export const SupportUrl = { createTransactionIssue: 'support/issue/transaction' };

export enum SupportIssueReason {
  FUNDS_NOT_RECEIVED = 'FundsNotReceived',
  OTHER = 'Other',
}

export interface CreateTransactionIssue {
  reason: SupportIssueReason;
  description?: string;
  file?: string;
  fileName?: string;
}
