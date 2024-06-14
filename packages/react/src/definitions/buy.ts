import { Asset } from './asset';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { FiatPaymentMethod, TransactionError } from './transaction';

export const BuyUrl = { receive: 'buy/paymentInfos' };

export interface Buy {
  id: number;
  name: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  country: string;
  iban?: string;
  bic: string;
  sepaInstant: boolean;
  routeId: number;
  remittanceInfo: string;
  fees: Fees;
  minVolume: number;
  maxVolume: number;
  amount: number;
  currency: Fiat;
  feesTarget: Fees;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  exchangeRate: number;
  rate: number;
  exactPrice: boolean;
  estimatedAmount: number;
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
  paymentMethod?: FiatPaymentMethod;
  externalTransactionId?: string;
  exactPrice?: boolean;
}

export interface Invoice {
  invoicePdf: string;
}
