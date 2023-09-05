import { Asset } from './asset';
import { Fiat } from './fiat';

export const BuyUrl = { receive: 'buy/paymentInfos' };

export interface Buy {
  name: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  country: string;
  iban: string;
  bic: string;
  sepaInstant: boolean;
  routeId: number;
  remittanceInfo: string;
  fee: number;
  minFee: number;
  minVolume: number;
  minFeeTarget: number;
  minVolumeTarget: number;
  amount: number;
  currency: Fiat;
  estimatedAmount: number;
  asset: Asset;
  paymentRequest: string;
}

export interface BuyPaymentInfo {
  currency: Fiat;
  amount?: number;
  asset: Asset;
  targetAmount?: number;
}
