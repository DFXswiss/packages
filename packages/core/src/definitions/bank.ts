export const BankUrl = {
  get: 'bank',
  receiveIban: 'bank/receive-iban',
};

export interface Bank {
  name: string;
  iban: string;
  bic: string;
  currency: string;
}

export enum ReceiveIbanStatus {
  DFX_IBAN = 'DfxIban',
  // valid IBAN, but not attributable for this caller - no claim that DFX does not own it
  NOT_MATCHED = 'NotMatched',
  INVALID_IBAN = 'InvalidIban',
  LOGIN_REQUIRED = 'LoginRequired',
}

export interface ReceiveIbanCheck {
  status: ReceiveIbanStatus;
}
