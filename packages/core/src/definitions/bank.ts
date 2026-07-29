export const BankUrl = {
  get: 'bank',
  receiveIban: 'bank/receiveIban',
};

export interface Bank {
  name: string;
  iban: string;
  bic: string;
  currency: string;
}

export enum ReceiveIbanStatus {
  /** The IBAN is a DFX IBAN. This does not imply that it currently accepts payments. */
  DFX_IBAN = 'DfxIban',
  /**
   * No match was found for this request. This is not a statement that the IBAN is not DFX's - word it as "could
   * not recognize", never as "not ours".
   */
  NOT_MATCHED = 'NotMatched',
  /** Not a valid IBAN. */
  INVALID_IBAN = 'InvalidIban',
  /**
   * No match was found and the request carried no account-scoped identity, so the check is incomplete. Prompt for
   * login instead of reporting the IBAN as unknown.
   */
  LOGIN_REQUIRED = 'LoginRequired',
}

export interface ReceiveIbanCheck {
  status: ReceiveIbanStatus;
}
