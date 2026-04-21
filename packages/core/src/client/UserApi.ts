import { SignIn } from '../definitions/auth';
import { PhoneCallTime } from '../definitions/user';
import { User, UserUrl, UpdateUser, Referral, ApiKey, UserProfile } from '../definitions/user';
import { TransactionFilter } from '../definitions/transaction';
import { DfxHttpClient, SpecialHandling } from './DfxHttpClient';

export class UserApi {
  constructor(private readonly http: DfxHttpClient) {}

  async get(): Promise<User> {
    return this.http.request<User>({ url: UserUrl.get, method: 'GET', version: 'v2' });
  }

  async getRef(): Promise<Referral> {
    return this.http.request<Referral>({ url: UserUrl.ref, method: 'GET', version: 'v2' });
  }

  async getProfile(): Promise<UserProfile> {
    return this.http.request<UserProfile>({ url: UserUrl.profile, method: 'GET', version: 'v2' });
  }

  async update(data: UpdateUser, specialHandling?: SpecialHandling): Promise<User> {
    return this.http.request<User>({ url: UserUrl.update, method: 'PUT', data, version: 'v2', specialHandling });
  }

  async updateMail(data: { mail: string }): Promise<void> {
    return this.http.request({ url: UserUrl.updateMail, method: 'PUT', data, version: 'v2' });
  }

  async verifyMail(data: { token: string }): Promise<User> {
    return this.http.request<User>({ url: UserUrl.verifyMail, method: 'POST', data, version: 'v2' });
  }

  async updateCallSettings(preferredPhoneTimes?: PhoneCallTime[], acceptCall?: boolean): Promise<User> {
    return this.http.request<User>({
      url: UserUrl.update,
      method: 'PUT',
      data: { preferredPhoneTimes, acceptCall },
      version: 'v2',
    });
  }

  async changeAddress(address: string): Promise<SignIn> {
    return this.http.request<SignIn>({ url: UserUrl.changeAddress, method: 'POST', data: { address } });
  }

  async renameAddress(address: string, label: string): Promise<User> {
    return this.http.request<User>({
      url: `${UserUrl.addresses}/${encodeURIComponent(address)}`,
      method: 'PUT',
      data: { label },
      version: 'v2',
    });
  }

  async deleteAddress(address: string): Promise<void> {
    return this.http.request({
      url: `${UserUrl.addresses}/${encodeURIComponent(address)}`,
      method: 'DELETE',
      version: 'v2',
    });
  }

  async delete(): Promise<void> {
    return this.http.request({ url: UserUrl.delete, method: 'DELETE', version: 'v2' });
  }

  async addSpecialCode(code: string): Promise<void> {
    return this.http.request({ url: `${UserUrl.specialCodes}?code=${encodeURIComponent(code)}`, method: 'PUT' });
  }

  async generateApiKey(type: string, filter?: Record<string, boolean>): Promise<ApiKey> {
    const queryParts = filter
      ? Object.entries(filter).map(([k, v]) => `${k}=${v}`).join('&')
      : '';
    const url = queryParts ? `${UserUrl.apiKey}/${type}?${queryParts}` : `${UserUrl.apiKey}/${type}`;
    return this.http.request<ApiKey>({ url, method: 'POST' });
  }

  async deleteApiKey(type: string): Promise<void> {
    return this.http.request({ url: `${UserUrl.apiKey}/${type}`, method: 'DELETE' });
  }

  async updateApiFilter(type: string, filter: Record<string, boolean>): Promise<TransactionFilter[]> {
    const queryParts = Object.entries(filter).map(([k, v]) => `${k}=${v}`).join('&');
    return this.http.request<TransactionFilter[]>({ url: `${UserUrl.apiFilter}/${type}?${queryParts}`, method: 'PUT' });
  }
}
