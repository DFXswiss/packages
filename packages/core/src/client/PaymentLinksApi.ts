import {
  PaymentLinksUrl,
  PaymentLink,
  CreatePaymentLink,
  UpdatePaymentLink,
  AssignPaymentLink,
  CreatePaymentLinkPayment,
  PaymentLinkHistory,
  PaymentLinkHistoryQuery,
  PaymentLinkInvoicePaymentQuery,
  PaymentLinkPaymentQuery,
  PaymentLinkPayResponse,
  PaymentLinkRecipient,
  PaymentLinkConfig,
  UpdatePaymentLinkConfig,
  PaymentLinkPos,
  PaymentStandard,
  PaymentStandardType,
} from '../definitions/route';
import { CustomFile } from '../definitions/file';
import { Utils } from '../utils';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

export class PaymentLinksApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(params?: {
    linkId?: string;
    externalLinkId?: string;
    externalPaymentId?: string;
  }): Promise<PaymentLink | PaymentLink[]> {
    const query = Utils.buildQuery(params ?? {});
    return this.http.request<PaymentLink | PaymentLink[]>({ url: `${PaymentLinksUrl.get}${query}`, method: 'GET' });
  }

  async create(data: CreatePaymentLink): Promise<PaymentLink> {
    return this.http.request<PaymentLink>({ url: PaymentLinksUrl.create, method: 'POST', data });
  }

  async update(params: Record<string, string>, data: UpdatePaymentLink): Promise<PaymentLink> {
    const query = Utils.buildQuery(params);
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.update}${query}`, method: 'PUT', data });
  }

  async assign(params: Record<string, string>, data: AssignPaymentLink): Promise<PaymentLink> {
    const query = Utils.buildQuery(params);
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.assign}${query}`, method: 'PUT', data });
  }

  async getRecipient(route: string): Promise<PaymentLinkRecipient> {
    return this.http.request<PaymentLinkRecipient>({ url: PaymentLinksUrl.recipient(route), method: 'GET' });
  }

  async getConfig(): Promise<PaymentLinkConfig> {
    return this.http.request<PaymentLinkConfig>({ url: PaymentLinksUrl.userPaymentLinksConfig, method: 'GET' });
  }

  async updateConfig(data: UpdatePaymentLinkConfig): Promise<PaymentLinkConfig> {
    return this.http.request<PaymentLinkConfig>({ url: PaymentLinksUrl.userPaymentLinksConfig, method: 'PUT', data });
  }

  async createPayment(params: Record<string, string>, data: CreatePaymentLinkPayment): Promise<PaymentLink> {
    const query = Utils.buildQuery(params);
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.payment}${query}`, method: 'POST', data });
  }

  async cancelPayment(params: Record<string, string>): Promise<PaymentLink> {
    const query = Utils.buildQuery(params);
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.payment}${query}`, method: 'DELETE' });
  }

  async getStickers(params: Record<string, string>): Promise<CustomFile> {
    const query = Utils.buildQuery(params);
    return this.http.request<CustomFile>({
      url: `${PaymentLinksUrl.stickers}${query}`,
      method: 'GET',
      responseType: ResponseType.BLOB,
    });
  }

  async createPos(params: Record<string, string>): Promise<PaymentLinkPos> {
    const query = Utils.buildQuery(params);
    return this.http.request<PaymentLinkPos>({ url: `${PaymentLinksUrl.pos}${query}`, method: 'PUT' });
  }

  /** The payment standards the API supports. Public - no session needed. */
  async getStandards(): Promise<PaymentStandard[]> {
    return this.http.request<PaymentStandard[]>({ url: PaymentLinksUrl.standard, method: 'GET', token: false });
  }

  async getStandard(id: PaymentStandardType): Promise<PaymentStandard> {
    return this.http.request<PaymentStandard>({
      url: PaymentLinksUrl.standardById(id),
      method: 'GET',
      token: false,
    });
  }

  /**
   * Long-polls until the payment reaches a final state, then returns the link with that payment.
   *
   * The request stays open for as long as the API keeps it open, and it resolves on a timeout as
   * well - read the returned status instead of assuming the payment moved.
   */
  async waitForPayment(params: PaymentLinkPaymentQuery): Promise<PaymentLink> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.paymentWait}${query}`, method: 'GET' });
  }

  async confirmPayment(params: PaymentLinkPaymentQuery): Promise<PaymentLink> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.paymentConfirm}${query}`, method: 'PUT' });
  }

  /** Payments of a link within a period. Without `status` the API returns completed payments only. */
  async getHistory(params: PaymentLinkHistoryQuery): Promise<PaymentLinkHistory[]> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PaymentLinkHistory[]>({ url: `${PaymentLinksUrl.history}${query}`, method: 'GET' });
  }

  /**
   * Creates or loads an invoice payment. Public - no session needed.
   *
   * Returns a quoted pay request when a payment is active, or a terminal error payload when not.
   */
  async getInvoicePayment(params: PaymentLinkInvoicePaymentQuery): Promise<PaymentLinkPayResponse> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PaymentLinkPayResponse>({
      url: `${PaymentLinksUrl.payment}${query}`,
      method: 'GET',
      token: false,
    });
  }
}
