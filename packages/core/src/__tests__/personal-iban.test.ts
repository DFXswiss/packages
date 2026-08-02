import {
  PersonalIbanProvider,
  isUnrecognizedPersonalIbanSelector,
  normalizePersonalIban,
  toPersonalIbanProvider,
  toPersonalIbanProviderRequest,
} from '../definitions/buy';

describe('personal IBAN selectors', () => {
  describe('normalizePersonalIban', () => {
    it.each(['Frick', 'frick', 'FRICK', 'FrIcK'])('maps %s to the canonical provider spelling', (value) => {
      expect(normalizePersonalIban(value)).toBe(PersonalIbanProvider.FRICK);
    });

    it('returns undefined for an unset selector', () => {
      expect(normalizePersonalIban(undefined)).toBeUndefined();
    });

    it.each(['frik', 'other-bank', ''])('leaves the unknown selector %s unchanged', (value) => {
      expect(normalizePersonalIban(value)).toBe(value);
    });
  });

  describe('toPersonalIbanProvider', () => {
    it('resolves a known selector to the provider', () => {
      expect(toPersonalIbanProvider('frick')).toBe(PersonalIbanProvider.FRICK);
    });

    it.each([undefined, 'frik', ''])('returns undefined for %s', (value) => {
      expect(toPersonalIbanProvider(value)).toBeUndefined();
    });
  });

  describe('isUnrecognizedPersonalIbanSelector', () => {
    it('is false when no selector was set', () => {
      expect(isUnrecognizedPersonalIbanSelector(undefined)).toBe(false);
    });

    it('is false for a known provider', () => {
      expect(isUnrecognizedPersonalIbanSelector('FRICK')).toBe(false);
    });

    it.each(['frik', 'other-bank', ''])('is true for the unknown selector %s', (value) => {
      expect(isUnrecognizedPersonalIbanSelector(value)).toBe(true);
    });
  });

  describe('toPersonalIbanProviderRequest', () => {
    it('carries the canonical provider for a known selector', () => {
      expect(toPersonalIbanProviderRequest('frick')).toEqual({ personalIbanProvider: PersonalIbanProvider.FRICK });
    });

    it.each([undefined, 'frik'])('omits the provider for %s', (value) => {
      expect(toPersonalIbanProviderRequest(value)).toEqual({});
    });
  });
});
