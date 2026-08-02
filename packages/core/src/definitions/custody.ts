import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { PriceStep } from './price-step';
import { Beneficiary } from './sell';
import { FiatPaymentMethod, TransactionError } from './transaction';

/** Id of the legacy custody account, which has no account row of its own. */
export const LegacyCustodyAccountId = 'legacy';

/** A custody account is addressed by its id, or by the legacy marker. */
export type CustodyAccountId = number | typeof LegacyCustodyAccountId;

export const CustodyUrl = {
  /** POST: signs the account up for custody and returns a custody access token. */
  signup: 'custody',
  /** GET: balances of the caller's own custody account. */
  balance: 'custody',
  history: 'custody/history',
  pdf: 'custody/pdf',
  order: 'custody/order',
  confirmOrder: (orderId: number) => `custody/order/${orderId}/confirm`,
  account: 'custody/account',
  accountById: (id: CustodyAccountId) => `custody/account/${id}`,
  accountBalance: (id: CustodyAccountId) => `custody/account/${id}/balance`,
  accountHistory: (id: CustodyAccountId) => `custody/account/${id}/history`,
  accountOrder: (id: CustodyAccountId) => `custody/account/${id}/order`,
  accountPdf: (id: CustodyAccountId) => `custody/account/${id}/pdf`,
  accountAccess: (id: CustodyAccountId) => `custody/account/${id}/access`,
  accountAccessById: (id: CustodyAccountId, accessId: number) => `custody/account/${id}/access/${accessId}`,
};

export enum CustodyAddressType {
  EVM = 'EVM',
}

export enum CustodyAccessLevel {
  READ = 'Read',
  WRITE = 'Write',
}

export enum CustodyOrderType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  RECEIVE = 'Receive',
  SEND = 'Send',
  SWAP = 'Swap',
  EQUITY_MINT = 'EquityMint',
  EQUITY_REDEEM = 'EquityRedeem',
  SAVING_DEPOSIT = 'SavingDeposit',
  SAVING_WITHDRAWAL = 'SavingWithdrawal',
}

export enum CustodyOrderStatus {
  CREATED = 'Created',
  CONFIRMED = 'Confirmed',
  APPROVED = 'Approved',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

/** Coarser than CustodyOrderStatus: the states an order reports in its history. */
export enum CustodyOrderHistoryStatus {
  WAITING_FOR_PAYMENT = 'WaitingForPayment',
  CHECK_PENDING = 'CheckPending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

/** The currencies custody balances and reports are valued in. */
export enum CustodyValueCurrency {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
}

export interface CustodyAuth {
  accessToken: string;
}

export interface CustodySignup {
  addressType: CustodyAddressType;
  wallet?: string;
  usedRef?: string;
  specialCode?: string;
  moderator?: string;
}

export interface CustodyUser {
  id: number;
}

export interface CustodyAccount {
  /** Null for the legacy account, which aggregates the custody users and has no account row. */
  id: number | null;
  title: string;
  description?: string;
  isLegacy: boolean;
  accessLevel: CustodyAccessLevel;
  /** True when the caller owns the account rather than having been granted access to it. */
  isOwner: boolean;
  owner?: CustodyUser;
}

export interface CreateCustodyAccount {
  title: string;
  description?: string;
}

export interface UpdateCustodyAccount {
  title?: string;
  description?: string;
}

export interface CustodyAccountAccess {
  id: number;
  user: CustodyUser;
  accessLevel: CustodyAccessLevel;
}

export interface CreateCustodyAccountAccess {
  mail: string;
  accessLevel: CustodyAccessLevel;
}

export interface UpdateCustodyAccountAccess {
  accessLevel: CustodyAccessLevel;
}

export interface CustodyAsset {
  name: string;
  description: string;
}

/** The same value expressed in each supported currency. */
export interface CustodyFiatValue {
  chf: number;
  eur: number;
  usd: number;
}

export interface CustodyAssetBalance {
  asset: CustodyAsset;
  balance: number;
  value: CustodyFiatValue;
  /**
   * Accrued interest in asset units, only present for interest-bearing positions. Already part of
   * `balance` - a breakdown of it, never an amount to add on top.
   */
  interest?: number;
  /** Fiat value of `interest`, already part of `value` on the same terms. */
  interestValue?: CustodyFiatValue;
}

export interface CustodyBalance {
  totalValue: CustodyFiatValue;
  balances: CustodyAssetBalance[];
}

export interface CustodyHistoryEntry {
  date: Date;
  value: CustodyFiatValue;
}

export interface CustodyHistory {
  totalValue: CustodyHistoryEntry[];
}

export interface CustodyOrderHistory {
  type: CustodyOrderType;
  status: CustodyOrderHistoryStatus;
  created: Date;
  /** Valuta timestamp, set once the order is completed. */
  completedAt?: Date;
  inputAmount?: number;
  inputAsset?: string;
  outputAmount?: number;
  outputAsset?: string;
}

/** Bank details for a custody order that is paid by bank transfer. */
export interface CustodyOrderBuyInfo {
  remittanceInfo?: string;
  paymentLink?: string;
  name?: string;
  bank?: string;
  street?: string;
  number?: string;
  zip?: string;
  city?: string;
  country?: string;
  iban?: string;
  bic?: string;
  sepaInstant?: boolean;
}

export interface CustodyOrderPaymentInfo {
  id: number;
  uid?: string;
  timestamp: Date;
  minVolume: number;
  maxVolume: number;
  amount: number;
  sourceAsset: string;
  targetAsset: string;
  fees: Fees;
  feesTarget: Fees;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  exchangeRate: number;
  rate: number;
  priceSteps: PriceStep[];
  estimatedAmount: number;
  paymentRequest?: string;
  isValid: boolean;
  /** Set when isValid is false. */
  error?: TransactionError;
  /** Withdrawals and sends: where the funds go. */
  beneficiary?: Beneficiary;
  /** Deposits: how to pay in. */
  buyInfos?: CustodyOrderBuyInfo;
}

export interface CustodyOrder {
  type: CustodyOrderType;
  orderId: number;
  status: CustodyOrderStatus;
  paymentInfo: CustodyOrderPaymentInfo;
}

export interface CreateCustodyOrder {
  type: CustodyOrderType;
  sourceAsset: string;
  targetAsset: string;
  sourceAmount?: number;
  targetAmount?: number;
  targetAddress?: string;
  targetBlockchain?: Blockchain;
  targetIban?: string;
  /** Defaults to a bank transfer on the API side. */
  paymentMethod?: FiatPaymentMethod;
}

export interface CustodyPdfQuery {
  currency: CustodyValueCurrency;
  date: Date;
}
