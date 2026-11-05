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
  CUSTODY = 'Custody',
  REALUNIT = 'RealUnit',
  MARKETING = 'Marketing',
  MONITORING = 'Monitoring',
}

export interface Jwt {
  exp: number;
  iat: number;
  address: string;
  user: number;
  account: number;
  role: UserRole;
  blockchains: Blockchain[];
  /** Passkey credential id; only on tokens minted by a passkey ceremony or obtained from one. */
  passkeyCredential?: number;
  /** Unix seconds of the authentication that started this session; forwarded on every re-mint. */
  authTime?: number;
}
