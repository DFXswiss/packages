import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fiat } from './fiat';

export const SellUrl = { receive: 'sell/paymentInfos' };

export interface Sell {
  routeId: number;
  depositAddress: string;
  blockchain: Blockchain;
  fee: number;
  minFee: number;
  minVolume: number;
  minFeeTarget: number;
  minVolumeTarget: number;
  amount: number;
  asset: Asset;
  estimatedAmount: number;
  currency: Fiat;
  paymentRequest?: string;
}

export interface SellPaymentInfo {
  iban: string;
  asset: Asset;
  amount?: number;
  currency: Fiat;
  targetAmount?: number;
}
