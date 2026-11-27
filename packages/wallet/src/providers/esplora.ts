import type { BitcoinNetwork, WalletEnv } from '../config/environment';
import { isRegtestAllowed } from '../config/environment';
import { WalletError } from '../util/errors';

/**
 * Bitcoin data and broadcast through an Esplora endpoint that the app calls directly from the browser (§9.2 R1,
 * B19): a public indexer or the user's own node, configured per device or per build. On STG the regtest data
 * comes from the DFX API forward instead (`DfxApiClient.walletData.bitcoinRegtest` of `@dfx.swiss/core`, a named
 * R1 exception for STG only); this client covers every other endpoint, e.g. a local regtest node on DEV/LOC.
 */

export interface EsploraUtxo {
  txid: string;
  vout: number;
  value: number;
  status: { confirmed: boolean; block_height?: number; block_time?: number };
}

export interface EsploraAddressStats {
  address: string;
  chain_stats: { funded_txo_sum: number; spent_txo_sum: number; tx_count: number };
  mempool_stats: { funded_txo_sum: number; spent_txo_sum: number; tx_count: number };
}

export type FetchLike = (
  input: string,
  init?: { method?: string; body?: string; headers?: Record<string, string> },
) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>;

export interface EsploraClientOptions {
  /** Network the endpoint serves; addresses are not checked against it here, the signer does that. */
  network: BitcoinNetwork;
  /** Environment of the app build; required for `regtest` (see `isRegtestAllowed`). */
  env?: WalletEnv;
  regtestEnvs?: readonly WalletEnv[];
  /** Defaults to the global `fetch`. */
  fetch?: FetchLike;
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Normalizes an Esplora base URL: `https:` only, plain `http:` only on the loopback host (a local regtest node
 * on LOC; every other plain-HTTP node is blocked by the app's CSP anyway, B19). No credentials, query or hash.
 */
export function normalizeEsploraUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new WalletError('invalid-endpoint', `Not a URL: ${url}`);
  }
  const loopback = LOOPBACK_HOSTS.has(parsed.hostname);
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && loopback)) {
    throw new WalletError('invalid-endpoint', 'Esplora endpoints must use HTTPS (plain HTTP only on localhost)');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new WalletError('invalid-endpoint', 'Esplora endpoints carry no credentials, query or fragment');
  }
  return parsed.toString().replace(/\/+$/, '');
}

export class EsploraClient {
  readonly baseUrl: string;
  readonly network: BitcoinNetwork;
  private readonly fetchFn: FetchLike;

  constructor(baseUrl: string, options: EsploraClientOptions) {
    if (options?.network === 'regtest' && !isRegtestAllowed(options.env, options.regtestEnvs)) {
      throw new WalletError(
        'network-not-allowed',
        `Bitcoin regtest is not enabled in environment ${String(options.env)}`,
      );
    }
    const fetchFn = options?.fetch ?? (globalThis as { fetch?: FetchLike }).fetch;
    if (!fetchFn) throw new WalletError('provider-unavailable', 'No fetch implementation');
    this.baseUrl = normalizeEsploraUrl(baseUrl);
    this.network = options.network;
    this.fetchFn = fetchFn;
  }

  addressStats(address: string): Promise<EsploraAddressStats> {
    return this.json(`/address/${encodeURIComponent(address)}`);
  }

  utxos(address: string): Promise<EsploraUtxo[]> {
    return this.json(`/address/${encodeURIComponent(address)}/utxo`);
  }

  /** Newest transactions of the address (Esplora pages of 25 confirmed plus the mempool). */
  transactions(address: string, afterTxid?: string): Promise<unknown[]> {
    const suffix = afterTxid ? `/chain/${encodeURIComponent(checkTxid(afterTxid))}` : '';
    return this.json(`/address/${encodeURIComponent(address)}/txs${suffix}`);
  }

  /** Confirmed balance plus mempool delta, in satoshis. */
  async balance(address: string): Promise<{ confirmed: number; unconfirmed: number }> {
    const { chain_stats: chain, mempool_stats: mempool } = await this.addressStats(address);
    return {
      confirmed: chain.funded_txo_sum - chain.spent_txo_sum,
      unconfirmed: mempool.funded_txo_sum - mempool.spent_txo_sum,
    };
  }

  /** Target blocks → sat/vB. A regtest node without fee history answers `{}`. */
  feeEstimates(): Promise<Record<string, number>> {
    return this.json('/fee-estimates');
  }

  async tipHeight(): Promise<number> {
    const text = (await this.text('/blocks/tip/height')).trim();
    const height = /^(?:0|[1-9]\d*)$/.test(text) ? Number(text) : NaN;
    if (!Number.isSafeInteger(height)) throw new WalletError('provider-invalid', 'Tip height is not a number');
    return height;
  }

  /** Broadcasts a raw transaction (hex) and returns the txid the endpoint reports. */
  async broadcast(rawTransactionHex: string): Promise<string> {
    if (typeof rawTransactionHex !== 'string' || !/^(?:[0-9a-f]{2})+$/i.test(rawTransactionHex)) {
      throw new WalletError('invalid-transaction', 'The raw transaction must be hex');
    }
    const txid = (
      await this.text('/tx', { method: 'POST', body: rawTransactionHex, headers: { 'Content-Type': 'text/plain' } })
    ).trim();
    return checkTxid(txid);
  }

  private async json<T>(path: string): Promise<T> {
    const text = await this.text(path);
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new WalletError('provider-invalid', `Esplora answered no JSON for ${path}`, { cause: error });
    }
  }

  private async text(path: string, init?: Parameters<FetchLike>[1]): Promise<string> {
    let response: Awaited<ReturnType<FetchLike>>;
    try {
      response = await this.fetchFn(`${this.baseUrl}${path}`, init);
    } catch (error) {
      throw new WalletError('provider-unavailable', `Esplora endpoint unreachable: ${this.baseUrl}`, { cause: error });
    }
    const body = await response.text();
    if (!response.ok) {
      throw new WalletError('provider-error', `Esplora ${response.status} for ${path}: ${body.slice(0, 200)}`);
    }
    return body;
  }
}

function checkTxid(txid: string): string {
  if (!/^[0-9a-f]{64}$/i.test(txid)) throw new WalletError('provider-invalid', `Not a transaction id: ${txid}`);
  return txid.toLowerCase();
}
