import { Asset } from './asset';
import { Fiat } from './fiat';

export const BuyUrl = { receive: 'buy/paymentInfos' };

export interface Buy {
  name: string;
  country: string;
  street: string;
  city: string;
  zip: string;
  number: string;
  fee: number;
  iban: string;
  bic: string;
  remittanceInfo: string;
  minFee: number;
  minVolume: number;
  minFeeTarget: number;
  minVolumeTarget: number;
  estimatedAmount: number;
  sepaInstant: boolean;
}

export interface BuyPaymentInfo {
  currency: Fiat;
  amount: number;
  asset: Asset;
}
