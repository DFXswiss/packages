import * as IbanTools from 'ibantools';
import BlockedIbans from './definitions/blocked-iban.json';
import PhoneNumber from 'libphonenumber-js';
import { Country } from './definitions/country';

const regex = {
  Mail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

class ValidationsClass {
  public get Required() {
    return {
      required: {
        value: true,
        message: 'Mandatory field',
      },
    };
  }

  public get Mail() {
    return {
      pattern: {
        value: regex.Mail,
        message: 'Invalid E-mail address',
      },
    };
  }

  public get Phone() {
    return this.Custom((number: string) => {
      try {
        if (number) {
          if (!number.match(/^\+\d/)) return 'Please fill in area code and number';
          if (!PhoneNumber(number)?.isValid()) return 'Invalid pattern';
        }

        return true;
      } catch {
        return 'Invalid pattern';
      }
    });
  }

  public Iban(countries: Country[]) {
    return this.Custom((iban: string) => {
      iban = iban.split(' ').join('');

      // check country
      const allowedCountries = countries.map((c) => c.symbol.toLowerCase());
      if (iban.length >= 2 && !allowedCountries.find((c) => iban.toLowerCase().startsWith(c))) {
        return 'IBAN country code not allowed';
      }

      // check blocked IBANs
      const blockedIbans = BlockedIbans.map((i) => i.split(' ').join('').toLowerCase());
      if (blockedIbans.some((i) => iban.toLowerCase().match(i) != null)) {
        return 'IBAN not allowed';
      }

      return IbanTools.validateIBAN(iban).valid ? true : 'Invalid IBAN';
    });
  }

  public Custom = (validator: (value: any) => true | string) => ({
    validate: (val: any) => validator(val),
  });
}

const Validations = new ValidationsClass();
export default Validations;
