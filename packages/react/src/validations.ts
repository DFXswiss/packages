import * as IbanTools from 'ibantools';
import BlockedIbans from './definitions/blocked-iban.json';
import PhoneNumber from 'libphonenumber-js';
import { Country } from './definitions/country';

const regex = {
  Mail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export type ValidationRule = {
  required?: { value: boolean; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (val: any) => string | true;
};

class ValidationsClass {
  public get Required(): ValidationRule {
    return {
      required: {
        value: true,
        message: 'required',
      },
    };
  }

  public get Mail(): ValidationRule {
    return {
      pattern: {
        value: regex.Mail,
        message: 'pattern',
      },
    };
  }

  public get Phone(): ValidationRule {
    return this.Custom((number: string) => {
      try {
        if (number) {
          if (!/^\+\d+$/.test(number)) return 'code_and_number';
          if (!PhoneNumber(number)?.isValid()) return 'pattern';
        }

        return true;
      } catch {
        return 'pattern';
      }
    });
  }

  public Iban(countries: Country[]): ValidationRule {
    return this.Custom((iban: string) => {
      iban = iban.split(' ').join('');

      // check country
      const allowedCountries = countries.map((c) => c.symbol.toLowerCase());
      if (iban.length >= 2 && !allowedCountries.find((c) => iban.toLowerCase().startsWith(c))) {
        return 'iban_country_blocked';
      }

      // check blocked IBANs
      const blockedIbans = BlockedIbans.map((i) => i.split(' ').join('').toLowerCase());
      if (blockedIbans.some((i) => iban.toLowerCase().match(i) != null)) {
        return 'iban_blocked';
      }

      return IbanTools.validateIBAN(iban).valid ? true : 'pattern';
    });
  }

  public Custom(validator: (val: any) => string | true): ValidationRule {
    return {
      validate: validator,
    };
  }
}

const Validations = new ValidationsClass();
export default Validations;
