import { Blockchain } from './blockchain';

/** Chain classification of the wallet data capability (D23, backend `ChainClassificationDto`). */
export const ChainUrl = {
  classification: 'walletData/chains',
};

export type ChainFamily = 'Bitcoin' | 'Evm' | 'Spark';

export type EvmFeeModel = 'Eip1559' | 'OpStack';

export interface ChainCapabilities {
  /** The DFX API broadcasts raw transactions of this chain. */
  backendBroadcast: boolean;
  payInDetection: boolean;
  gasless: boolean;
  feeModel?: EvmFeeModel;
  history: boolean;
  tokens: boolean;
  nfts: boolean;
  approvals: boolean;
}

export interface NativeAssetInfo {
  id: number;
  name: string;
  decimals?: number;
}

export interface ChainInfo {
  blockchain: Blockchain;
  family: ChainFamily;
  /** Undefined for Haqq (no numeric chain id). */
  chainId?: number;
  /** Environment-independent testnet marker. */
  isTestnet: boolean;
  isActive: boolean;
  /** Whether the wallet may use this chain in the current environment (D23 + D28). */
  walletSupported: boolean;
  nativeAsset?: NativeAssetInfo;
  explorerUrl?: string;
  /** Read-only display RPC; the wallet always talks to the DFX API (D8). */
  publicRpcUrl?: string;
  capabilities: ChainCapabilities;
}
