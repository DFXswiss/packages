import type { User } from '../definitions/user';

export type UserSnapshot = { identity: string; user: User };

export function userForSession(
  snapshot: UserSnapshot | undefined,
  identity: string | undefined,
  sessionAddress: string | undefined,
): User | undefined {
  const user = snapshot && identity !== undefined && snapshot.identity === identity ? snapshot.user : undefined;
  if (!user) return undefined;
  if (sessionAddress === undefined) return { ...user, activeAddress: undefined };
  const isMatchingAddress = (storedAddress: string): boolean => {
    const evmAddress = /^0x[0-9a-f]+$/i;
    return evmAddress.test(storedAddress) && evmAddress.test(sessionAddress)
      ? storedAddress.toLowerCase() === sessionAddress.toLowerCase()
      : storedAddress === sessionAddress;
  };
  return { ...user, activeAddress: user.addresses.find((address) => isMatchingAddress(address.address)) };
}

export type UserUpdateCounts = Record<string, number>;

export function incrementUserUpdate(counts: UserUpdateCounts, identity: string): UserUpdateCounts {
  return { ...counts, [identity]: (counts[identity] ?? 0) + 1 };
}

export function decrementUserUpdate(counts: UserUpdateCounts, identity: string): UserUpdateCounts {
  const count = counts[identity] ?? 0;
  if (count <= 1) {
    const { [identity]: _finished, ...remaining } = counts;
    return remaining;
  }
  return { ...counts, [identity]: count - 1 };
}

export function isUserUpdatingForIdentity(counts: UserUpdateCounts, identity: string | undefined): boolean {
  return identity !== undefined && (counts[identity] ?? 0) > 0;
}

export function isCurrentUserRequest(
  expectedIdentity: string,
  expectedRequestIdentity: string,
  currentIdentity: string | undefined,
  currentRequestIdentity: string | undefined,
): boolean {
  return currentIdentity === expectedIdentity && currentRequestIdentity === expectedRequestIdentity;
}
