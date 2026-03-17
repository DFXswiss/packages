export interface Fees {
  rate: number;
  fixed: number;
  min: number;
  dfx: number;
  bank: number;
  bankFixed?: number;
  bankPercent?: number;
  network: number;
  total: number;
  networkStart?: number;
}
