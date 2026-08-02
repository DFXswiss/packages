import { CreateRecommendation, Recommendation, RecommendationUrl } from '../definitions/recommendation';
import { DfxHttpClient } from './DfxHttpClient';

export class RecommendationApi {
  constructor(private readonly http: DfxHttpClient) {}

  /** Recommendations of the authenticated account, both the ones it sent and the ones it received. */
  async list(): Promise<Recommendation[]> {
    return this.http.request<Recommendation[]>({ url: RecommendationUrl.recommendation, method: 'GET' });
  }

  async create(data: CreateRecommendation): Promise<Recommendation> {
    return this.http.request<Recommendation>({
      url: RecommendationUrl.recommendation,
      method: 'POST',
      data,
    });
  }

  /** Accepts a recommendation. The response body is empty; re-read the list for the new status. */
  async confirm(id: number): Promise<void> {
    return this.http.request<void>({ url: RecommendationUrl.confirm(id), method: 'PUT' });
  }

  /** Declines a recommendation. The response body is empty; re-read the list for the new status. */
  async reject(id: number): Promise<void> {
    return this.http.request<void>({ url: RecommendationUrl.reject(id), method: 'PUT' });
  }
}
