import { Asset } from './asset';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { FiatPaymentMethod, TransactionError } from './transaction';

export const BuyUrl = {
  quote: 'buy/quote',
  receive: 'buy/paymentInfos',
  invoice: (txId: number) => `buy/paymentInfos/${txId}/invoice`,
  confirm: (txId: number) => `buy/paymentInfos/${txId}/confirm`,
  personalIban: 'buy/personalIban',
};

export enum PersonalIbanProvider {
  FRICK = 'Frick',
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
  active: boolean;
  /** Whether the bank behind this IBAN currently accepts payments. Independent of `active`. */
  acceptsPayments: boolean;
  status?: VirtualIbanStatus;
  label?: string;
  activatedAt?: Date;
}

export interface CreateVirtualIban {
  /** Currency name, e.g. "EUR". */
  currency: string;
}

/**
 * Returns the canonical spelling of a personal IBAN provider selector, matched case-insensitively.
 * Values that match no known provider are returned unchanged.
 */
export function normalizePersonalIban(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;

  return Object.values(PersonalIbanProvider).find((p) => p.toLowerCase() === value.toLowerCase()) ?? value;
}

/** Returns the provider for a selector, or undefined when it matches no known provider. */
export function toPersonalIbanProvider(value: string | undefined): PersonalIbanProvider | undefined {
  if (value === undefined) return undefined;

  return Object.values(PersonalIbanProvider).find((p) => p.toLowerCase() === value.toLowerCase());
}

/**
 * True when a selector was set but matches no known provider (e.g. a typo, or a provider this
 * version does not know). The API rejects unknown providers, so fail closed on such a selector
 * instead of dropping it and silently requesting an ordinary bank transfer.
 */
export function isUnrecognizedPersonalIbanSelector(value: string | undefined): boolean {
  return value !== undefined && toPersonalIbanProvider(value) === undefined;
}

/** Builds the personal IBAN part of a buy payment info request; empty for an unset or unknown selector. */
export function toPersonalIbanProviderRequest(value: string | undefined): {
  personalIbanProvider?: PersonalIbanProvider;
} {
  const provider = toPersonalIbanProvider(value);

  return provider ? { personalIbanProvider: provider } : {};
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
