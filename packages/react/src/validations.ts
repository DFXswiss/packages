import * as IbanTools from 'ibantools';
import BlockedIbans from './definitions/blocked-iban.json';
import PhoneNumber from 'libphonenumber-js';
import { Country } from './definitions/country';

const regex = {
  Mail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export type RequiredRule = {
  required: { value: boolean; message: string };
};

export type PatternRule = {
  pattern: { value: RegExp; message: string };
};

export type CustomRule = {
  validate: (value: any) => string | true;
};

export type ValidationRule = RequiredRule | PatternRule | CustomRule;

class ValidationsClass {
  public get Required(): RequiredRule {
    return {
      required: {
        value: true,
        message: 'required',
      },
    };
  }

  public get Mail(): PatternRule {
    return {
      pattern: {
        value: regex.Mail,
        message: 'pattern',
      },
    };
  }

  public get Phone(): CustomRule {
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

  public Iban(countries: Country[]): CustomRule {
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

  public Custom(validator: (value: any) => true | string): CustomRule {
    return {
      validate: validator,
    };
  }
}

const Validations = new ValidationsClass();
export default Validations;
