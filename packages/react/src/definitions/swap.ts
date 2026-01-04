import { Asset } from './asset';
import { Fees } from './fees';
import { PriceStep } from './price-step';
import { UnsignedTx } from './sell';
import { TransactionError } from './transaction';

export const SwapUrl = {
  receive: 'swap/paymentInfos',
  confirm: 'swap/paymentInfos/:id/confirm'
};

export interface Swap {
  id: number;
  uid: string;
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
  depositTx?: UnsignedTx;
  isValid: boolean;
  error?: TransactionError;
}

export interface SwapPaymentInfo {
  sourceAsset: Asset;
  amount?: number;
  targetAsset: Asset;
  targetAmount?: number;
  receiverAddress?: string;
  externalTransactionId?: string;
  exactPrice?: boolean;
}

export interface ConfirmSwapData {
  signedTxHex?: string;
  txHash?: string; // Transaction hash from wallet_sendCalls
}
