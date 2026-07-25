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
   * Either a collective DFX account or the requesting account's own personal deposit IBAN. Whether that account still
   * receives is not implied - many are decommissioned.
   */
  DFX_IBAN = 'DfxIban',
  /**
   * Valid IBAN, but not attributable for this caller. This is no claim that DFX does not own it: the personal IBAN of
   * another customer is never checked, and after an account merge personal IBANs stay with the old account.
   */
  NOT_MATCHED = 'NotMatched',
  /** Not a valid IBAN. */
  INVALID_IBAN = 'InvalidIban',
  /**
   * No collective account matched and the caller is not logged in, so personal IBANs were not checked. Returned
   * instead of NotMatched to signal that the check is incomplete, not that the IBAN is unknown to DFX.
   */
  LOGIN_REQUIRED = 'LoginRequired',
}

export interface ReceiveIbanCheck {
  status: ReceiveIbanStatus;
}
