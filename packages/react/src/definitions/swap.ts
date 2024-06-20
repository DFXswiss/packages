import { Asset } from './asset';
import { Fees } from './fees';
import { PriceStep } from './price-step';
import { TransactionError } from './transaction';

export const SwapUrl = { receive: 'swap/paymentInfos' };

export interface Swap {
  id: number;
  timestamp: Date;
  routeId: number;
  depositAddress: string;
  sourceAsset: Asset;
  targetAsset: Asset;
  fees: Fees;
  minVolume: number;
  maxVolume: number;
  amount: number;
  feesTarget: Fees;
  minVolumeTarget: number;
  maxVolumeTarget: number;
  exchangeRate: number;
  priceSteps: PriceStep[];
  rate: number;
  exactPrice: boolean;
  estimatedAmount: number;
  paymentRequest?: string;
  isValid: boolean;
  error?: TransactionError;
}

export interface SwapPaymentInfo {
  sourceAsset: Asset;
  amount?: number;
  targetAsset: Asset;
  targetAmount?: number;
  externalTransactionId?: string;
  exactPrice?: boolean;
}
