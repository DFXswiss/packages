export interface Fees {
  rate: number;
  fixed: number;
  min: number;
  dfx: number;
  bank: number;
  bankFixed?: number;
  bankVariable?: number;
  network: number;
  total: number;
  networkStart?: number;
  platform: number;
}
