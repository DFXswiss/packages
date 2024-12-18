export interface Fees {
  rate: number;
  fixed: number;
  min: number;
  dfx: number;
  bank: number;
  network: number;
  total: number;
  networkStart?: number;
}
