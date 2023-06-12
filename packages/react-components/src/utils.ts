import * as IbanTools from 'ibantools';

export class Utils {
  static formatIban(iban?: string): string | null {
    return IbanTools.friendlyFormatIBAN(iban);
  }
}
