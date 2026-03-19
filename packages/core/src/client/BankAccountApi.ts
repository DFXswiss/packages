import { BankAccount, BankAccountUrl } from '../definitions/bank-account';
import { Fiat } from '../definitions/fiat';
import { DfxHttpClient } from './DfxHttpClient';

export interface CreateBankAccount {
  iban: string;
  label?: string;
  preferredCurrency?: Fiat;
}

export interface UpdateBankAccount {
  label?: string;
  preferredCurrency?: Fiat;
  active?: boolean;
  default?: boolean;
}

export class BankAccountApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<BankAccount[]> {
    return this.http.request<BankAccount[]>({ url: BankAccountUrl.get, method: 'GET' });
  }

  async create(data: CreateBankAccount): Promise<BankAccount> {
    return this.http.request<BankAccount>({ url: BankAccountUrl.create, method: 'POST', data });
  }

  async update(id: number, data: UpdateBankAccount): Promise<BankAccount> {
    return this.http.request<BankAccount>({ url: BankAccountUrl.update(id), method: 'PUT', data });
  }
}
