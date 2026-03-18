import {
  PaymentLinksUrl,
  PaymentLink,
  CreatePaymentLink,
  UpdatePaymentLink,
  AssignPaymentLink,
  CreatePaymentLinkPayment,
  PaymentLinkRecipient,
  PaymentLinkConfig,
  UpdatePaymentLinkConfig,
  PaymentLinkPos,
} from '../definitions/route';
import { CustomFile } from '../definitions/file';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

export class PaymentLinksApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(params?: { linkId?: string; externalLinkId?: string }): Promise<PaymentLink[]> {
    const queryParts: string[] = [];
    if (params?.linkId) queryParts.push(`linkId=${params.linkId}`);
    if (params?.externalLinkId) queryParts.push(`externalLinkId=${params.externalLinkId}`);
    const query = queryParts.length ? `?${queryParts.join('&')}` : '';
    return this.http.request<PaymentLink[]>({ url: `${PaymentLinksUrl.get}${query}`, method: 'GET' });
  }

  async create(data: CreatePaymentLink): Promise<PaymentLink> {
    return this.http.request<PaymentLink>({ url: PaymentLinksUrl.create, method: 'POST', data });
  }

  async update(params: Record<string, string>, data: UpdatePaymentLink): Promise<PaymentLink> {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.update}?${query}`, method: 'PUT', data });
  }

  async assign(params: Record<string, string>, data: AssignPaymentLink): Promise<PaymentLink> {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.assign}?${query}`, method: 'PUT', data });
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
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.payment}?${query}`, method: 'POST', data });
  }

  async cancelPayment(params: Record<string, string>): Promise<PaymentLink> {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<PaymentLink>({ url: `${PaymentLinksUrl.payment}?${query}`, method: 'DELETE' });
  }

  async getStickers(params: Record<string, string>): Promise<CustomFile> {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<CustomFile>({
      url: `${PaymentLinksUrl.stickers}?${query}`,
      method: 'GET',
      responseType: ResponseType.BLOB,
    });
  }

  async createPos(params: Record<string, string>): Promise<PaymentLinkPos> {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return this.http.request<PaymentLinkPos>({ url: `${PaymentLinksUrl.pos}?${query}`, method: 'PUT' });
  }
}
