export const TransactionUrl = {
  get: 'transaction',
  single: `transaction/single`,
  detail: 'transaction/detail',
  csv: 'transaction/detail/csv',
  unassigned: 'transaction/unassigned',
  target: 'transaction/target',
  refund: (id: number) => `transaction/${id}/refund`,
  setTarget: (id: number) => `transaction/${id}/target`,
  invoice: (id: number) => `transaction/${id}/invoice`,
  receipt: (id: number) => `transaction/${id}/receipt`,
};

import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { Fiat } from './fiat';
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
  NAME_REQUIRED = 'NameRequired',
  KYC_REQUIRED_INSTANT = 'KycRequiredInstant',
  LIMIT_EXCEEDED = 'LimitExceeded',
  NATIONALITY_NOT_ALLOWED = 'NationalityNotAllowed',
  VIDEO_IDENT_REQUIRED = 'VideoIdentRequired',
  IBAN_CURRENCY_MISMATCH = 'IbanCurrencyMismatch',
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
  LIQUIDITY_PENDING = 'LiquidityPending',
  CHECK_PENDING = 'CheckPending',
  KYC_REQUIRED = 'KycRequired',
  LIMIT_EXCEEDED = 'LimitExceeded',
  FEE_TOO_HIGH = 'FeeTooHigh',
  PRICE_UNDETERMINABLE = 'PriceUndeterminable',
  PAYOUT_IN_PROGRESS = 'PayoutInProgress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  RETURN_PENDING = 'ReturnPending',
  RETURNED = 'Returned',
  UNASSIGNED = 'Unassigned',
  WAITING_FOR_PAYMENT = 'WaitingForPayment',
}

export enum TransactionFailureReason {
  UNKNOWN = 'Unknown',
  DAILY_LIMIT_EXCEEDED = 'DailyLimitExceeded',
  MONTHLY_LIMIT_EXCEEDED = 'MonthlyLimitExceeded',
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
  MISSING_LIQUIDITY = 'MissingLiquidity',
  KYC_DATA_NEEDED = 'KycDataNeeded',
  BANK_TX_NEEDED = 'BankTxNeeded',
}

export enum ExportType {
  COMPACT = 'Compact',
  COIN_TRACKING = 'CoinTracking',
  CHAIN_REPORT = 'ChainReport',
}

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export interface UnassignedTransaction {
  id?: number;
  uid: string;
  orderUid: string;
  type: TransactionType;
  state: TransactionState;
  inputAmount?: number;
  inputAsset?: string;
  inputAssetId?: number;
  inputBlockchain?: Blockchain;
  inputPaymentMethod?: PaymentMethod;
  inputTxId?: string;
  inputTxUrl?: string;
  chargebackAmount?: number;
  chargebackAsset?: string;
  chargebackAssetId?: number;
  chargebackTarget?: string;
  chargeBackTxId?: string;
  chargeBackTxUrl?: string;
  chargebackDate?: Date;
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

export interface RefundFeeData {
  network: number;
  bank: number;
}

export interface TransactionRefundData {
  expiryDate: Date;
  fee: RefundFeeData;
  refundAmount: number;
  refundAsset: Asset | Fiat;
  inputAmount: number;
  inputAsset: Asset | Fiat;
}

export interface TransactionHistoryQuery {
  userAddress?: string;
  from?: Date;
  to?: Date;
  format?: ExportFormat;
  buy?: boolean;
  sell?: boolean;
  staking?: boolean;
  ref?: boolean;
  lm?: boolean;
}

export interface TransactionRefundTarget {
  refundTarget: string;
}

export type TransactionFilterKey = keyof TransactionFilter;
