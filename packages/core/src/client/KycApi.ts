import {
  KycSession,
  KycInfo,
  KycStepSession,
  KycStepBase,
  KycStepName,
  KycStepType,
  KycContactData,
  KycPersonalData,
  KycManualIdentData,
  KycLegalEntityData,
  KycNationalityData,
  KycRecommendationData,
  KycFileData,
  KycSignatoryPowerData,
  KycBeneficialData,
  KycOperationalData,
  KycFinancialResponses,
  KycFinancialQuestions,
  KycChangeAddressData,
  KycChangeNameData,
  KycChangePhoneData,
  PaymentData,
  RecallData,
  TfaSetup,
  TfaLevel,
  LimitRequest,
  KycFile,
  UserName,
  UserData,
  buildKycUrl,
} from '../definitions/kyc';
import { DfxHttpClient } from './DfxHttpClient';

export class KycApi {
  constructor(private readonly http: DfxHttpClient) {}

  // --- Standard API calls (Bearer token auth) ---

  async setName(data: UserName): Promise<void> {
    return this.http.request({ url: 'user/name', method: 'PUT', data });
  }

  async setData(data: UserData): Promise<void> {
    return this.http.request({ url: 'user/data', method: 'POST', data });
  }

  async getFile(fileId: string): Promise<KycFile> {
    return this.http.request<KycFile>({ url: `kyc/file/${fileId}`, method: 'GET', version: 'v2' });
  }

  async check2fa(level?: TfaLevel): Promise<TfaSetup> {
    const query = level ? `?level=${level}` : '';
    return this.http.request<TfaSetup>({ url: `kyc/2fa${query}`, method: 'GET', version: 'v2' });
  }

  // --- KYC code-authenticated calls (x-kyc-code header) ---

  async getInfo(code: string): Promise<KycInfo> {
    return this.kycRequest<KycInfo>(code, { url: this.kycUrl('kyc'), method: 'GET' });
  }

  async continue(code: string, autoStep = false): Promise<KycSession> {
    const query = autoStep ? '?autoStep=true' : '';
    return this.kycRequest<KycSession>(code, { url: this.kycUrl(`kyc${query}`), method: 'PUT' });
  }

  async startStep(code: string, stepName: KycStepName, type?: KycStepType, sequence?: number): Promise<KycStepSession> {
    const params: string[] = [];
    if (type) params.push(`type=${type}`);
    if (sequence !== undefined) params.push(`sequence=${sequence}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.kycRequest<KycStepSession>(code, { url: this.kycUrl(`kyc/${stepName}${query}`), method: 'GET' });
  }

  async setContactData(code: string, url: string, data: KycContactData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setPersonalData(code: string, url: string, data: KycPersonalData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setManualIdentData(code: string, url: string, data: KycManualIdentData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setLegalEntityData(code: string, url: string, data: KycLegalEntityData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setSoleProprietorshipData(code: string, url: string, data: KycFileData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setNationalityData(code: string, url: string, data: KycNationalityData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setRecommendationData(code: string, url: string, data: KycRecommendationData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setFileData(code: string, url: string, data: KycFileData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setSignatoryPowerData(code: string, url: string, data: KycSignatoryPowerData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setBeneficialData(code: string, url: string, data: KycBeneficialData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setOperationalData(code: string, url: string, data: KycOperationalData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async getFinancialData(code: string, url: string, lang?: string): Promise<KycFinancialQuestions> {
    const fullUrl = lang ? `${url}?lang=${lang}` : url;
    return this.kycRequest<KycFinancialQuestions>(code, { url: fullUrl, method: 'GET' });
  }

  async setFinancialData(code: string, url: string, data: KycFinancialResponses): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setPaymentData(code: string, url: string, data: PaymentData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setRecallData(code: string, url: string, data: RecallData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setAddressChangeData(code: string, url: string, data: KycChangeAddressData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setNameChangeData(code: string, url: string, data: KycChangeNameData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setPhoneChangeData(code: string, url: string, data: KycChangePhoneData): Promise<KycStepBase> {
    return this.kycRequest<KycStepBase>(code, { url, method: 'PUT', data });
  }

  async setup2fa(code: string, level?: TfaLevel): Promise<TfaSetup> {
    const query = level ? `?level=${level}` : '';
    return this.kycRequest<TfaSetup>(code, { url: this.tfaUrl(query), method: 'POST' });
  }

  async verify2fa(code: string, token: string): Promise<void> {
    return this.kycRequest(code, { url: `${this.tfaUrl('')}/verify`, method: 'POST', data: { token } });
  }

  async increaseLimit(code: string, data: LimitRequest): Promise<void> {
    return this.kycRequest(code, { url: this.limitUrl(), method: 'POST', data });
  }

  async addTransferClient(code: string, client: string): Promise<void> {
    return this.kycRequest(code, {
      url: this.transferUrl(client),
      method: 'POST',
    });
  }

  async removeTransferClient(code: string, client: string): Promise<void> {
    return this.kycRequest(code, {
      url: this.transferUrl(client),
      method: 'DELETE',
    });
  }

  // --- URL builders ---

  buildKycUrl(): ReturnType<typeof buildKycUrl> {
    return buildKycUrl(this.http.getApiUrl());
  }

  // --- Internals ---

  private kycUrl(path: string): string {
    const v2Base = this.http.getBaseUrl() + '/v2';
    return `${v2Base}/${path}`;
  }

  private tfaUrl(query: string): string {
    return `${this.http.getBaseUrl()}/v2/kyc/2fa${query}`;
  }

  private limitUrl(): string {
    return `${this.http.getBaseUrl()}/v2/kyc/limit`;
  }

  private transferUrl(client: string): string {
    return `${this.http.getBaseUrl()}/v2/kyc/transfer?client=${encodeURIComponent(client)}`;
  }

  private async kycRequest<T>(code: string, config: { url: string; method: 'GET' | 'PUT' | 'POST' | 'DELETE'; data?: any; noJson?: boolean }): Promise<T> {
    return this.http.requestAbsolute<T>({
      ...config,
      token: false,
      headers: { 'x-kyc-code': code },
    });
  }
}
