import { Asset } from './asset';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { FiatPaymentMethod, TransactionError } from './transaction';

export const BuyUrl = {
  quote: 'buy/quote',
  receive: 'buy/paymentInfos',
  invoice: (txId: number, collectionAccount?: boolean) =>
    collectionAccount ? `buy/paymentInfos/${txId}/invoice?collectionAccount=true` : `buy/paymentInfos/${txId}/invoice`,
  confirm: (txId: number) => `buy/paymentInfos/${txId}/confirm`,
};

export enum PersonalIbanProvider {
  FRICK = 'Frick',
}

export interface Buy {
  id: number;
  uid: string;
  timestamp: Date;
  name: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  country: string;
  iban?: string;
  bic: string;
  sepaInstant: boolean;
  /** Bank name (e.g. for personal IBAN); optional for backward compatibility. */
  bank?: string;
  routeId: number;
  remittanceInfo?: string;
  fees: Fees;
  minVolume: number;
  maxVolume: number;
  amount: number;
  currency: Fiat;
  feesTarget: Fees;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  exchangeRate: number;
  priceSteps: PriceStep[];
  rate: number;
  exactPrice: boolean;
  estimatedAmount: number;
  asset: Asset;
  paymentRequest?: string;
  paymentLink?: string;
  isValid: boolean;
  error?: TransactionError;
  isPersonalIban?: boolean;
}

export interface BuyPaymentInfo {
  currency: Fiat;
  amount?: number;
  asset: Asset;
  targetAmount?: number;
  targetAddress?: string;
  paymentMethod?: FiatPaymentMethod;
  externalTransactionId?: string;
  exactPrice?: boolean;
  /**
   * Explicit personal IBAN provider (e.g. PersonalIbanProvider.FRICK / "Frick").
   * Fail-closed on the API.
   */
  personalIbanProvider?: PersonalIbanProvider;
}

export interface PdfDocument {
  pdfData: string;
}
