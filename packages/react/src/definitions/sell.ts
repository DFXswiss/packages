import { Asset } from './asset';
import { Blockchain } from './blockchain';
import { Fees } from './fees';
import { Fiat } from './fiat';
import { PriceStep } from './price-step';
import { TransactionError } from './transaction';

export const SellUrl = {
  receive: 'sell/paymentInfos',
  confirm: 'sell/paymentInfos/:id/confirm'
};

export interface Eip7702DelegationData {
  relayerAddress: string;
  delegationManagerAddress: string;
  delegatorAddress: string;
  userNonce: number;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    Delegation: Array<{ name: string; type: string }>;
    Caveat: Array<{ name: string; type: string }>;
  };
  message: {
    delegate: string;
    delegator: string;
    authority: string;
    caveats: any[];
    salt: string;
  };
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
  eip7702?: Eip7702DelegationData;
  usePaymaster?: boolean;
  paymasterUrl?: string;
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

export interface Eip7702Authorization {
  chainId: number | string;
  address: string;
  nonce: number | string;
  r: string;
  s: string;
  yParity: number;
}

export interface Eip7702SignedData {
  delegation: {
    delegate: string;
    delegator: string;
    authority: string;
    salt: string;
    signature: string;
  };
  authorization: Eip7702Authorization;
}

export interface ConfirmSellData {
  signedTxHex?: string;
  eip7702?: Eip7702SignedData;
}
