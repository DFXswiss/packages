import { Asset } from './asset';
import { Fiat } from './fiat';
import { TransactionError } from './transaction';

export const BuyUrl = { receive: 'buy/paymentInfos' };

export enum BuyPaymentMethod {
  BANK = 'Bank',
  INSTANT = 'Instant',
  CARD = 'Card',
}

export interface Buy {
  name: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  country: string;
  iban: string;
  bic: string;
  sepaInstant: boolean;
  routeId: number;
  remittanceInfo: string;
  fee: number;
  minFee: number;
  minVolume: number;
  maxVolume: number;
  minFeeTarget: number;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  amount: number;
  currency: Fiat;
  estimatedAmount: number;
  rate: number;
  exchangeRate: number;
  exactPrice: boolean;
  asset: Asset;
  paymentRequest?: string;
  paymentLink?: string;
  nameRequired?: boolean;
  isValid: boolean;
  error?: TransactionError;
}

export interface BuyPaymentInfo {
  currency: Fiat;
  amount?: number;
  asset: Asset;
  targetAmount?: number;
  paymentMethod?: BuyPaymentMethod;
  externalTransactionId?: string;
  exactPrice?: boolean;
}
