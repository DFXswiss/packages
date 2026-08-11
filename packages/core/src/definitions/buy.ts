import { Asset } from './asset';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { FiatPaymentMethod, TransactionError } from './transaction';

export const BuyUrl = {
  quote: 'buy/quote',
  receive: 'buy/paymentInfos',
  personalIban: 'buy/personalIban',
  invoice: (txId: number) => `buy/paymentInfos/${txId}/invoice`,
  confirm: (txId: number) => `buy/paymentInfos/${txId}/confirm`,
};

export enum PersonalIbanProvider {
  FRICK = 'Frick',
  YAPEAL = 'Yapeal',
}

export enum VirtualIbanStatus {
  RESERVED = 'Reserved',
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  DEACTIVATED = 'Deactivated',
}

export interface VirtualIban {
  id: number;
  iban: string;
  bban?: string;
  currency: string;
  /** Name of the issuing bank (e.g. 'Bank Frick', 'Yapeal'). */
  bank: string;
  active: boolean;
  /** Whether the issuing bank still accepts incoming payments for this IBAN. */
  acceptsPayments: boolean;
  status?: VirtualIbanStatus;
  label?: string;
  activatedAt?: Date;
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
   * `PersonalIbanProvider.YAPEAL` selects the customer's EXISTING legacy Yapeal
   * personal IBAN and never issues a new one.
   */
  personalIbanProvider?: PersonalIbanProvider;
}

export interface PdfDocument {
  pdfData: string;
}
