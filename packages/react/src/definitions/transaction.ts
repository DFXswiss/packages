export const TransactionUrl = { get: 'transaction' };

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
}

export enum TransactionType {
  BUY = 'Buy',
  SELL = 'Sell',
  CONVERT = 'Convert',
  REFERRAL = 'Referral',
}

export enum TransactionState {
  CREATED = 'Created',
  PROCESSING = 'Processing',
  AML_PENDING = 'AmlPending',
  FEE_TOO_HIGH = 'FeeTooHigh',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  RETURNED = 'Returned',
}

export interface Transaction {
  type: TransactionType;
  state: TransactionState;
  inputAmount?: number;
  inputAsset?: string;
  inputAssetId?: number;
  inputBlockchain?: Blockchain;
  inputPaymentMethod?: PaymentMethod;
  exchangeRate?: number;
  rate?: number;
  outputAmount?: number;
  outputAsset?: string;
  outputAssetId?: number;
  outputBlockchain?: Blockchain;
  outputPaymentMethod?: PaymentMethod;
  feeAmount?: number;
  feeAsset?: string;
  inputTxId?: string;
  inputTxUrl?: string;
  outputTxId?: string;
  outputTxUrl?: string;
  date: Date;
  externalTransactionId?: string;
}
