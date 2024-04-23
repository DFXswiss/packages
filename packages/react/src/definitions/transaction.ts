export const TransactionUrl = {
  get: 'transaction',
  getByUid: (uid: string) => `transaction/uid/${uid}`,
  detail: 'transaction/detail',
  csv: 'transaction/detail/csv',
  unassigned: 'transaction/unassigned',
  target: 'transaction/target',
  setTarget: (id: number) => `transaction/${id}/target`,
};

import { Asset } from './asset';
import { Blockchain } from './blockchain';

export enum FiatPaymentMethod {
  BANK = 'Bank',
  INSTANT = 'Instant',
  CARD = 'Card',
}

export enum CryptoPaymentMethod {
  CRYPTO = 'Crypto',
}

export type PaymentMethod = FiatPaymentMethod | CryptoPaymentMethod;

export enum TransactionError {
  AMOUNT_TOO_LOW = 'AmountTooLow',
  AMOUNT_TOO_HIGH = 'AmountTooHigh',
  BANK_TRANSACTION_MISSING = 'BankTransactionMissing',
  KYC_REQUIRED = 'KycRequired',
  KYC_REQUIRED_INSTANT = 'KycRequiredInstant',
  LIMIT_EXCEEDED = 'LimitExceeded',
}

export enum TransactionType {
  BUY = 'Buy',
  SELL = 'Sell',
  SWAP = 'Swap',
  REFERRAL = 'Referral',
}

export enum TransactionState {
  CREATED = 'Created',
  PROCESSING = 'Processing',
  AML_PENDING = 'AmlPending',
  KYC_REQUIRED = 'KycRequired',
  FEE_TOO_HIGH = 'FeeTooHigh',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  RETURNED = 'Returned',
}

export enum TransactionFailureReason {
  UNKNOWN = 'Unknown',
  DAILY_LIMIT_EXCEEDED = 'DailyLimitExceeded',
  ANNUAL_LIMIT_EXCEEDED = 'AnnualLimitExceeded',
  ACCOUNT_HOLDER_MISMATCH = 'AccountHolderMismatch',
  KYC_REJECTED = 'KycRejected',
  FRAUD_SUSPICION = 'FraudSuspicion',
  SANCTION_SUSPICION = 'SanctionSuspicion',
  MIN_DEPOSIT_NOT_REACHED = 'MinDepositNotReached',
  ASSET_NOT_AVAILABLE = 'AssetNotAvailable',
  STAKING_DISCONTINUED = 'StakingDiscontinued',
  BANK_NOT_ALLOWED = 'BankNotAllowed',
  PAYMENT_ACCOUNT_NOT_ALLOWED = 'PaymentAccountNotAllowed',
  COUNTRY_NOT_ALLOWED = 'CountryNotAllowed',
  INSTANT_PAYMENT = 'InstantPayment',
  FEE_TOO_HIGH = 'FeeTooHigh',
}

export interface UnassignedTransaction {
  id: number;
  type: TransactionType;
  inputAmount?: number;
  inputAsset?: string;
  inputAssetId?: number;
  inputBlockchain?: Blockchain;
  inputPaymentMethod?: PaymentMethod;
  inputTxId?: string;
  inputTxUrl?: string;
  date: Date;
}

export interface Transaction extends UnassignedTransaction {
  state: TransactionState;
  reason: TransactionFailureReason;
  exchangeRate?: number;
  rate?: number;
  outputAmount?: number;
  outputAsset?: string;
  outputAssetId?: number;
  outputBlockchain?: Blockchain;
  outputPaymentMethod?: PaymentMethod;
  outputTxId?: string;
  outputTxUrl?: string;
  feeAmount?: number;
  feeAsset?: string;
  externalTransactionId?: string;
}

export interface DetailTransaction extends Transaction {
  sourceAccount?: string;
  targetAccount?: string;
}

export interface TransactionTarget {
  id: number;
  bankUsage: string;
  asset: Asset;
  address: string;
}
