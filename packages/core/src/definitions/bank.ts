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
  /**
   * Either a collective DFX account or the requesting account's own personal deposit IBAN. Does not imply that the
   * account currently accepts incoming funds.
   */
  DFX_IBAN = 'DfxIban',
  /**
   * Valid IBAN, but not attributable to the requesting account. This is no claim that DFX does not own it: an IBAN
   * the same customer used earlier can end up here, and the personal IBAN of another customer is never checked.
   * Never phrase this to the user as "this IBAN does not belong to DFX".
   */
  NOT_MATCHED = 'NotMatched',
  /** Not a valid IBAN. */
  INVALID_IBAN = 'InvalidIban',
  /**
   * No collective account matched and the request carried no account-scoped identity, so personal IBANs were not
   * checked. Returned instead of NotMatched to signal that the check is incomplete, not that the IBAN is unknown.
   */
  LOGIN_REQUIRED = 'LoginRequired',
}

export interface ReceiveIbanCheck {
  status: ReceiveIbanStatus;
}
