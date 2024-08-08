import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fiat } from './fiat';

export const PaymentRoutesUrl = { get: 'route' };
export const PaymentLinksUrl = {
  get: 'paymentLink',
  create: 'paymentLink',
  update: 'paymentLink',
  payment: 'paymentLink/payment',
};

export enum PaymentLinkStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PaymentLinkPaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired',
}

export enum PaymentLinkPaymentMode {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
}

export interface MinAmount {
  amount: number;
  asset: string;
}

export interface DepositDto {
  id: number;
  address: string;
  blockchains: Blockchain[];
}

export interface BuyRoute {
  id: number;
  active: boolean;
  iban: string;
  asset: Asset;
  bankUsage: string;
  volume: number;
  annualVolume: number;
  fee: number;
  minDeposits: MinAmount[];
  minFee: MinAmount;
}

export interface SellRoute {
  id: number;
  active: boolean;
  deposit: DepositDto;
  iban: string;
  currency: Fiat;
  volume: number;
  annualVolume: number;
  fee: number;
  minDeposits: MinAmount[];
  minFee: MinAmount;
}

export interface SwapRoute {
  id: number;
  active: boolean;
  asset: Asset;
  deposit: DepositDto;
  volume: number;
  annualVolume: number;
  fee: number;
  minDeposits: MinAmount[];
  minFee: MinAmount;
}

export interface PaymentRoutes {
  buy: BuyRoute[];
  sell: SellRoute[];
  swap: SwapRoute[];
}

export type PaymentRoute = BuyRoute | SellRoute | SwapRoute;

export interface PaymentLink {
  id: string;
  routeId: string;
  externalId?: string;
  status: PaymentLinkStatus;
  url: string;
  lnurl: string;
  payment?: PaymentLinkPayment;
}

export interface PaymentLinkPayment {
  id: string;
  externalId?: string;
  status: PaymentLinkPaymentStatus;
  amount: number;
  currency: Fiat;
  mode: PaymentLinkPaymentMode;
  expiryDate: Date;
  url: string;
  lnurl: string;
}

export interface CreatePaymentLinkPayment {
  mode: PaymentLinkPaymentMode;
  amount: number;
  externalId: string;
  currency: Fiat;
  expiryDate: Date;
}

export interface CreatePaymentLink {
  routeId?: number;
  externalId?: string;
  payment?: CreatePaymentLinkPayment;
}

export interface UpdatePaymentLink {
  status: PaymentLinkStatus;
}
