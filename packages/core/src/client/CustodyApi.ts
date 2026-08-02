import { PdfDocument } from '../definitions/buy';
import {
  CreateCustodyAccount,
  CreateCustodyAccountAccess,
  CreateCustodyOrder,
  CustodyAccount,
  CustodyAccountAccess,
  CustodyAccountId,
  CustodyAuth,
  CustodyBalance,
  CustodyHistory,
  CustodyOrder,
  CustodyOrderHistory,
  CustodyPdfQuery,
  CustodySignup,
  CustodyUrl,
  UpdateCustodyAccount,
  UpdateCustodyAccountAccess,
} from '../definitions/custody';
import { Utils } from '../utils';
import { DfxHttpClient } from './DfxHttpClient';

export class CustodyApi {
  constructor(private readonly http: DfxHttpClient) {}

  /**
   * Signs the account up for custody and returns a custody access token.
   *
   * That token addresses the custody address, not the address the caller signed in with. Order
   * calls need it; keep it next to the session token rather than replacing it.
   */
  async signup(data: CustodySignup): Promise<CustodyAuth> {
    return this.http.request<CustodyAuth>({ url: CustodyUrl.signup, method: 'POST', data });
  }

  /** Custody accounts the caller owns or has been granted access to, including the legacy one. */
  async listAccounts(): Promise<CustodyAccount[]> {
    return this.http.request<CustodyAccount[]>({ url: CustodyUrl.account, method: 'GET' });
  }

  async getAccount(id: CustodyAccountId): Promise<CustodyAccount> {
    return this.http.request<CustodyAccount>({ url: CustodyUrl.accountById(id), method: 'GET' });
  }

  async createAccount(data: CreateCustodyAccount): Promise<CustodyAccount> {
    return this.http.request<CustodyAccount>({ url: CustodyUrl.account, method: 'POST', data });
  }

  async updateAccount(id: CustodyAccountId, data: UpdateCustodyAccount): Promise<CustodyAccount> {
    return this.http.request<CustodyAccount>({ url: CustodyUrl.accountById(id), method: 'PUT', data });
  }

  /** Balances of the caller's own custody account. For a specific account use getAccountBalance. */
  async getBalance(): Promise<CustodyBalance> {
    return this.http.request<CustodyBalance>({ url: CustodyUrl.balance, method: 'GET' });
  }

  async getAccountBalance(id: CustodyAccountId): Promise<CustodyBalance> {
    return this.http.request<CustodyBalance>({ url: CustodyUrl.accountBalance(id), method: 'GET' });
  }

  async getHistory(): Promise<CustodyHistory> {
    return this.http.request<CustodyHistory>({ url: CustodyUrl.history, method: 'GET' });
  }

  async getAccountHistory(id: CustodyAccountId): Promise<CustodyHistory> {
    return this.http.request<CustodyHistory>({ url: CustodyUrl.accountHistory(id), method: 'GET' });
  }

  async getOrders(): Promise<CustodyOrderHistory[]> {
    return this.http.request<CustodyOrderHistory[]>({ url: CustodyUrl.order, method: 'GET' });
  }

  async getAccountOrders(id: CustodyAccountId): Promise<CustodyOrderHistory[]> {
    return this.http.request<CustodyOrderHistory[]>({ url: CustodyUrl.accountOrder(id), method: 'GET' });
  }

  /**
   * Quotes an order and reserves it. Nothing moves until the order is confirmed.
   *
   * Needs the custody token from signup, not the session token; pass it as `token`.
   */
  async createOrder(data: CreateCustodyOrder, token?: string): Promise<CustodyOrder> {
    return this.http.request<CustodyOrder>({ url: CustodyUrl.order, method: 'POST', data, token });
  }

  /** Confirms a quoted order. Needs the custody token, like createOrder. */
  async confirmOrder(orderId: number, token?: string): Promise<void> {
    return this.http.request<void>({ url: CustodyUrl.confirmOrder(orderId), method: 'POST', token });
  }

  /** Balance report of the caller's own custody account, as a base64 encoded PDF. */
  async getPdf(params: CustodyPdfQuery): Promise<PdfDocument> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PdfDocument>({ url: `${CustodyUrl.pdf}${query}`, method: 'GET' });
  }

  async getAccountPdf(id: CustodyAccountId, params: CustodyPdfQuery): Promise<PdfDocument> {
    const query = Utils.buildQuery({ ...params });
    return this.http.request<PdfDocument>({ url: `${CustodyUrl.accountPdf(id)}${query}`, method: 'GET' });
  }

  async listAccess(id: CustodyAccountId): Promise<CustodyAccountAccess[]> {
    return this.http.request<CustodyAccountAccess[]>({ url: CustodyUrl.accountAccess(id), method: 'GET' });
  }

  async grantAccess(id: CustodyAccountId, data: CreateCustodyAccountAccess): Promise<CustodyAccountAccess> {
    return this.http.request<CustodyAccountAccess>({ url: CustodyUrl.accountAccess(id), method: 'POST', data });
  }

  async updateAccess(
    id: CustodyAccountId,
    accessId: number,
    data: UpdateCustodyAccountAccess,
  ): Promise<CustodyAccountAccess> {
    return this.http.request<CustodyAccountAccess>({
      url: CustodyUrl.accountAccessById(id, accessId),
      method: 'PUT',
      data,
    });
  }

  async revokeAccess(id: CustodyAccountId, accessId: number): Promise<void> {
    return this.http.request<void>({ url: CustodyUrl.accountAccessById(id, accessId), method: 'DELETE' });
  }
}
