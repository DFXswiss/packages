/** Public wallet data capability (D8, D32, D36) — no JWT, rate-limited per IP. */
export const WalletDataUrl = {
  chains: 'walletData/chains',
  esplora: (blockchain: 'Bitcoin' | 'BitcoinTestnet4') => `walletData/esplora/${blockchain}`,
  evmRpc: (chainId: number) => `walletData/evm/${chainId}/rpc`,
  evmTransfers: (chainId: number, address: string) => `walletData/evm/${chainId}/transfers/${address}`,
  evmTokens: (chainId: number, address: string) => `walletData/evm/${chainId}/tokens/${address}`,
  evmNfts: (chainId: number, address: string) => `walletData/evm/${chainId}/nfts/${address}`,
  evmApprovals: (chainId: number, address: string) => `walletData/evm/${chainId}/approvals/${address}`,
  ensAddress: 'walletData/ens/address',
  ensName: 'walletData/ens/name',
  prices: 'walletData/prices',
  lnurl: 'walletData/lnurl',
  lightningAddress: (address: string) => `walletData/lightningAddress/${address}`,
  lnurlCallback: 'walletData/lnurl/callback',
  bip353: (name: string) => `walletData/bip353/${name}`,
  list: (id: WalletDataListId) => `walletData/lists/${id}`,
};

/** Refreshable blocklists of the wallet (§9.2). */
export type WalletDataListId = 'PhishingDomains' | 'ScamAddresses';

/** Esplora-shaped UTXO. */
export interface BitcoinUtxo {
  txid: string;
  vout: number;
  value: number;
  status: { confirmed: boolean; block_height?: number; block_time?: number };
}

export interface BitcoinAddressStats {
  address: string;
  chain_stats: { funded_txo_sum: number; spent_txo_sum: number; tx_count: number };
  mempool_stats: { funded_txo_sum: number; spent_txo_sum: number; tx_count: number };
}

export interface BitcoinTransactionStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

/** mempool.space fee shape (sat/vB). */
export interface BitcoinFeeEstimates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee?: number;
  minimumFee?: number;
}

export interface Outspend {
  spent: boolean;
  txid?: string;
  vin?: number;
  status?: { confirmed: boolean; block_height?: number };
}

/** Wallet price of a public asset (D32). */
export interface WalletPrice {
  assetId: number;
  currency: string;
  price: number;
  isValid: boolean;
  timestamp: string;
}

export type EvmTransferCategory = 'external' | 'internal' | 'erc20' | 'erc721' | 'erc1155' | 'special-nft';

export interface EvmTransfer {
  hash: string;
  blockNumber: string;
  timestamp?: number;
  from: string;
  to?: string;
  category: EvmTransferCategory;
  contract?: string;
  /** Raw integer as decimal string. */
  value?: string;
  decimals?: number;
  symbol?: string;
  tokenId?: string;
}

export interface EvmTransferPage {
  transfers: EvmTransfer[];
  pageKey?: string;
}

export interface EvmTokenBalance {
  contract: string;
  /** Raw integer as decimal string. */
  balance: string;
  decimals?: number;
  symbol?: string;
  name?: string;
}

export interface EvmNftPage {
  nfts: {
    contract: string;
    tokenId: string;
    tokenType: 'Erc721' | 'Erc1155';
    balance: string;
    collectionName?: string;
    name?: string;
  }[];
  pageKey?: string;
}

export type EvmApprovalType = 'Erc20' | 'Operator' | 'Permit2';

export interface EvmApproval {
  type: EvmApprovalType;
  token: string;
  spender: string;
  amount?: string;
  approved?: boolean;
  blockNumber: number;
}

export interface EnsLookupResult {
  name: string;
  address?: string;
}

export interface EnsReverseLookupResult {
  address: string;
  name?: string;
}

/** BIP-353 payment request lookup (D36). */
export interface Bip353LookupResult {
  name: string;
  uri: string;
  dnssecValidated: boolean;
}

/** JSON-RPC request or batch item as sent to the wallet data RPC passthrough. */
export interface EvmRpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: unknown[];
}
