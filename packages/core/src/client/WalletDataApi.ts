import {
  BitcoinAddressStats,
  BitcoinFeeEstimates,
  BitcoinTransactionStatus,
  BitcoinUtxo,
  Bip353LookupResult,
  EnsLookupResult,
  EnsReverseLookupResult,
  EvmApproval,
  EvmNftPage,
  EvmRpcRequest,
  EvmTokenBalance,
  EvmTransferPage,
  Outspend,
  WalletDataListId,
  WalletDataUrl,
  WalletPrice,
} from '../definitions/wallet-data';
import { Utils } from '../utils';
import { DfxHttpClient, ResponseType } from './DfxHttpClient';

/** Bitcoin data of one network, Esplora-shaped through the DFX API (D8). */
export class EsploraApi {
  constructor(
    private readonly http: DfxHttpClient,
    private readonly blockchain: 'Bitcoin' | 'BitcoinTestnet4',
  ) {}

  address(address: string): Promise<BitcoinAddressStats> {
    return this.http.request<BitcoinAddressStats>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/address/${address}`,
      method: 'GET',
      token: false,
    });
  }

  utxos(address: string): Promise<BitcoinUtxo[]> {
    return this.http.request<BitcoinUtxo[]>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/address/${address}/utxo`,
      method: 'GET',
      token: false,
    });
  }

  transactions(address: string): Promise<unknown[]> {
    return this.http.request<unknown[]>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/address/${address}/txs`,
      method: 'GET',
      token: false,
    });
  }

  transactionHex(txid: string): Promise<string> {
    return this.http.request<string>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/tx/${txid}/hex`,
      method: 'GET',
      token: false,
      responseType: ResponseType.TEXT,
    });
  }

  transactionStatus(txid: string): Promise<BitcoinTransactionStatus> {
    return this.http.request<BitcoinTransactionStatus>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/tx/${txid}/status`,
      method: 'GET',
      token: false,
    });
  }

  outspends(txid: string): Promise<Outspend[]> {
    return this.http.request<Outspend[]>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/tx/${txid}/outspends`,
      method: 'GET',
      token: false,
    });
  }

  blockHash(height: number): Promise<string> {
    return this.http.request<string>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/block-height/${height}`,
      method: 'GET',
      token: false,
      responseType: ResponseType.TEXT,
    });
  }

  tipHeight(): Promise<number> {
    return this.http.request<number>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/blocks/tip/height`,
      method: 'GET',
      token: false,
      responseType: ResponseType.TEXT,
    });
  }

  feeEstimates(): Promise<BitcoinFeeEstimates> {
    return this.http.request<BitcoinFeeEstimates>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/fee-estimates`,
      method: 'GET',
      token: false,
    });
  }

  /** mempool.space flavor recommended fees; plain Esplora answers 404. */
  recommendedFees(): Promise<BitcoinFeeEstimates> {
    return this.http.request<BitcoinFeeEstimates>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/v1/fees/recommended`,
      method: 'GET',
      token: false,
    });
  }

  /** Broadcasts a raw transaction (hex, text/plain); resolves to the txid. */
  broadcast(rawTransactionHex: string): Promise<string> {
    return this.http.request<string>({
      url: `${WalletDataUrl.esplora(this.blockchain)}/tx`,
      method: 'POST',
      data: rawTransactionHex,
      noJson: true,
      responseType: ResponseType.TEXT,
      token: false,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/** Public wallet data capability (D8, D32, D36): Bitcoin, EVM, prices, lookups, blocklists. */
export class WalletDataApi {
  readonly bitcoin: EsploraApi;
  readonly bitcoinTestnet4: EsploraApi;

  constructor(private readonly http: DfxHttpClient) {
    this.bitcoin = new EsploraApi(http, 'Bitcoin');
    this.bitcoinTestnet4 = new EsploraApi(http, 'BitcoinTestnet4');
  }

  /** Allowlisted JSON-RPC passthrough; disallowed methods are answered by the server. */
  evmRpc<T = unknown>(chainId: number, request: EvmRpcRequest | EvmRpcRequest[]): Promise<T> {
    return this.http.request<T>({
      url: WalletDataUrl.evmRpc(chainId),
      method: 'POST',
      data: request,
      token: false,
    });
  }

  evmTransfers(
    chainId: number,
    address: string,
    params: { direction: 'in' | 'out'; pageKey?: string },
  ): Promise<EvmTransferPage> {
    const query = Utils.buildQuery({ direction: params.direction, pageKey: params.pageKey });
    return this.http.request<EvmTransferPage>({
      url: `${WalletDataUrl.evmTransfers(chainId, address)}${query}`,
      method: 'GET',
      token: false,
    });
  }

  evmTokens(chainId: number, address: string): Promise<EvmTokenBalance[]> {
    return this.http.request<EvmTokenBalance[]>({
      url: WalletDataUrl.evmTokens(chainId, address),
      method: 'GET',
      token: false,
    });
  }

  evmNfts(chainId: number, address: string, pageKey?: string): Promise<EvmNftPage> {
    const query = Utils.buildQuery({ pageKey });
    return this.http.request<EvmNftPage>({
      url: `${WalletDataUrl.evmNfts(chainId, address)}${query}`,
      method: 'GET',
      token: false,
    });
  }

  evmApprovals(chainId: number, address: string): Promise<EvmApproval[]> {
    return this.http.request<EvmApproval[]>({
      url: WalletDataUrl.evmApprovals(chainId, address),
      method: 'GET',
      token: false,
    });
  }

  ensAddress(name: string): Promise<EnsLookupResult> {
    const query = Utils.buildQuery({ name });
    return this.http.request<EnsLookupResult>({
      url: `${WalletDataUrl.ensAddress}${query}`,
      method: 'GET',
      token: false,
    });
  }

  ensName(address: string): Promise<EnsReverseLookupResult> {
    const query = Utils.buildQuery({ address });
    return this.http.request<EnsReverseLookupResult>({
      url: `${WalletDataUrl.ensName}${query}`,
      method: 'GET',
      token: false,
    });
  }

  /** Prices of public assets by asset id, never by symbol (D32). */
  prices(params: { assetIds: number[]; currency: string }): Promise<WalletPrice[]> {
    const query = Utils.buildQuery({ assetIds: params.assetIds.join(','), currency: params.currency });
    return this.http.request<WalletPrice[]>({ url: `${WalletDataUrl.prices}${query}`, method: 'GET', token: false });
  }

  lnurl(lnurl: string): Promise<unknown> {
    const query = Utils.buildQuery({ lnurl });
    return this.http.request<unknown>({ url: `${WalletDataUrl.lnurl}${query}`, method: 'GET', token: false });
  }

  lightningAddress(address: string): Promise<unknown> {
    return this.http.request<unknown>({ url: WalletDataUrl.lightningAddress(address), method: 'GET', token: false });
  }

  lnurlCallback(url: string): Promise<unknown> {
    const query = Utils.buildQuery({ url });
    return this.http.request<unknown>({ url: `${WalletDataUrl.lnurlCallback}${query}`, method: 'GET', token: false });
  }

  bip353(name: string): Promise<Bip353LookupResult> {
    return this.http.request<Bip353LookupResult>({ url: WalletDataUrl.bip353(name), method: 'GET', token: false });
  }

  list(id: WalletDataListId): Promise<unknown> {
    return this.http.request<unknown>({ url: WalletDataUrl.list(id), method: 'GET', token: false });
  }
}
