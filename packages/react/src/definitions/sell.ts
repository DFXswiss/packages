import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { TransactionError } from './transaction';

export const SellUrl = { receive: 'sell/paymentInfos' };

export interface Sell {
  id: number;
  timestamp: Date;
  routeId: number;
  depositAddress: string;
  blockchain: Blockchain;
  fees: Fees;
  minVolume: number;
  maxVolume: number;
  amount: number;
  asset: Asset;
  feesTarget: Fees;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  exchangeRate: number;
  priceSteps: PriceStep[];
  rate: number;
  exactPrice: boolean;
  estimatedAmount: number;
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
  exactPrice?: boolean;
}
