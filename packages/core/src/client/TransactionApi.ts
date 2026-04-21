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
import { Utils } from '../utils';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

export class TransactionApi {
  constructor(private readonly http: DfxHttpClient) {}

  async list(userAddress?: string): Promise<Transaction[]> {
    const query = Utils.buildQuery({ userAddress });
    return this.http.request<Transaction[]>({ url: `${TransactionUrl.get}${query}`, method: 'GET' });
  }

  async getDetail(from?: string, to?: string): Promise<DetailTransaction[]> {
    const query = Utils.buildQuery({ from, to });
    return this.http.request<DetailTransaction[]>({ url: `${TransactionUrl.detail}${query}`, method: 'GET' });
  }

  async getSingle(params: { uid?: string; ckoId?: string; requestId?: string }): Promise<Transaction> {
    const query = Utils.buildQuery({
      uid: params.uid,
      'cko-id': params.ckoId,
      'request-id': params.requestId,
    });
    return this.http.request<Transaction>({
      url: `${TransactionUrl.single}${query}`,
      method: 'GET',
    });
  }

  async exportCsv(query: TransactionHistoryQuery): Promise<string> {
    const queryStr = this.buildFilterQuery(query);
    return this.http.request<string>({
      url: `${TransactionUrl.csv}${queryStr}`,
      method: 'PUT',
      responseType: ResponseType.TEXT,
    });
  }

  async getHistory(type: string, query: TransactionHistoryQuery): Promise<string> {
    const queryStr = this.buildFilterQuery(query);
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
    const query = Utils.buildQuery({ buyId });
    return this.http.request({ url: `${TransactionUrl.setTarget(id)}${query}`, method: 'PUT' });
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

  private buildFilterQuery(query: TransactionHistoryQuery): string {
    return Utils.buildQuery({
      userAddress: query.userAddress,
      from: query.from,
      to: query.to,
      format: query.format,
      buy: query.buy,
      sell: query.sell,
      staking: query.staking,
      ref: query.ref,
      lm: query.lm,
    });
  }
}
