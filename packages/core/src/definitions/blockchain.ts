export enum Blockchain {
  BITCOIN = 'Bitcoin',
  LIGHTNING = 'Lightning',
  SPARK = 'Spark',
  ARKADE = 'Arkade',
  FIRO = 'Firo',
  MONERO = 'Monero',
  ZANO = 'Zano',
  INTERNET_COMPUTER = 'InternetComputer',
  ETHEREUM = 'Ethereum',
  SEPOLIA = 'Sepolia',
  BINANCE_SMART_CHAIN = 'BinanceSmartChain',
  OPTIMISM = 'Optimism',
  ARBITRUM = 'Arbitrum',
  POLYGON = 'Polygon',
  BASE = 'Base',
  GNOSIS = 'Gnosis',
  HAQQ = 'Haqq',
  LIQUID = 'Liquid',
  ARWEAVE = 'Arweave',
  CARDANO = 'Cardano',
  RAILGUN = 'Railgun',
  SOLANA = 'Solana',
  TRON = 'Tron',
  CITREA = 'Citrea',
  CITREA_TESTNET = 'CitreaTestnet',

  DEFICHAIN = 'DeFiChain',
}

export const BlockchainUrl = {
  balances: 'blockchain/balances',
  transaction: 'blockchain/transaction',
  broadcast: 'blockchain/broadcast',
};

export interface GetBlockchainBalances {
  address: string;
  blockchain: Blockchain;
  /** Restricts the response to these assets; without it the API decides what to report. */
  assetIds?: number[];
}

export interface BlockchainBalance {
  assetId: number;
  chainId?: string;
  balance: number;
}

export interface BlockchainBalances {
  balances: BlockchainBalance[];
}

export interface CreateBlockchainTransaction {
  blockchain: Blockchain;
  fromAddress: string;
  toAddress: string;
  amount: number;
  /** Omit to send the native coin of the blockchain. */
  assetId?: number;
}

/**
 * An unsigned transaction. The payload format is chain-specific and is not always what `encoding`
 * says - read it together with the blockchain the transaction was requested for. Decoding and
 * signing need a chain-specific library and stay with the caller.
 */
export interface UnsignedTransaction {
  rawTransaction: string;
  encoding: 'base64' | 'hex';
  recentBlockhash?: string;
  expiration?: number;
}

export interface BroadcastTransaction {
  blockchain: Blockchain;
  signedTransaction: string;
}

export interface BroadcastResult {
  txHash: string;
}
