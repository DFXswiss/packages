import type { User } from '../definitions/user';

export type UserSnapshot = { identity: string; user: User };

export function createUserRequestIdentity(
  account: string,
  user?: string | number,
  address?: string,
  role?: string,
): string {
  const evmAddress = address && /^0x[0-9a-f]+$/i.test(address) ? address.toLowerCase() : address;
  return `${account}:${user ?? ''}:${evmAddress ?? ''}:${role ?? ''}`;
}

export function isMatchingAddress(first: string | undefined, second: string | undefined): boolean {
  if (first === second) return true;
  if (first === undefined || second === undefined) return false;
  const evmAddress = /^0x[0-9a-f]+$/i;
  return evmAddress.test(first) && evmAddress.test(second) && first.toLowerCase() === second.toLowerCase();
}

type UserScope = { account?: unknown; user?: unknown; address?: unknown; role?: unknown };

function hasValidScopeClaims(scope: UserScope | undefined): scope is UserScope & { account: number; user: number } {
  return (
    scope !== undefined &&
    typeof scope.account === 'number' &&
    Number.isSafeInteger(scope.account) &&
    scope.account > 0 &&
    typeof scope.user === 'number' &&
    Number.isSafeInteger(scope.user) &&
    scope.user > 0 &&
    (scope.address === undefined || (typeof scope.address === 'string' && scope.address.length > 0)) &&
    typeof scope.role === 'string' &&
    scope.role.length > 0
  );
}

export function hasSameUserScope(first: UserScope | undefined, second: UserScope | undefined): boolean {
  return (
    hasValidScopeClaims(first) &&
    hasValidScopeClaims(second) &&
    first.account === second.account &&
    first.user === second.user &&
    first.role === second.role &&
    isMatchingAddress(first.address as string | undefined, second.address as string | undefined)
  );
}

export function userForSession(
  snapshot: UserSnapshot | undefined,
  identity: string | undefined,
  sessionAddress: string | undefined,
): User | undefined {
  const user = snapshot && identity !== undefined && snapshot.identity === identity ? snapshot.user : undefined;
  if (!user) return undefined;
  if (sessionAddress === undefined) return { ...user, activeAddress: undefined };
  return {
    ...user,
    activeAddress: user.addresses.find((address) => isMatchingAddress(address.address, sessionAddress)),
  };
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
