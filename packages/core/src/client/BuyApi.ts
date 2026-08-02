import { Buy, BuyUrl, BuyPaymentInfo, CreateVirtualIban, PdfDocument, VirtualIban } from '../definitions/buy';
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

  /** Personal IBANs of the authenticated account, across all currencies. */
  async getPersonalIbans(): Promise<VirtualIban[]> {
    return this.http.request<VirtualIban[]>({ url: BuyUrl.personalIban, method: 'GET' });
  }

  /**
   * Issues a personal IBAN for the authenticated account.
   *
   * The API requires a KYC level of at least 50 and rejects unsupported currencies; both arrive as an
   * ApiException, never as a VirtualIban.
   */
  async createPersonalIban(data: CreateVirtualIban): Promise<VirtualIban> {
    return this.http.request<VirtualIban>({ url: BuyUrl.personalIban, method: 'POST', data });
  }
}
