import { Blockchain } from './blockchain';
import { Country } from './country';
import { Fiat } from './fiat';
import { AccountType, TradingLimit } from './kyc';
import { Language } from './language';
import { TransactionFilterKey } from './transaction';

export const UserUrl = {
  get: 'user',
  ref: 'user/ref',
  delete: 'user',
  update: 'user',
  updateMail: 'user/mail',
  verifyMail: 'user/mail/verify',
  addresses: 'user/addresses',
  apiKey: 'user/apiKey',
  apiFilter: 'user/apiFilter',
  changeAddress: 'user/change',
  reactivate: 'user/reactivate',
  specialCodes: 'user/specialCodes',
  profile: 'user/profile',
};

export enum UserStatus {
  NA = 'NA',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted',
}

export enum PhoneCallTime {
  H_9_TO_10 = 'H9To10',
  H_10_TO_11 = 'H10To11',
  H_11_TO_12 = 'H11To12',
  H_12_TO_13 = 'H12To13',
  H_13_TO_14 = 'H13To14',
  H_14_TO_15 = 'H14To15',
  H_15_TO_16 = 'H15To16',
  H_9_TO_16 = 'H9To16',
}

export enum PhoneCallStatus {
  UNAVAILABLE = 'Unavailable',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REPEAT = 'Repeat',
  USER_REJECTED = 'UserRejected',
  SUSPICIOUS = 'Suspicious',
  MANUAL_CHECK = 'ManualCheck',
}

export interface VolumeInformation {
  total: number;
  annual: number;
}

export interface Volumes {
  buy: VolumeInformation;
  sell: VolumeInformation;
  swap: VolumeInformation;
}

export interface Referral {
  code?: string;
  commission: number;
  volume: number;
  credit: number;
  paidCredit: number;
  userCount: number;
  activeUserCount: number;
}

export interface UserAddress {
  wallet: string;
  label?: string;
  address: string;
  explorerUrl?: string;
  blockchains: Blockchain[];
  volumes: Volumes;
  refCode?: string;
  apiKeyCT?: string;
  apiFilterCT?: TransactionFilterKey[];
  isCustody: boolean;
  status: UserStatus;
}

export interface UserKyc {
  hash: string;
  level: number;
  dataComplete: boolean;
  preferredPhoneTimes: PhoneCallTime[];
  phoneCallAccepted?: boolean;
  phoneCallStatus?: PhoneCallStatus;
}

export interface UserPaymentLink {
  active: boolean;
}

/** The single prerequisite blocking a capability. Present when `available` is false. */
export enum MissingPrerequisite {
  EMAIL = 'Email',
  KYC = 'Kyc',
}

/** Gate for creating a support ticket. */
export interface CreateSupportTicketCapability {
  available: boolean;
  missingPrerequisite?: MissingPrerequisite;
}

/**
 * Whether the active address may trade at the account's current KYC level. `available: false` means no amount is
 * tradable until the missing prerequisite is met, so the trading limit must not be presented as usable.
 */
export interface TradeCapability {
  available: boolean;
  missingPrerequisite?: MissingPrerequisite;
}

/**
 * Per-action capability flags. Clients render UI affordances from this object instead of inferring them from KYC
 * step status.
 */
export interface UserCapabilities {
  canEditName: boolean;
  canEditMail: boolean;
  canEditPhone: boolean;
  canEditAddress: boolean;
  createSupportTicket?: CreateSupportTicketCapability;
  trade?: TradeCapability;
}

export interface User {
  accountId: number;
  accountType: AccountType;
  mail?: string;
  phone?: string;
  language: Language;
  currency: Fiat;
  tradingLimit: TradingLimit;
  /**
   * Per-action capability flags. Clients render UI affordances from this object instead of inferring them from KYC
   * step status. Absent when the client is pinned to an API version that does not emit them.
   */
  capabilities?: UserCapabilities;
  kyc: UserKyc;
  volumes: Volumes;
  addresses: UserAddress[];
  disabledAddresses: UserAddress[];
  activeAddress?: UserAddress;
  paymentLink: UserPaymentLink;
  apiKeyCT: string;
  apiFilterCT: TransactionFilterKey[];
}

export interface UpdateUser {
  phone?: string;
  language?: Language;
  currency?: Fiat;
  preferredPhoneTimes?: PhoneCallTime[];
  acceptCall?: boolean;
}

export interface ApiKey {
  key: string;
  secret: string;
}

export interface UserAddressInfo {
  street?: string;
  houseNumber?: string;
  city?: string;
  zip?: string;
  country?: Country;
}

export interface UserProfile {
  accountType?: AccountType;
  firstName?: string;
  lastName?: string;
  mail?: string;
  phone?: string;
  address?: UserAddressInfo;
  organizationName?: string;
}
