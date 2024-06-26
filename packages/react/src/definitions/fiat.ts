export const FiatUrl = { get: 'fiat' };

export interface Fiat {
  id: number;
  name: string;
  buyable: boolean;
  sellable: boolean;
  cardBuyable: boolean;
  cardSellable: boolean;
  instantBuyable: boolean;
  instantSellable: boolean;
}
