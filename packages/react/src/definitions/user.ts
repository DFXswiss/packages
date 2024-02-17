import { KycState, KycStatus, TradingLimit } from './kyc';
import { Language } from './language';

export const UserUrl = { get: 'user/detail', change: 'user', discountCodes: 'user/discountCodes' };

export enum UserStatus {
  NA = 'NA',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
}

export interface User {
  wallet: string;
  language: Language;
  mail: string;
  kycDataComplete: boolean;
  kycState: KycState;
  kycStatus: KycStatus;
  kycLevel: number;
  tradingLimit: TradingLimit;
  kycHash: string;
  status: UserStatus;

  ref?: string;
  refFeePercent: number;
  refCount: number;
  refVolume: number;
  refCredit: number;
  paidRefCredit: number;
}
