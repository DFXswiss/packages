export const SupportUrl = {
  createTransactionIssue: (id: number) => `support/issue/transaction?id=${id}`,
  createMessage: (id: number) => `support/issue/${id}/message`,
};

export enum SupportIssueReason {
  FUNDS_NOT_RECEIVED = 'FundsNotReceived',
  OTHER = 'Other',
}

export interface CreateSupportMessage {
  message: string;
  file?: string;
  fileName?: string;
}

export interface CreateTransactionIssue extends CreateSupportMessage {
  reason: SupportIssueReason;
  name: string;
}
