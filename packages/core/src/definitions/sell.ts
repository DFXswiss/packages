import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { TransactionError } from './transaction';

export const SellUrl = {
  quote: 'sell/quote',
  receive: 'sell/paymentInfos',
  confirm: 'sell/paymentInfos/:id/confirm',
};

// EIP-5792 wallet_sendCalls data for gasless transactions
export interface Eip5792Call {
  to: string;
  data: string;
  value: string;
}

export interface Eip5792Data {
  paymasterUrl: string;
  chainId: number;
  calls: Eip5792Call[];
}

export interface UnsignedTx {
  chainId: number;
  from: string;
  to: string;
  data: string;
  value: string;
  nonce: number;
  gasPrice: string;
  gasLimit: string;
  eip5792?: Eip5792Data;
}

export interface Sell {
  id: number;
  uid: string;
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
  beneficiary: Beneficiary;
  paymentRequest?: string;
  depositTx?: UnsignedTx;
  isValid: boolean;
  error?: TransactionError;
}

export interface Beneficiary {
  iban: string;
  name: string;
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

export interface ConfirmSellData {
  signedTxHex?: string;
  txHash?: string;
}
