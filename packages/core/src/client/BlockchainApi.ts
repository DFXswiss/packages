import {
  BlockchainBalances,
  BlockchainUrl,
  BroadcastResult,
  BroadcastTransaction,
  CreateBlockchainTransaction,
  GetBlockchainBalances,
  UnsignedTransaction,
} from '../definitions/blockchain';
import { DfxHttpClient } from './DfxHttpClient';

export class BlockchainApi {
  constructor(private readonly http: DfxHttpClient) {}

  /**
   * On-chain balances of an address.
   *
   * The response reports asset ids, not assets - match them against the asset list. Assets the
   * address holds no balance of may be missing from the response entirely.
   */
  async getBalances(data: GetBlockchainBalances): Promise<BlockchainBalances> {
    return this.http.request<BlockchainBalances>({ url: BlockchainUrl.balances, method: 'POST', data });
  }

  /** Builds an unsigned transfer. Signing it needs a chain-specific library and stays with the caller. */
  async createTransaction(data: CreateBlockchainTransaction): Promise<UnsignedTransaction> {
    return this.http.request<UnsignedTransaction>({ url: BlockchainUrl.transaction, method: 'POST', data });
  }

  /** Submits a signed transaction to its blockchain and returns the resulting hash. */
  async broadcastTransaction(data: BroadcastTransaction): Promise<BroadcastResult> {
    return this.http.request<BroadcastResult>({ url: BlockchainUrl.broadcast, method: 'POST', data });
  }
}
