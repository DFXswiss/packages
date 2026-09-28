import { toKycNationalityRequest } from '../index';
import type { Country } from '../definitions/country';

describe('React package public exports', () => {
  it('exports the KYC nationality request converter from the package barrel', () => {
    const nationality = { id: 756, symbol: 'CH' } as Country;
    expect(toKycNationalityRequest({ nationality })).toEqual({ nationality });
  });
});
