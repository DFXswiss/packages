export const CountryUrl = { get: 'country' };

export interface Country {
  id: number;
  symbol: string;
  name: string;
  locationAllowed: boolean;
  kycAllowed: boolean;
  nationalityAllowed: boolean;
  bankAllowed: boolean;
  cardAllowed: boolean;
}
