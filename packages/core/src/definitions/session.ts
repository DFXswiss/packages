import { Blockchain } from './blockchain';
import { UserRole } from './jwt';

export interface Session {
  address?: string;
  user?: number;
  account: number;
  role: UserRole;
  blockchains: Blockchain[];
}
