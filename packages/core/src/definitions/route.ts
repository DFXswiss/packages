import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fiat } from './fiat';
import { GoodsCategory, GoodsType, MerchantCategory, StoreType } from './kyc';

export const PaymentRoutesUrl = { get: 'route' };
export const PaymentLinksUrl = {
  get: 'paymentLink',
  create: 'paymentLink',
  update: 'paymentLink',
  assign: 'paymentLink/assign',
  payment: 'paymentLink/payment',
  paymentWait: 'paymentLink/payment/wait',
  paymentConfirm: 'paymentLink/payment/confirm',
  history: 'paymentLink/history',
  standard: 'paymentLink/standard',
  standardById: (id: PaymentStandardType) => `paymentLink/standard/${id}`,
  userPaymentLinksConfig: 'paymentLink/config',
  recipient: (route: string) => `paymentLink/recipient?id=${route}`,
  stickers: 'paymentLink/stickers',
  pos: 'paymentLink/pos',
};

export enum PaymentLinkStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PaymentLinkMode {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
  PUBLIC = 'Public',
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
  SPARK: Blockchain.SPARK,
  ARKADE: Blockchain.ARKADE,
  BITCOIN: Blockchain.BITCOIN,
  FIRO: Blockchain.FIRO,
  INTERNET_COMPUTER: Blockchain.INTERNET_COMPUTER,
  MONERO: Blockchain.MONERO,
  OPTIMISM: Blockchain.OPTIMISM,
  POLYGON: Blockchain.POLYGON,
  SOLANA: Blockchain.SOLANA,
} as const;

export type PaymentLinkBlockchain = (typeof PaymentLinkBlockchain)[keyof typeof PaymentLinkBlockchain];

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
  webhookUrl?: string;
  recipient?: PaymentLinkRecipient;
  status: PaymentLinkStatus;
  mode: PaymentLinkMode;
  payment?: PaymentLinkPayment;
  config?: PaymentLinkConfig;
  url: string;
  lnurl: string;
  frontendUrl: string;
}

export interface PaymentLinkRecipient {
  name?: string;
  address?: PaymentLinkRecipientAddress;
  phone?: string;
  mail?: string;
  website?: string;
  registrationNumber?: string;
  storeType?: StoreType;
  merchantCategory?: MerchantCategory;
  goodsType?: GoodsType;
  goodsCategory?: GoodsCategory;
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
  cancellable?: boolean;
}

export interface PaymentLinkConfig extends UpdatePaymentLinkConfig {
  fee?: number;
}

export interface UpdatePaymentLink {
  status?: PaymentLinkStatus;
  mode?: PaymentLinkMode;
  label?: string;
  webhookUrl?: string;
  config?: UpdatePaymentLinkConfig;
}

export interface AssignPaymentLink {
  publicName: string;
}

export interface PaymentLinkPos {
  url: string;
}

// --- PAY FLOW --- //

/** Descriptor of a payment standard, as served by `paymentLink/standard`. */
export interface PaymentStandard {
  id: PaymentStandardType;
  label: string;
  description: string;
  paymentIdentifierLabel?: string;
  blockchain?: Blockchain;
}

/** Customer-to-business payment providers. Not blockchains, but usable as a transfer method. */
export enum C2BPaymentMethod {
  BINANCE_PAY = 'BinancePay',
  KUCOIN_PAY = 'KucoinPay',
}

/** Methods that are settled by hand and are not blockchains of their own. */
export enum ManualPaymentMethod {
  TAPROOT_ASSET = 'TaprootAsset',
}

export type TransferMethod = Blockchain | C2BPaymentMethod | ManualPaymentMethod;

export interface PaymentAmount {
  asset: string;
  /** Absent while no amount has been requested yet. */
  amount?: number;
}

export interface TransferAmount {
  method: TransferMethod;
  minFee: number;
  assets: PaymentAmount[];
  /** False when the method is currently not payable, e.g. for a missing balance. */
  available: boolean;
}

export interface PaymentQuote {
  id: string;
  expiration: Date;
  payment: string;
}

/**
 * Common part of every pay request response. A response either carries a quote
 * (`PaymentLinkPayRequest`) or an error (`PaymentLinkPayTerminal`); use `hasPaymentQuote` to tell
 * them apart.
 */
export interface PaymentLinkRequestBase {
  id: string;
  externalId?: string;
  displayName: string;
  standard: PaymentStandardType;
  possibleStandards: PaymentStandardType[];
  displayQr: boolean;
  recipient: PaymentLinkRecipient;
  mode: PaymentLinkMode;
  route?: string;
  currency?: string;
  transferAmounts: TransferAmount[];
}

/** A payable request: a payment is active and quoted. */
export interface PaymentLinkPayRequest extends PaymentLinkRequestBase {
  tag: string;
  callback: string;
  metadata: string;
  minSendable: number;
  maxSendable: number;
  quote: PaymentQuote;
  requestedAmount: PaymentAmount;
}

/**
 * A request without an active payment, e.g. an idle terminal. The link itself is described as
 * usual, and the error fields say why nothing is payable.
 */
export interface PaymentLinkPayTerminal extends PaymentLinkRequestBase {
  error: string;
  message: string;
  statusCode: number;
}

export type PaymentLinkPayResponse = PaymentLinkPayRequest | PaymentLinkPayTerminal;

/** Narrows a pay request response to the quoted variant. */
export function hasPaymentQuote(response: PaymentLinkPayResponse): response is PaymentLinkPayRequest {
  return 'quote' in response;
}

export interface PaymentLinkHistoryPayment {
  id: number;
  externalId?: string;
  note?: string;
  status: PaymentLinkPaymentStatus;
  amount: number;
  currency: string;
  mode: PaymentLinkPaymentMode;
  date: Date;
  expiryDate: Date;
  txCount: number;
  isConfirmed: boolean;
  url: string;
  lnurl: string;
  frontendUrl: string;
}

/** A payment link with its payments, as served by `paymentLink/history`. Carries no single `payment`. */
export interface PaymentLinkHistory extends Omit<PaymentLink, 'payment'> {
  payments: PaymentLinkHistoryPayment[];
  totalCompletedAmount: number;
}

/** Identifies a payment link, or a payment on it. The API needs at least one of these. */
export interface PaymentLinkPaymentQuery {
  linkId?: string;
  externalLinkId?: string;
  externalPaymentId?: string;
  /** Payment link access key, for terminals that hold no session. */
  key?: string;
}

export interface PaymentLinkHistoryQuery {
  externalLinkId?: string;
  key?: string;
  /** Defaults to completed payments only when omitted. */
  status?: PaymentLinkPaymentStatus[];
  /** Defaults to the first day of the current month when omitted. */
  from?: Date;
  /** Defaults to the last day of the current month when omitted. */
  to?: Date;
}

/**
 * Query for the unauthenticated invoice payment endpoint (`GET paymentLink/payment`).
 *
 * From the API `CreateInvoicePaymentDto` validation:
 * - A route identity is required: at least one of `routeId` or `route` (mutually alternative
 *   with short-form `r`, which is not part of this contract).
 * - A payment identity is required: at least one of `externalId` or `message` (mutually
 *   alternative with short-forms `e`/`m`, not part of this contract).
 * - `amount` is required (mutually alternative only with short-form `a`, not in this contract).
 * - `label`, `note`, `currency`, `expiryDate`, `standard`, `webhookUrl` are optional.
 */
export interface PaymentLinkInvoicePaymentQuery {
  routeId?: string;
  route?: string;
  externalId?: string;
  message?: string;
  label?: string;
  note?: string;
  amount: string;
  currency?: string;
  expiryDate?: Date;
  standard?: PaymentStandardType;
  webhookUrl?: string;
}
