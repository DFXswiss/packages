import type { ChainInfo } from '@dfx.swiss/core';

/**
 * Release-pinned registry fallback per environment (§9.2): chains, asset list and blocklists as bundled at
 * build time. Live API answers always replace it.
 */
export interface WalletSnapshot {
  env: string;
  createdAt: string;
  chains: ChainInfo[];
  assets: SnapshotAsset[];
  blocklists: SnapshotBlocklists;
}

export interface SnapshotAsset {
  id: number;
  blockchain: string;
  name: string;
  uniqueName?: string;
  chainId?: number;
  decimals?: number;
  buyable: boolean;
  sellable: boolean;
  isPrivate: boolean;
}

export interface SnapshotBlocklists {
  phishingDomains: string[];
  scamAddresses: string[];
}
