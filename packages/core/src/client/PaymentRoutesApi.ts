import { PaymentRoutes, PaymentRoutesUrl } from '../definitions/route';
import { DfxHttpClient } from './DfxHttpClient';

export class PaymentRoutesApi {
  constructor(private readonly http: DfxHttpClient) {}

  async get(): Promise<PaymentRoutes> {
    return this.http.request<PaymentRoutes>({ url: PaymentRoutesUrl.get, method: 'GET' });
  }

  async deactivateRoute(type: 'buy' | 'sell' | 'swap', id: number): Promise<void> {
    return this.http.request({ url: `${type}/${id}`, method: 'PUT', data: { active: false } });
  }
}
