import { Blockchain } from './blockchain';

const chains = Object.values(Blockchain).filter((c) => c !== Blockchain.DEFICHAIN);
export const AssetUrl = { get: `asset?blockchains=${chains.join(',')}&includePrivate=true` };

export enum AssetType {
  COIN = 'Coin',
  TOKEN = 'Token',
}

export enum AssetCategory {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
}

export interface Asset {
  id: number;
  name: string;
  uniqueName: string;
  description: string;

  buyable: boolean;
  sellable: boolean;
  cardBuyable: boolean;
  cardSellable: boolean;
  instantBuyable: boolean;
  instantSellable: boolean;

  blockchain: Blockchain;
  comingSoon: boolean;
  sortOrder?: number;
  chainId?: string;
  explorerUrl?: string;
  type: AssetType;
  category: AssetCategory;
}
