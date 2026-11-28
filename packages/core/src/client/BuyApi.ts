import { Buy, BuyUrl, BuyPaymentInfo, PdfDocument, SimulateBankPayment, VirtualIban } from '../definitions/buy';
import { Utils } from '../utils';
import { DfxHttpClient } from './DfxHttpClient';

export class BuyApi {
  constructor(private readonly http: DfxHttpClient) {}

  async quote(info: BuyPaymentInfo): Promise<Buy> {
    return this.http.request<Buy>({ url: BuyUrl.quote, method: 'PUT', data: info, token: false });
  }

  async createPaymentInfo(info: BuyPaymentInfo): Promise<Buy> {
    return this.http.request<Buy>({ url: BuyUrl.receive, method: 'PUT', data: info });
  }

  async getPersonalIbans(): Promise<VirtualIban[]> {
    return this.http.request<VirtualIban[]>({ url: BuyUrl.personalIban, method: 'GET' });
  }

  async getInvoice(txId: number, collectionAccount = false): Promise<PdfDocument> {
    const query = Utils.buildQuery({ collectionAccount: collectionAccount || undefined });
    return this.http.request<PdfDocument>({ url: `${BuyUrl.invoice(txId)}${query}`, method: 'PUT' });
  }

  async confirm(txId: number): Promise<void> {
    return this.http.request<void>({ url: BuyUrl.confirm(txId), method: 'PUT' });
  }

  /** Simulates an incoming bank payment for buy route `buyRouteId` (DFX customer session; DEV, LOC, STG only). */
  async simulatePayment(buyRouteId: number, payment: SimulateBankPayment): Promise<void> {
    return this.http.request<void>({ url: BuyUrl.simulatePayment(buyRouteId), method: 'PUT', data: payment });
  }
}
