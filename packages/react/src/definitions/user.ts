import { Blockchain } from './blockchain';
import { Fiat } from './fiat';
import { AccountType, TradingLimit } from './kyc';
import { Language } from './language';
import { TransactionFilterKey } from './transaction';

export const UserUrl = {
  get: 'user',
  ref: 'user/ref',
  delete: 'user',
  change: 'user',
  addresses: 'user/addresses',
  apiKey: 'user/apiKey',
  apiFilter: 'user/apiFilter',
  changeAddress: 'user/change',
  discountCodes: 'user/discountCodes',
};

export enum UserStatus {
  NA = 'NA',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
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
}

export interface UserKyc {
  hash: string;
  level: number;
  dataComplete: boolean;
}

export interface UserPaymentLink {
  active: boolean;
}

export interface User {
  accountId: number;
  accountType: AccountType;
  mail?: string;
  phone?: string;
  language: Language;
  currency: Fiat;
  tradingLimit: TradingLimit;
  kyc: UserKyc;
  volumes: Volumes;
  addresses: UserAddress[];
  activeAddress?: UserAddress;
  paymentLink: UserPaymentLink;
}

export interface UpdateUser {
  mail?: string;
  phone?: string;
  language?: Language;
  currency?: Fiat;
}

export interface ApiKey {
  key: string;
  secret: string;
}
