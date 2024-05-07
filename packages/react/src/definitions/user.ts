import { Blockchain } from './blockchain';
import { AccountType, TradingLimit } from './kyc';
import { Language } from './language';
import { TransactionFilterKey } from './transaction';

export const UserUrl = { get: 'user/detail', change: 'user', discountCodes: 'user/discountCodes' };

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
  volume: number;
  credit: number;
  paidCredit: number;
  userCount: number;
  activeUserCount: number;
}

export interface UserAddress {
  wallet: string;
  address: string;
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

export interface User {
  accountType: AccountType;
  mail?: string;
  phone?: string;
  language: Language;
  tradingLimit: TradingLimit;
  kyc: UserKyc;
  volumes: Volumes;
  addresses: UserAddress[];
  activeAddress?: UserAddress;
}
