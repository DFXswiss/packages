import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fiat } from './fiat';
import { TransactionError } from './transaction';

export const SellUrl = { receive: 'sell/paymentInfos' };

export interface Sell {
  routeId: number;
  depositAddress: string;
  blockchain: Blockchain;
  fee: number;
  minFee: number;
  minVolume: number;
  maxVolume: number;
  minFeeTarget: number;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  amount: number;
  asset: Asset;
  estimatedAmount: number;
  rate: number;
  exchangeRate: number;
  currency: Fiat;
  paymentRequest?: string;
  isValid: boolean;
  error?: TransactionError;
}

export interface SellPaymentInfo {
  iban: string;
  asset: Asset;
  amount?: number;
  currency: Fiat;
  targetAmount?: number;
  externalTransactionId?: string;
}
