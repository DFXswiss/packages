import { Bank, BankUrl } from '../definitions/bank';
import { DfxHttpClient } from './DfxHttpClient';

export class BankApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<Bank[]> {
    return this.http.request<Bank[]>({ url: BankUrl.get, method: 'GET', token: false });
  }
}
