import { AuthUrl, AuthWalletType, SignMessage, SignIn, LnurlAuth, LnurlAuthStatus } from '../definitions/auth';
import { ApiException } from '../definitions/error';
import { Utils } from '../utils';
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

interface SignUpRequest {
  address: string;
  signature: string;
  key?: string;
  usedRef?: string;
  specialCode?: string;
  walletType?: AuthWalletType;
  recommendationCode?: string;
  walletId?: number;
  wallet?: string;
}

export class AuthApi {
  constructor(private readonly http: DfxHttpClient) {}

  async getSignMessage(address: string): Promise<string> {
    const query = Utils.buildQuery({ address });
    const result = await this.http.request<SignMessage>({
      url: `${AuthUrl.signMessage}${query}`,
      method: 'GET',
      token: false,
    });
    return result.message;
  }

  /**
   * Authenticate with address + signature. Tries combined auth first,
   * retries without token on 409 (account already exists on different chain).
   */
  async authenticate(params: AuthenticateParams): Promise<SignIn> {
    const data = this.buildSignUpParams(params);

    const config = { url: AuthUrl.auth, method: 'POST' as const, data };

    try {
      return await this.http.request<SignIn>(config);
    } catch (error: unknown) {
      // 409: account exists on different chain — retry without auth token
      if (error instanceof ApiException && error.statusCode === 409) {
        return this.http.request<SignIn>({ ...config, token: false });
      }
      throw error;
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

  async signInWithMail(mail: string, redirectUri?: string, recommendationCode?: string, wallet?: string): Promise<void> {
    return this.http.request({
      url: AuthUrl.signInWithMail,
      method: 'POST',
      data: { mail, redirectUri, recommendationCode, wallet },
      token: false,
    });
  }

  async createLnurlAuth(): Promise<LnurlAuth> {
    return this.http.request<LnurlAuth>({ url: AuthUrl.lnurl, method: 'POST', token: false });
  }

  async getLnurlAuth(k1: string): Promise<LnurlAuthStatus> {
    const query = Utils.buildQuery({ k1 });
    return this.http.request<LnurlAuthStatus>({
      url: `${AuthUrl.lnurlStatus}${query}`,
      method: 'GET',
      token: false,
    });
  }

  private buildSignUpParams(params: AuthenticateParams): SignUpRequest {
    const data: SignUpRequest = {
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
