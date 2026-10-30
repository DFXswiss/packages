const EVM_ADDRESS = /^0x[0-9a-fA-F]{40}$/;

/**
 * Seed check: the derived EVM index-0 address must equal the stored seed check address (server value at login or
 * the per-origin cache). Case-insensitive; anything that is not a 20-byte hex address never matches.
 */
export function seedCheck(derivedEvm0: string, expected: string): boolean {
  if (typeof derivedEvm0 !== 'string' || typeof expected !== 'string') return false;
  if (!EVM_ADDRESS.test(derivedEvm0) || !EVM_ADDRESS.test(expected)) return false;
  return derivedEvm0.toLowerCase() === expected.toLowerCase();
}
