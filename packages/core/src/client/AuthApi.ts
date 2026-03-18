import { AuthUrl, AuthWalletType, SignMessage, SignIn, LnurlAuth, LnurlAuthStatus } from '../definitions/auth';
import { DfxHttpClient } from './DfxHttpClient';

export interface AuthenticateParams {
  address: string;
  signature: string;
  key?: string;
  specialCode?: string;
  wallet?: string;
  usedRef?: string;
  walletType?: AuthWalletType;
  recommendationCode?: string;
}

export class AuthApi {
  constructor(private readonly http: DfxHttpClient) {}

  async getSignMessage(address: string): Promise<string> {
    const result = await this.http.request<SignMessage>({
      url: `${AuthUrl.signMessage}?address=${encodeURIComponent(address)}`,
      method: 'GET',
      token: false,
    });
    return result.message;
  }

  async authenticate(params: AuthenticateParams): Promise<SignIn> {
    const data = this.buildSignUpParams(params);

    try {
      return await this.http.request<SignIn>({ url: AuthUrl.auth, method: 'POST', data, token: false });
    } catch (e: any) {
      if (e.statusCode === 409) {
        return this.http.request<SignIn>({ url: AuthUrl.auth, method: 'POST', data, token: false });
      }
      throw e;
    }
  }

  async signIn(params: Omit<AuthenticateParams, 'wallet' | 'usedRef' | 'recommendationCode'>): Promise<SignIn> {
    const data = this.buildSignUpParams(params);
    return this.http.request<SignIn>({ url: AuthUrl.signIn, method: 'POST', data, token: false });
  }

  async signUp(params: AuthenticateParams): Promise<SignIn> {
    const data = this.buildSignUpParams(params);
    return this.http.request<SignIn>({ url: AuthUrl.signUp, method: 'POST', data, token: false });
  }

  async signInWithMail(mail: string, redirectUri?: string, recommendationCode?: string): Promise<void> {
    return this.http.request({
      url: AuthUrl.signInWithMail,
      method: 'POST',
      data: { mail, redirectUri, recommendationCode },
      token: false,
    });
  }

  async createLnurlAuth(): Promise<LnurlAuth> {
    return this.http.request<LnurlAuth>({ url: AuthUrl.lnurl, method: 'POST', token: false });
  }

  async getLnurlAuth(k1: string): Promise<LnurlAuthStatus> {
    return this.http.request<LnurlAuthStatus>({
      url: `${AuthUrl.lnurlStatus}?k1=${encodeURIComponent(k1)}`,
      method: 'GET',
      token: false,
    });
  }

  private buildSignUpParams(params: AuthenticateParams) {
    const data: Record<string, any> = {
      address: params.address,
      signature: params.signature,
      key: params.key,
      usedRef: params.usedRef,
      specialCode: params.specialCode,
      walletType: params.walletType,
      recommendationCode: params.recommendationCode,
    };

    if (params.wallet) {
      const walletId = parseInt(params.wallet);
      if (!isNaN(walletId)) {
        data.walletId = walletId;
      } else {
        data.wallet = params.wallet;
      }
    }

    return data;
  }
}
