import * as IbanTools from 'ibantools';

export class Utils {
  static formatIban(iban?: string): string | null {
    return IbanTools.friendlyFormatIBAN(iban);
  }

  static isNode(e: EventTarget | null): e is Node {
    return e != null && 'nodeType' in e;
  }
}
