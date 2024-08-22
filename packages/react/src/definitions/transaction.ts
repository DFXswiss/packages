export const TransactionUrl = {
  get: 'transaction',
  single: `transaction/single`,
  detail: 'transaction/detail',
  csv: 'transaction/detail/csv',
  unassigned: 'transaction/unassigned',
  target: 'transaction/target',
  setTarget: (id: number) => `transaction/${id}/target`,
};

import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { PriceStep } from './price-step';

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
  KYC_DATA_REQUIRED = 'KycDataRequired',
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
  UNASSIGNED = 'Unassigned',
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
  ASSET_NOT_AVAILABLE_WITH_CHOSEN_BANK = 'AssetNotAvailableWithChosenBank',
  STAKING_DISCONTINUED = 'StakingDiscontinued',
  BANK_NOT_ALLOWED = 'BankNotAllowed',
  PAYMENT_ACCOUNT_NOT_ALLOWED = 'PaymentAccountNotAllowed',
  COUNTRY_NOT_ALLOWED = 'CountryNotAllowed',
  INSTANT_PAYMENT = 'InstantPayment',
  FEE_TOO_HIGH = 'FeeTooHigh',
  RECEIVER_REJECTED = 'ReceiverRejected',
  CHF_ABROAD_NOT_ALLOWED = 'ChfAbroadNotAllowed',
  ASSET_KYC_NEEDED = 'AssetKycNeeded',
  CARD_NAME_MISMATCH = 'CardNameMismatch',
  USER_DELETED = 'UserDeleted',
  VIDEO_IDENT_NEEDED = 'VideoIdentNeeded',
}

export interface UnassignedTransaction {
  id: number;
  uid: string;
  type: TransactionType;
  state: TransactionState;
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
  reason: TransactionFailureReason;
  exchangeRate?: number;
  priceSteps?: PriceStep[];
  rate?: number;
  outputAmount?: number;
  outputAsset?: string;
  outputAssetId?: number;
  outputBlockchain?: Blockchain;
  outputPaymentMethod?: PaymentMethod;
  outputTxId?: string;
  outputTxUrl?: string;
  fees?: Fees;
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

export interface TransactionFilter {
  buy?: boolean;
  sell?: boolean;
  staking?: boolean;
  ref?: boolean;
  lm?: boolean;
}

export type TransactionFilterKey = keyof TransactionFilter;
