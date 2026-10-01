import { UserRole } from '../definitions/jwt';

describe('UserRole', () => {
  const values = Object.values(UserRole);

  it('has no duplicate values', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const value of values) {
      if (seen.has(value)) {
        duplicates.push(value);
      }
      seen.add(value);
    }
    expect(duplicates).toEqual([]);
  });

  it('uses contiguous PascalCase contract strings', () => {
    // Anchored: rejects trailing/embedded junk (spaces, hyphens, underscores, digits, …).
    // Allows VIP and KycClientCompany (single PascalCase / all-caps word).
    const pattern = /^[A-Z][A-Za-z]*$/;
    const invalid = values.filter((value) => !pattern.test(value));
    expect(invalid).toEqual([]);
  });

  it('has exactly 13 members', () => {
    expect(values).toHaveLength(13);
  });
});
