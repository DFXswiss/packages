import { Sell, SellUrl, SellPaymentInfo, ConfirmSellData } from '../definitions/sell';
import { Transaction } from '../definitions/transaction';
import { DfxHttpClient } from './DfxHttpClient';

export class SellApi {
  constructor(private readonly http: DfxHttpClient) {}

  async quote(info: SellPaymentInfo): Promise<Sell> {
    return this.http.request<Sell>({ url: SellUrl.quote, method: 'PUT', data: info, token: false });
  }

  async createPaymentInfo(info: SellPaymentInfo, includeTx = false): Promise<Sell> {
    const url = includeTx ? `${SellUrl.receive}?includeTx=true` : SellUrl.receive;
    return this.http.request<Sell>({ url, method: 'PUT', data: info });
  }

  async confirm(id: number, data: ConfirmSellData): Promise<Transaction> {
    return this.http.request<Transaction>({
      url: SellUrl.confirm.replace(':id', id.toString()),
      method: 'PUT',
      data,
    });
  }
}
