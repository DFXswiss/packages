import { AmlReason, CheckStatus } from './aml';
import { AccountType } from './kyc';
import { PhoneCallStatus } from './user';

export enum PendingReviewType {
  KYC_STEP = 'KycStep',
  BANK_DATA = 'BankData',
}

export enum PendingReviewStatus {
  MANUAL_REVIEW = 'ManualReview',
  INTERNAL_REVIEW = 'InternalReview',
}

export interface PendingReviewSummaryEntry {
  type: PendingReviewType;
  name: string;
  manualReview: number;
  internalReview: number;
}

export interface PendingReviewItem {
  id: number;
  userDataId: number;
  userName?: string;
  accountType?: AccountType;
  kycLevel?: number;
  date: string;
}

export enum CallQueue {
  MANUAL_CHECK_PHONE = 'ManualCheckPhone',
  MANUAL_CHECK_IP_PHONE = 'ManualCheckIpPhone',
  MANUAL_CHECK_IP_COUNTRY_PHONE = 'ManualCheckIpCountryPhone',
  MANUAL_CHECK_EXTERNAL_ACCOUNT_PHONE = 'ManualCheckExternalAccountPhone',
  UNAVAILABLE_SUSPICIOUS = 'UnavailableSuspicious',
}

export type CallQueueSourceType = 'BuyCrypto' | 'BuyFiat';

export interface CallQueueSummaryEntry {
  queue: CallQueue;
  count: number;
}

export interface CallQueueItem {
  queue: CallQueue;
  userDataId: number;
  userName?: string;
  phone?: string;
  language?: string;
  country?: string;
  kycLevel?: number;
  txId?: number;
  sourceType?: CallQueueSourceType;
  amlCheck?: CheckStatus;
  amlReason?: AmlReason;
  inputAmount?: number;
  inputAsset?: string;
  ip?: string;
  ipCountry?: string;
  phoneCallStatus?: PhoneCallStatus;
  date: string;
}
