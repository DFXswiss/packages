import { KycState, KycStatus } from './kyc';
import { Language } from './language';

export const UserUrl = { get: 'user/detail', change: 'user', discountCodes: 'user/discountCodes' };

export enum UserStatus {
  NA = 'NA',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
}

export interface User {
  language: Language;
  mail: string;
  kycDataComplete: boolean;
  kycState: KycState;
  kycStatus: KycStatus;
  kycLevel: number;
  tradingLimit: UserTradingLimit;
  kycHash: string;
  status: UserStatus;

  ref?: string;
  refFeePercent: number;
  refCount: number;
  refVolume: number;
  refCredit: number;
  paidRefCredit: number;
}

export interface UserTradingLimit {
  limit: number;
  period: 'Day' | 'Year';
}
