import { Buy, BuyUrl, BuyPaymentInfo, PdfDocument } from '../definitions/buy';
import { DfxHttpClient } from './DfxHttpClient';

export class BuyApi {
  constructor(private readonly http: DfxHttpClient) {}

  async quote(info: BuyPaymentInfo): Promise<Buy> {
    return this.http.request<Buy>({ url: BuyUrl.quote, method: 'PUT', data: info, token: false });
  }

  async createPaymentInfo(info: BuyPaymentInfo): Promise<Buy> {
    return this.http.request<Buy>({ url: BuyUrl.receive, method: 'PUT', data: info });
  }

  async getInvoice(txId: number): Promise<PdfDocument> {
    return this.http.request<PdfDocument>({ url: BuyUrl.invoice(txId), method: 'PUT' });
  }

  async confirm(txId: number): Promise<void> {
    return this.http.request<void>({ url: BuyUrl.confirm(txId), method: 'PUT' });
  }
}
