import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fiat } from './fiat';

export const PaymentRoutesUrl = { get: 'route' };
export const PaymentLinksUrl = {
  get: 'paymentLink',
  create: 'paymentLink',
  update: 'paymentLink',
  payment: 'paymentLink/payment',
  userPaymentLinksConfig: 'paymentLink/config',
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

export enum PaymentStandardType {
  OPEN_CRYPTO_PAY = 'OpenCryptoPay',
  LIGHTNING_BOLT11 = 'LightningBolt11',
  PAY_TO_ADDRESS = 'PayToAddress',
}

export enum PaymentQuoteStatus {
  ACTUAL = 'Actual',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired',

  TX_RECEIVED = 'TxReceived',
  TX_MEMPOOL = 'TxMempool',
  TX_BLOCKCHAIN = 'TxBlockchain',
  TX_COMPLETED = 'TxCompleted',
  TX_FAILED = 'TxFailed',
}

export enum MinCompletionStatus {
  TX_RECEIVED = PaymentQuoteStatus.TX_RECEIVED,
  TX_MEMPOOL = PaymentQuoteStatus.TX_MEMPOOL,
  TX_BLOCKCHAIN = PaymentQuoteStatus.TX_BLOCKCHAIN,
  TX_COMPLETED = PaymentQuoteStatus.TX_COMPLETED,
}

export const PaymentLinkBlockchain = {
  ARBITRUM: Blockchain.ARBITRUM,
  BASE: Blockchain.BASE,
  ETHEREUM: Blockchain.ETHEREUM,
  LIGHTNING: Blockchain.LIGHTNING,
  BITCOIN: Blockchain.BITCOIN,
  MONERO: Blockchain.MONERO,
  OPTIMISM: Blockchain.OPTIMISM,
  POLYGON: Blockchain.POLYGON,
} as const;

export type PaymentLinkBlockchain = typeof PaymentLinkBlockchain[keyof typeof PaymentLinkBlockchain];

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
export type PaymentRouteType = 'buy' | 'sell' | 'swap';

export interface PaymentLink {
  id: string;
  routeId: string;
  externalId?: string;
  label?: string;
  recipient?: PaymentLinkRecipient;
  status: PaymentLinkStatus;
  payment?: PaymentLinkPayment;
  config?: PaymentLinkConfig;
  url: string;
  lnurl: string;
}

export interface PaymentLinkRecipient {
  name?: string;
  address?: PaymentLinkRecipientAddress;
  phone?: string;
  mail?: string;
  website?: string;
}

export interface PaymentLinkRecipientAddress {
  street?: string;
  houseNumber?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface PaymentLinkPayment {
  id: string;
  externalId?: string;
  status: PaymentLinkPaymentStatus;
  amount: number;
  currency: Fiat;
  mode: PaymentLinkPaymentMode;
  expiryDate: Date;
  txCount: number;
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
  webhookUrl?: string;
  recipient: PaymentLinkRecipient;
  payment?: CreatePaymentLinkPayment;
}

export interface UpdatePaymentLinkConfig {
  standards?: PaymentStandardType[];
  blockchains?: PaymentLinkBlockchain[];
  minCompletionStatus?: MinCompletionStatus;
  displayQr?: boolean;
  recipient?: PaymentLinkRecipient;
  paymentTimeout?: number;
}

export interface PaymentLinkConfig extends UpdatePaymentLinkConfig {
  fee?: number;
}

export interface UpdatePaymentLink {
  status?: PaymentLinkStatus;
  label?: string;
  webhookUrl?: string;
  config?: UpdatePaymentLinkConfig;
}
