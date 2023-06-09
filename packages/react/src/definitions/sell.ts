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
  estimatedAmount: number;
  paymentRequest?: string;
}

export interface SellPaymentInfo {
  iban: string;
  currency: Fiat;
  asset: Asset;
  amount: number;
}
