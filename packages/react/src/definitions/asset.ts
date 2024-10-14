import { Blockchain } from './blockchain';

export const AssetUrl = { get: 'asset' };

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
  decimals: number;
  explorerUrl?: string;
  type: AssetType;
  category: AssetCategory;
}
