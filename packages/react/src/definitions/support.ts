export const SupportUrl = { createTransactionIssue: (id: number) => `support/issue/transaction?id=${id}` };

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
