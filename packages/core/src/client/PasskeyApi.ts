import {
  PasskeyAssertionParams,
  PasskeyAuthResponse,
  PasskeyChallenge,
  PasskeyCredentialStatusResult,
  PasskeyDiagnosticParams,
  PasskeyLinkResponse,
  PasskeyRevocationReason,
  PasskeyUrl,
  PasskeyWallet,
  ClaimPasskeyParams,
  LinkPasskeyAddressParams,
  RegisterPasskeyParams,
  RevokePasskeyByAssertionParams,
  passkeyWalletUrl,
} from '../definitions/passkey';
import { Utils } from '../utils';
import { DfxHttpClient } from './DfxHttpClient';

/**
 * Passkey seed wallet API. Every passkey call carries its token explicitly (`token` parameter or
 * `http.setToken`); none of them retries on 401/409 — the wallet decides what a failed ceremony means.
 */
export class PasskeyApi {
  constructor(private readonly http: DfxHttpClient) {}

  registerBegin(): Promise<PasskeyChallenge> {
    return this.http.request<PasskeyChallenge>({ url: PasskeyUrl.registerBegin, method: 'POST', token: false });
  }

  registerFinish(params: RegisterPasskeyParams): Promise<PasskeyAuthResponse> {
    return this.http.request<PasskeyAuthResponse>({
      url: PasskeyUrl.registerFinish,
      method: 'POST',
      data: params,
      token: false,
    });
  }

  authenticateBegin(): Promise<PasskeyChallenge> {
    return this.http.request<PasskeyChallenge>({ url: PasskeyUrl.authenticateBegin, method: 'POST', token: false });
  }

  authenticateFinish(params: PasskeyAssertionParams): Promise<PasskeyAuthResponse> {
    return this.http.request<PasskeyAuthResponse>({
      url: PasskeyUrl.authenticateFinish,
      method: 'POST',
      data: params,
      token: false,
    });
  }

  /** Claim needs a fresh (≤ 300 s) account token. */
  claimBegin(token: string): Promise<PasskeyChallenge> {
    return this.http.request<PasskeyChallenge>({ url: PasskeyUrl.claimBegin, method: 'POST', token });
  }

  claimFinish(params: ClaimPasskeyParams, token: string): Promise<PasskeyAuthResponse> {
    return this.http.request<PasskeyAuthResponse>({
      url: PasskeyUrl.claimFinish,
      method: 'POST',
      data: params,
      token,
    });
  }

  /** Links a derived address with the in-memory passkey token; no retry, no logout side effects. */
  link(params: LinkPasskeyAddressParams, token: string): Promise<PasskeyLinkResponse> {
    return this.http.request<PasskeyLinkResponse>({ url: PasskeyUrl.link, method: 'POST', data: params, token });
  }

  revokeBegin(): Promise<PasskeyChallenge> {
    return this.http.request<PasskeyChallenge>({ url: PasskeyUrl.revokeBegin, method: 'POST', token: false });
  }

  /** Revocation by proving the credential one last time (also works when already Lost → Compromised). */
  revokeFinish(params: RevokePasskeyByAssertionParams): Promise<PasskeyWallet> {
    return this.http.request<PasskeyWallet>({
      url: PasskeyUrl.revokeFinish,
      method: 'POST',
      data: params,
      token: false,
    });
  }

  /** Prunes `excludeCredentials`; max 10 ids. */
  async credentialStatus(ids: string[]): Promise<PasskeyCredentialStatusResult[]> {
    const query = Utils.buildQuery({ ids: ids.join(',') });
    return this.http.request<PasskeyCredentialStatusResult[]>({
      url: `${PasskeyUrl.credentialStatus}${query}`,
      method: 'GET',
      token: false,
    });
  }

  wallets(token?: string): Promise<PasskeyWallet[]> {
    return this.http.request<PasskeyWallet[]>({ url: PasskeyUrl.wallets, method: 'GET', token });
  }

  backupSeen(id: number, token: string): Promise<PasskeyWallet> {
    return this.http.request<PasskeyWallet>({ url: passkeyWalletUrl(id, 'backupSeen'), method: 'PUT', token });
  }

  /** Management revocation; needs a fresh login (≤ 300 s `authTime`). */
  revoke(id: number, reason: PasskeyRevocationReason, token: string): Promise<PasskeyWallet> {
    return this.http.request<PasskeyWallet>({
      url: passkeyWalletUrl(id, 'revoke'),
      method: 'PUT',
      data: { reason },
      token,
    });
  }

  diagnostics(params: PasskeyDiagnosticParams): Promise<void> {
    return this.http.request<void>({ url: PasskeyUrl.diagnostics, method: 'POST', data: params, token: false });
  }
}
