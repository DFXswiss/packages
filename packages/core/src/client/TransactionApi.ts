import {
  TransactionUrl,
  Transaction,
  DetailTransaction,
  UnassignedTransaction,
  TransactionTarget,
  TransactionRefundData,
  TransactionRefundTarget,
  TransactionHistoryQuery,
} from '../definitions/transaction';
import { PdfDocument } from '../definitions/buy';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

export class TransactionApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(userAddress?: string): Promise<Transaction[]> {
    const query = userAddress ? `?userAddress=${encodeURIComponent(userAddress)}` : '';
    return this.http.request<Transaction[]>({ url: `${TransactionUrl.get}${query}`, method: 'GET' });
  }

  async getDetail(from?: string, to?: string): Promise<DetailTransaction[]> {
    const params: string[] = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.request<DetailTransaction[]>({ url: `${TransactionUrl.detail}${query}`, method: 'GET' });
  }

  async getSingle(params: { uid?: string; ckoId?: string; requestId?: string }): Promise<Transaction> {
    const queryParts: string[] = [];
    if (params.uid) queryParts.push(`uid=${params.uid}`);
    if (params.ckoId) queryParts.push(`cko-id=${params.ckoId}`);
    if (params.requestId) queryParts.push(`request-id=${params.requestId}`);
    const queryStr = queryParts.length ? `?${queryParts.join('&')}` : '';
    return this.http.request<Transaction>({
      url: `${TransactionUrl.single}${queryStr}`,
      method: 'GET',
    });
  }

  async exportCsv(query: TransactionHistoryQuery): Promise<string> {
    const params = this.buildFilterParams(query);
    const queryStr = params ? `?${params}` : '';
    return this.http.request<string>({
      url: `${TransactionUrl.csv}${queryStr}`,
      method: 'PUT',
      responseType: ResponseType.TEXT,
    });
  }

  async getHistory(type: string, query: TransactionHistoryQuery): Promise<string> {
    const params = this.buildFilterParams(query);
    const queryStr = params ? `?${params}` : '';
    return this.http.request<string>({
      url: `transaction/${type}${queryStr}`,
      method: 'GET',
      responseType: ResponseType.TEXT,
    });
  }

  async getUnassigned(): Promise<UnassignedTransaction[]> {
    return this.http.request<UnassignedTransaction[]>({ url: TransactionUrl.unassigned, method: 'GET' });
  }

  async getTargets(): Promise<TransactionTarget[]> {
    return this.http.request<TransactionTarget[]>({ url: TransactionUrl.target, method: 'GET' });
  }

  async setTarget(id: number, buyId: number): Promise<void> {
    return this.http.request({ url: `${TransactionUrl.setTarget(id)}?buyId=${buyId}`, method: 'PUT' });
  }

  async getInvoice(id: number | string): Promise<PdfDocument> {
    return this.http.request<PdfDocument>({ url: TransactionUrl.invoice(id), method: 'PUT' });
  }

  async getReceipt(id: number): Promise<PdfDocument> {
    return this.http.request<PdfDocument>({ url: TransactionUrl.receipt(id), method: 'PUT' });
  }

  async getRefund(id: number): Promise<TransactionRefundData> {
    return this.http.request<TransactionRefundData>({ url: TransactionUrl.refund(id), method: 'GET' });
  }

  async setRefundTarget(id: number, data: TransactionRefundTarget): Promise<void> {
    return this.http.request({ url: TransactionUrl.refund(id), method: 'PUT', data });
  }

  private buildFilterParams(query: TransactionHistoryQuery): string {
    const params: string[] = [];
    if (query.userAddress) params.push(`userAddress=${encodeURIComponent(query.userAddress)}`);
    if (query.from) params.push(`from=${query.from instanceof Date ? query.from.toISOString() : query.from}`);
    if (query.to) params.push(`to=${query.to instanceof Date ? query.to.toISOString() : query.to}`);
    if (query.format) params.push(`format=${query.format}`);
    if (query.buy !== undefined) params.push(`buy=${query.buy}`);
    if (query.sell !== undefined) params.push(`sell=${query.sell}`);
    if (query.staking !== undefined) params.push(`staking=${query.staking}`);
    if (query.ref !== undefined) params.push(`ref=${query.ref}`);
    if (query.lm !== undefined) params.push(`lm=${query.lm}`);
    return params.join('&');
  }
}
