import { useCallback, useMemo } from 'react';
import {
  BlockchainBalances,
  BlockchainUrl,
  BroadcastResult,
  BroadcastTransaction,
  CreateBlockchainTransaction,
  GetBlockchainBalances,
  UnsignedTransaction,
} from '../definitions/blockchain';
import { useApi } from './api.hook';

export interface BlockchainInterface {
  /**
   * On-chain balances of an address.
   *
   * The response reports asset ids, not assets - match them against the asset list. Assets the
   * address holds no balance of may be missing from the response entirely.
   */
  getBalances: (data: GetBlockchainBalances) => Promise<BlockchainBalances>;
  /** Builds an unsigned transfer. Signing it needs a chain-specific library and stays with the caller. */
  createTransaction: (data: CreateBlockchainTransaction) => Promise<UnsignedTransaction>;
  /** Submits a signed transaction to its blockchain and returns the resulting hash. */
  broadcastTransaction: (data: BroadcastTransaction) => Promise<BroadcastResult>;
}

export function useBlockchain(): BlockchainInterface {
  const { call } = useApi();

  const getBalances = useCallback(
    async (data: GetBlockchainBalances) =>
      call<BlockchainBalances>({ url: BlockchainUrl.balances, method: 'POST', data }),
    [call],
  );

  const createTransaction = useCallback(
    async (data: CreateBlockchainTransaction) =>
      call<UnsignedTransaction>({ url: BlockchainUrl.transaction, method: 'POST', data }),
    [call],
  );

  const broadcastTransaction = useCallback(
    async (data: BroadcastTransaction) => call<BroadcastResult>({ url: BlockchainUrl.broadcast, method: 'POST', data }),
    [call],
  );

  return useMemo(
    () => ({ getBalances, createTransaction, broadcastTransaction }),
    [getBalances, createTransaction, broadcastTransaction],
  );
}
