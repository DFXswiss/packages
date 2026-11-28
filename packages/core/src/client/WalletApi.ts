import {
  WalletAddress,
  WalletApiUrl,
  WalletAuthenticateBeginResponse,
  WalletAuthenticateFinishRequest,
  WalletBitcoinAccount,
  WalletBitcoinAccountRequest,
  WalletBitcoinBlockchain,
  WalletBitcoinFees,
  WalletBitcoinPrepare,
  WalletBitcoinPrepareRequest,
  WalletBitcoinSubmitRequest,
  WalletBitcoinSubmitResponse,
  WalletConfig,
  WalletCredential,
  WalletDiagnostic,
  WalletDiagnosticResponse,
  WalletEvmRpcRequest,
  WalletRegisterBeginResponse,
  WalletRegisterFinishRequest,
  WalletRevokeBeginResponse,
  WalletRevokeFinishRequest,
  WalletRevokeFinishResponse,
  WalletSessionResponse,
  WalletUpsertAddressRequest,
} from '../definitions/wallet-api';
import { Utils } from '../utils';
import { DfxHttpClient, RequestConfig, ResponseType } from './DfxHttpClient';

/**
 * Client of DFXswiss/wallet-api (`/v1/wallet/*` on the DFX API host). It keeps its own wallet session token,
 * separate from the DFX customer token of {@link DfxHttpClient}: public calls send no token at all, and
 * session calls send only the wallet token (an explicit `token` argument, else the stored one). The customer
 * token is never sent to wallet-api. No call retries; a 401 is the caller's to handle.
 */
export class WalletApi {
  private sessionToken?: string;

  constructor(private readonly http: DfxHttpClient) {}

  /** Stores the wallet session token (from `registerFinish`/`authenticateFinish`); `undefined` clears it. */
  setSessionToken(token: string | undefined): void {
    this.sessionToken = token;
  }

  getSessionToken(): string | undefined {
    return this.sessionToken;
  }

  // --- Passkeys ---------------------------------------------------------------------------------------------

  registerBegin(): Promise<WalletRegisterBeginResponse> {
    return this.publicCall({ url: WalletApiUrl.registerBegin, method: 'POST' });
  }

  registerFinish(request: WalletRegisterFinishRequest): Promise<WalletSessionResponse> {
    return this.publicCall({ url: WalletApiUrl.registerFinish, method: 'POST', data: request });
  }

  /** Pins the ceremony to `credentialId` when given; otherwise any discoverable credential of the RP. */
  authenticateBegin(credentialId?: string): Promise<WalletAuthenticateBeginResponse> {
    return this.publicCall({
      url: WalletApiUrl.authenticateBegin,
      method: 'POST',
      data: credentialId !== undefined ? { credentialId } : {},
    });
  }

  authenticateFinish(request: WalletAuthenticateFinishRequest): Promise<WalletSessionResponse> {
    return this.publicCall({ url: WalletApiUrl.authenticateFinish, method: 'POST', data: request });
  }

  revokeBegin(token?: string): Promise<WalletRevokeBeginResponse> {
    return this.sessionCall({ url: WalletApiUrl.revokeBegin, method: 'POST' }, token);
  }

  revokeFinish(request: WalletRevokeFinishRequest, token?: string): Promise<WalletRevokeFinishResponse> {
    return this.sessionCall({ url: WalletApiUrl.revokeFinish, method: 'POST', data: request }, token);
  }

  credentials(token?: string): Promise<WalletCredential[]> {
    return this.sessionCall({ url: WalletApiUrl.credentials, method: 'GET' }, token);
  }

  // --- Addresses --------------------------------------------------------------------------------------------

  upsertAddress(request: WalletUpsertAddressRequest, token?: string): Promise<WalletAddress> {
    return this.sessionCall({ url: WalletApiUrl.addresses, method: 'PUT', data: request }, token);
  }

  addresses(token?: string): Promise<WalletAddress[]> {
    return this.sessionCall({ url: WalletApiUrl.addresses, method: 'GET' }, token);
  }

  // --- Public data ------------------------------------------------------------------------------------------

  /** The families the app shows; public. */
  config(): Promise<WalletConfig> {
    return this.publicCall({ url: WalletApiUrl.config, method: 'GET' });
  }

  chains<T = unknown>(): Promise<T> {
    return this.publicCall({ url: WalletApiUrl.chains, method: 'GET' });
  }

  list<T = unknown>(id: string): Promise<T> {
    return this.publicCall({ url: WalletApiUrl.list(id), method: 'GET' });
  }

  prices<T = unknown>(): Promise<T> {
    return this.publicCall({ url: WalletApiUrl.prices, method: 'GET' });
  }

  ensAddress<T = unknown>(name: string): Promise<T> {
    return this.publicCall({ url: `${WalletApiUrl.ensAddress}${Utils.buildQuery({ name })}`, method: 'GET' });
  }

  ensName<T = unknown>(address: string): Promise<T> {
    return this.publicCall({ url: `${WalletApiUrl.ensName}${Utils.buildQuery({ address })}`, method: 'GET' });
  }

  lnurl<T = unknown>(url: string): Promise<T> {
    return this.publicCall({ url: `${WalletApiUrl.lnurl}${Utils.buildQuery({ url })}`, method: 'GET' });
  }

  lightningAddress<T = unknown>(address: string): Promise<T> {
    return this.publicCall({ url: WalletApiUrl.lightningAddress(address), method: 'GET' });
  }

  /** Sends the wallet token when one is stored or given (optional session), otherwise none. */
  diagnostics(payload: WalletDiagnostic, token?: string): Promise<WalletDiagnosticResponse> {
    return this.http.request<WalletDiagnosticResponse>({
      url: WalletApiUrl.diagnostics,
      method: 'POST',
      data: payload,
      token: token ?? this.sessionToken ?? false,
    });
  }

  /** Esplora GET passthrough, e.g. `esplora('BitcoinRegtest', 'blocks/tip/height')`; answered as text. */
  esplora(blockchain: WalletBitcoinBlockchain, path: string): Promise<string> {
    return this.publicCall({
      url: WalletApiUrl.esplora(blockchain, path),
      method: 'GET',
      responseType: ResponseType.TEXT,
    });
  }

  evmRpc<T = unknown>(chainId: number | string, request: WalletEvmRpcRequest | WalletEvmRpcRequest[]): Promise<T> {
    return this.publicCall({ url: WalletApiUrl.evmRpc(chainId), method: 'POST', data: request });
  }

  // --- Bitcoin (bearer) -------------------------------------------------------------------------------------

  bitcoinAccount(
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinAccountRequest,
    token?: string,
  ): Promise<WalletBitcoinAccount> {
    return this.sessionCall({ url: WalletApiUrl.bitcoinAccount(blockchain), method: 'POST', data: request }, token);
  }

  bitcoinFees(blockchain: WalletBitcoinBlockchain, token?: string): Promise<WalletBitcoinFees> {
    return this.sessionCall({ url: WalletApiUrl.bitcoinFees(blockchain), method: 'GET' }, token);
  }

  bitcoinPrepare(
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinPrepareRequest,
    token?: string,
  ): Promise<WalletBitcoinPrepare> {
    return this.sessionCall({ url: WalletApiUrl.bitcoinPrepare(blockchain), method: 'POST', data: request }, token);
  }

  bitcoinSubmit(
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinSubmitRequest,
    token?: string,
  ): Promise<WalletBitcoinSubmitResponse> {
    return this.sessionCall({ url: WalletApiUrl.bitcoinSubmit(blockchain), method: 'POST', data: request }, token);
  }

  // ----------------------------------------------------------------------------------------------------------

  private publicCall<T>(config: Omit<RequestConfig, 'token'>): Promise<T> {
    return this.http.request<T>({ ...config, token: false });
  }

  /** Without a wallet token the request goes out without one (401 `SessionRequired`), never with the customer token. */
  private sessionCall<T>(config: Omit<RequestConfig, 'token'>, token?: string): Promise<T> {
    return this.http.request<T>({ ...config, token: token ?? this.sessionToken ?? false });
  }
}
