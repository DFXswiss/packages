import { seedCheck } from '../derivation/seed-check';

describe('seed check', () => {
  const address = '0x9858EfFD232B4033E47d90003D41EC34EcaEda94';

  it('accepts equal addresses case-insensitively', () => {
    expect(seedCheck(address, address)).toBe(true);
    expect(seedCheck(address.toLowerCase(), address)).toBe(true);
    expect(seedCheck(address, address.toLowerCase())).toBe(true);
  });

  it('rejects different addresses', () => {
    expect(seedCheck(address, '0x0000000000000000000000000000000000000001')).toBe(false);
  });

  it('rejects inputs that are not 20-byte hex addresses', () => {
    expect(seedCheck(address, '')).toBe(false);
    expect(seedCheck(address, '0x1234')).toBe(false);
    expect(seedCheck(address, 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu')).toBe(false);
    expect(seedCheck(address, '0x9858EfFD232B4033E47d90003D41EC34EcaEda9Z')).toBe(false);
    expect(seedCheck('', address)).toBe(false);
    expect(seedCheck(undefined as unknown as string, address)).toBe(false);
    expect(seedCheck(address, null as unknown as string)).toBe(false);
  });
});
