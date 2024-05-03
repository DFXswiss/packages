import { Blockchain } from './blockchain';
import { UserRole } from './jwt';

export interface Session {
  address?: string;
  id?: number;
  account: number;
  role: UserRole;
  blockchains: Blockchain[];
}
