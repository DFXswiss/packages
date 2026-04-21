import Validations from '../validations';

describe('Validations', () => {
  describe('Required', () => {
    it('returns required rule', () => {
      const rule = Validations.Required;
      expect(rule.required.value).toBe(true);
      expect(rule.required.message).toBe('required');
    });
  });

  describe('Mail', () => {
    it('returns pattern rule', () => {
      const rule = Validations.Mail;
      expect(rule.pattern.value).toBeInstanceOf(RegExp);
    });

    it('matches valid emails', () => {
      const { value: pattern } = Validations.Mail.pattern;
      expect(pattern.test('user@example.com')).toBe(true);
      expect(pattern.test('test.user@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      const { value: pattern } = Validations.Mail.pattern;
      expect(pattern.test('not-an-email')).toBe(false);
      expect(pattern.test('@domain.com')).toBe(false);
    });
  });

  describe('Phone', () => {
    it('accepts valid phone numbers', () => {
      const rule = Validations.Phone;
      expect(rule.validate('+41791234567')).toBe(true);
    });

    it('rejects numbers without country code', () => {
      const rule = Validations.Phone;
      expect(rule.validate('0791234567')).toBe('code_and_number');
    });

    it('accepts empty string', () => {
      const rule = Validations.Phone;
      expect(rule.validate('')).toBe(true);
    });
  });

  describe('Iban', () => {
    const countries = [{ symbol: 'CH' }, { symbol: 'DE' }] as any[];

    it('accepts valid Swiss IBAN', () => {
      const rule = Validations.Iban(countries);
      expect(rule.validate('CH9300762011623852957')).toBe(true);
    });

    it('rejects blocked country', () => {
      const rule = Validations.Iban(countries);
      expect(rule.validate('GB29NWBK60161331926819')).toBe('iban_country_blocked');
    });

    it('rejects invalid IBAN', () => {
      const rule = Validations.Iban(countries);
      expect(rule.validate('CH0000000000000000000')).toBe('pattern');
    });
  });

  describe('Custom', () => {
    it('creates custom validation rule', () => {
      const rule = Validations.Custom((v) => (v > 0 ? true : 'must_be_positive'));
      expect(rule.validate(5)).toBe(true);
      expect(rule.validate(-1)).toBe('must_be_positive');
    });
  });
});
