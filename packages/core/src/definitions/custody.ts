import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { PriceStep } from './price-step';
import { Beneficiary } from './sell';
import { FiatPaymentMethod, TransactionError } from './transaction';

/** Id of the legacy custody account, which has no account row of its own. */
export const LegacyCustodyAccountId = 'legacy';

/**
 * Id of an account that exists as a row. The account management and access endpoints accept only
 * this - passing the legacy marker there is rejected.
 */
export type PersistedCustodyAccountId = number;

/**
 * How a custody account is addressed on the reading endpoints: by id, or by the legacy marker.
 * `CustodyAccount.id` is null for the legacy account, so go through `toCustodyAccountId` rather
 * than passing the raw id along - `custody/account/null/...` is not an endpoint.
 */
export type CustodyAccountId = PersistedCustodyAccountId | typeof LegacyCustodyAccountId;

/** The id to address an account with, taking the legacy account into account. */
export function toCustodyAccountId(account: CustodyAccount): CustodyAccountId {
  return account.isLegacy || account.id === null ? LegacyCustodyAccountId : account.id;
}

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
  updateAccount: (id: PersistedCustodyAccountId) => `custody/account/${id}`,
  accountBalance: (id: CustodyAccountId) => `custody/account/${id}/balance`,
  accountHistory: (id: CustodyAccountId) => `custody/account/${id}/history`,
  accountOrder: (id: CustodyAccountId) => `custody/account/${id}/order`,
  accountPdf: (id: CustodyAccountId) => `custody/account/${id}/pdf`,
  /** Reading the grants needs a persisted id; granting also accepts the legacy marker. */
  accountAccessList: (id: PersistedCustodyAccountId) => `custody/account/${id}/access`,
  accountAccess: (id: CustodyAccountId) => `custody/account/${id}/access`,
  accountAccessById: (id: PersistedCustodyAccountId, accessId: number) => `custody/account/${id}/access/${accessId}`,
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

interface CreateCustodyOrderBase {
  sourceAsset: string;
  targetAsset: string;
  /** Omitted, the API falls back to a bank transfer. */
  paymentMethod?: FiatPaymentMethod;
}

/** Exactly one of the two amounts is given; the other side is priced from it. */
type CustodyOrderAmount =
  | { sourceAmount: number; targetAmount?: never }
  | { sourceAmount?: never; targetAmount: number };

/** A send needs its destination on chain. */
type CreateCustodySendOrder = CreateCustodyOrderBase &
  CustodyOrderAmount & {
    type: CustodyOrderType.SEND;
    targetAddress: string;
    targetBlockchain: Blockchain;
  };

/** A withdrawal needs its destination account. */
type CreateCustodyWithdrawalOrder = CreateCustodyOrderBase &
  CustodyOrderAmount & {
    type: CustodyOrderType.WITHDRAWAL;
    targetIban: string;
  };

type CreateCustodyOtherOrder = CreateCustodyOrderBase &
  CustodyOrderAmount & {
    type: Exclude<CustodyOrderType, CustodyOrderType.SEND | CustodyOrderType.WITHDRAWAL>;
  };

/**
 * A custody order request. Which fields are required depends on the order type - the API rejects a
 * send without a destination, a withdrawal without an IBAN, and any request that carries both
 * amounts or neither.
 */
export type CreateCustodyOrder = CreateCustodySendOrder | CreateCustodyWithdrawalOrder | CreateCustodyOtherOrder;

export interface CustodyPdfQuery {
  currency: CustodyValueCurrency;
  date: Date;
}
