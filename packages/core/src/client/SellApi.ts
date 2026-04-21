import { Sell, SellUrl, SellPaymentInfo, ConfirmSellData } from '../definitions/sell';
import { Transaction } from '../definitions/transaction';
import { Utils } from '../utils';
import { DfxHttpClient } from './DfxHttpClient';

export class SellApi {
  constructor(private readonly http: DfxHttpClient) {}

  async quote(info: SellPaymentInfo): Promise<Sell> {
    return this.http.request<Sell>({ url: SellUrl.quote, method: 'PUT', data: info, token: false });
  }

  async createPaymentInfo(info: SellPaymentInfo, includeTx = false): Promise<Sell> {
    const query = Utils.buildQuery({ includeTx: includeTx || undefined });
    const url = `${SellUrl.receive}${query}`;
    return this.http.request<Sell>({ url, method: 'PUT', data: info });
  }

  async confirm(id: number, data: ConfirmSellData): Promise<Transaction> {
    return this.http.request<Transaction>({
      url: SellUrl.confirm(id),
      method: 'PUT',
      data,
    });
  }
}
