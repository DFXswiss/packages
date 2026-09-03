import { Job, JobUrl } from '../definitions/job';
import { DfxHttpClient } from './DfxHttpClient';

export class JobApi {
  constructor(private readonly http: DfxHttpClient) {}

  async get<T = unknown>(uid: string): Promise<Job<T>> {
    return this.http.request<Job<T>>({ url: JobUrl.get(uid), method: 'GET' });
  }
}
