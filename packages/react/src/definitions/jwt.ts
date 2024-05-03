import { Blockchain } from './blockchain';

export enum UserRole {
  ACCOUNT = 'Account',
  USER = 'User',
  VIP = 'VIP',
  BETA = 'Beta',
  ADMIN = 'Admin',
  SUPPORT = 'Support',
  COMPLIANCE = 'Compliance',
  KYC_CLIENT_COMPANY = 'KycClientCompany',
}

export interface Jwt {
  exp: number;
  iat: number;
  address: string;
  id: number;
  account: number;
  role: UserRole;
  blockchains: Blockchain[];
}
