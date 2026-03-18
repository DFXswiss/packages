import {
  KycSession,
  KycStepSession,
  KycStepName,
  KycStepType,
  TfaSetup,
  TfaLevel,
  LimitRequest,
  buildKycUrl,
} from '../definitions/kyc';
import { DfxHttpClient } from './DfxHttpClient';

export class KycApi {
  constructor(private readonly http: DfxHttpClient) {}

  async getInfo(): Promise<KycSession> {
    return this.http.request<KycSession>({ url: 'kyc', method: 'GET', version: 'v2' });
  }

  async continue(autoStep = false): Promise<KycSession> {
    return this.http.request<KycSession>({
      url: `kyc${autoStep ? '?autoStep=true' : ''}`,
      method: 'PUT',
      version: 'v2',
    });
  }

  async startStep(stepName: KycStepName, type?: KycStepType, sequence?: number): Promise<KycStepSession> {
    const params: string[] = [];
    if (type) params.push(`type=${type}`);
    if (sequence !== undefined) params.push(`sequence=${sequence}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.request<KycStepSession>({
      url: `kyc/${stepName}${query}`,
      method: 'GET',
      version: 'v2',
    });
  }

  async setStepData(url: string, data: any): Promise<void> {
    return this.http.request({ url, method: 'PUT', version: 'v2', data });
  }

  async setName(data: { firstName: string; lastName: string }): Promise<void> {
    return this.http.request({ url: 'user/name', method: 'PUT', version: 'v2', data });
  }

  async setUserData(data: any): Promise<void> {
    return this.http.request({ url: 'user/data', method: 'POST', version: 'v2', data });
  }

  async setupTfa(level?: TfaLevel): Promise<TfaSetup> {
    const query = level ? `?level=${level}` : '';
    return this.http.request<TfaSetup>({ url: `kyc/2fa${query}`, method: 'POST', version: 'v2' });
  }

  async checkTfa(level?: TfaLevel): Promise<TfaSetup> {
    const query = level ? `?level=${level}` : '';
    return this.http.request<TfaSetup>({ url: `kyc/2fa${query}`, method: 'GET', version: 'v2' });
  }

  async verifyTfa(token: string): Promise<void> {
    return this.http.request({ url: 'kyc/2fa/verify', method: 'POST', version: 'v2', data: { token } });
  }

  async requestLimit(data: LimitRequest): Promise<void> {
    return this.http.request({ url: 'kyc/limit', method: 'POST', version: 'v2', data });
  }

  async addTransferClient(client: string): Promise<void> {
    return this.http.request({
      url: `kyc/transfer?client=${encodeURIComponent(client)}`,
      method: 'POST',
      version: 'v2',
    });
  }

  async removeTransferClient(client: string): Promise<void> {
    return this.http.request({
      url: `kyc/transfer?client=${encodeURIComponent(client)}`,
      method: 'DELETE',
      version: 'v2',
    });
  }

  async getFile(fileId: string): Promise<any> {
    return this.http.request({ url: `kyc/file/${fileId}`, method: 'GET', version: 'v2' });
  }

  buildKycUrl(): ReturnType<typeof buildKycUrl> {
    return buildKycUrl(this.http.getApiUrl());
  }
}
