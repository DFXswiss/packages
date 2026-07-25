import { Bank, BankUrl, ReceiveIbanCheck } from '../definitions/bank';
import { DfxHttpClient } from './DfxHttpClient';

export class BankApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(): Promise<Bank[]> {
    return this.http.request<Bank[]>({ url: BankUrl.get, method: 'GET', token: false });
  }

  async checkReceiveIban(iban: string): Promise<ReceiveIbanCheck> {
    return this.http.request<ReceiveIbanCheck>({ url: BankUrl.receiveIban, method: 'PUT', data: { iban } });
  }
}
