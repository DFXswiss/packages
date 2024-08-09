import { Blockchain } from './blockchain';

export const LnUrlUrl = { get: 'lnurlp' };

export type TransferMethod = Blockchain;

export interface TransferInfo {
  asset: string;
  amount: number;
  method: TransferMethod;
}

export interface PaymentLinkPayRequest {
  tag: string;
  callback: string;
  minSendable: number;
  maxSendable: number;
  metadata: string;
  transferAmounts: TransferInfo[];
}
