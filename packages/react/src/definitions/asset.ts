import { Blockchain } from './blockchain';

export const AssetUrl = { get: `asset?blockchains=${Object.values(Blockchain).join(',')}` };

export enum AssetType {
  COIN = 'Coin',
  TOKEN = 'Token',
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
}
