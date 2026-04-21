import { Utils } from '../utils';

describe('Utils', () => {
  describe('buildQuery', () => {
    it('returns empty string for empty params', () => {
      expect(Utils.buildQuery({})).toBe('');
    });

    it('returns empty string when all values are undefined', () => {
      expect(Utils.buildQuery({ a: undefined, b: undefined })).toBe('');
    });

    it('builds query from string params', () => {
      expect(Utils.buildQuery({ name: 'test', value: 'hello' })).toBe('?name=test&value=hello');
    });

    it('builds query from number params', () => {
      expect(Utils.buildQuery({ id: 42, limit: 10 })).toBe('?id=42&limit=10');
    });

    it('builds query from boolean params', () => {
      expect(Utils.buildQuery({ active: true, deleted: false })).toBe('?active=true&deleted=false');
    });

    it('skips undefined values', () => {
      expect(Utils.buildQuery({ a: 'yes', b: undefined, c: 'no' })).toBe('?a=yes&c=no');
    });

    it('handles array params as comma-joined', () => {
      expect(Utils.buildQuery({ blockchains: ['Ethereum', 'Bitcoin'] })).toBe('?blockchains=Ethereum,Bitcoin');
    });

    it('skips empty arrays', () => {
      expect(Utils.buildQuery({ tags: [] })).toBe('');
    });

    it('handles Date params as ISO string', () => {
      const date = new Date('2026-01-15T10:30:00.000Z');
      expect(Utils.buildQuery({ from: date })).toBe('?from=2026-01-15T10%3A30%3A00.000Z');
    });

    it('encodes special characters', () => {
      expect(Utils.buildQuery({ address: '0x1234&evil=true' })).toBe('?address=0x1234%26evil%3Dtrue');
    });
  });

  describe('buildQueryParams', () => {
    it('builds params without leading ?', () => {
      expect(Utils.buildQueryParams({ key: 'value' })).toBe('key=value');
    });

    it('skips undefined values', () => {
      expect(Utils.buildQueryParams({ a: 'yes', b: undefined })).toBe('a=yes');
    });
  });

  describe('formatAmount', () => {
    it('formats with default 2 decimals', () => {
      expect(Utils.formatAmount(1234.5678)).toBe('1 234.57');
    });

    it('formats with custom decimals', () => {
      expect(Utils.formatAmount(1234.5, 0)).toBe('1 235');
    });

    it('returns empty string for undefined', () => {
      expect(Utils.formatAmount(undefined)).toBe('');
    });
  });

  describe('formatAmountCrypto', () => {
    it('formats with significant digits', () => {
      expect(Utils.formatAmountCrypto(0.00123456)).toBe('0.00123');
    });

    it('trims trailing zeros', () => {
      expect(Utils.formatAmountCrypto(1.5)).toBe('1.5');
    });
  });

  describe('isJwt', () => {
    it('returns true for valid JWT format', () => {
      expect(Utils.isJwt('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123')).toBe(true);
    });

    it('returns false for invalid string', () => {
      expect(Utils.isJwt('not-a-jwt')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(Utils.isJwt(undefined)).toBe(false);
    });
  });

  describe('formatIban', () => {
    it('formats IBAN with spaces', () => {
      expect(Utils.formatIban('CH9300762011623852957')).toBe('CH93 0076 2011 6238 5295 7');
    });

    it('returns null for undefined', () => {
      expect(Utils.formatIban(undefined)).toBeNull();
    });
  });

  describe('groupBy', () => {
    it('groups items by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const result = Utils.groupBy(items, 'type');
      expect(result.get('a')).toEqual([
        { type: 'a', value: 1 },
        { type: 'a', value: 3 },
      ]);
      expect(result.get('b')).toEqual([{ type: 'b', value: 2 }]);
    });
  });

  describe('createRules', () => {
    it('merges array rules into objects', () => {
      const rules = {
        field: [{ required: true }, { minLength: 3 }],
      };
      const result = Utils.createRules(rules);
      expect(result.field).toEqual({ required: true, minLength: 3 });
    });
  });
});
