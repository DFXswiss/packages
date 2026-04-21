import { Swap, SwapUrl, SwapPaymentInfo, ConfirmSwapData } from '../definitions/swap';
import { Transaction } from '../definitions/transaction';
import { DfxHttpClient } from './DfxHttpClient';

export class SwapApi {
  constructor(private readonly http: DfxHttpClient) {}

  async quote(info: SwapPaymentInfo): Promise<Swap> {
    return this.http.request<Swap>({ url: SwapUrl.quote, method: 'PUT', data: info, token: false });
  }

  async createPaymentInfo(info: SwapPaymentInfo, includeTx = false): Promise<Swap> {
    const url = includeTx ? `${SwapUrl.receive}?includeTx=true` : SwapUrl.receive;
    return this.http.request<Swap>({ url, method: 'PUT', data: info });
  }

  async confirm(id: number, data: ConfirmSwapData): Promise<Transaction> {
    return this.http.request<Transaction>({
      url: SwapUrl.confirm(id),
      method: 'POST',
      data,
    });
  }
}
