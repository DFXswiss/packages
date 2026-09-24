import {
  decrementUserUpdate,
  incrementUserUpdate,
  isCurrentUserRequest,
  isUserUpdatingForIdentity,
  userForSession,
  type UserUpdateCounts,
} from '../contexts/user-identity';
import type { User } from '../definitions/user';

describe('user context account isolation', () => {
  const userA = {
    accountId: 101,
    addresses: [{ address: 'address-a' }, { address: 'address-b' }],
    activeAddress: { address: 'address-a' },
  } as User;

  it('masks account A data synchronously when the session switches to account B', () => {
    expect(userForSession({ identity: '101', user: userA }, '202', 'address-b')).toBeUndefined();
    expect(userForSession({ identity: '101', user: userA }, undefined, undefined)).toBeUndefined();
    expect(userForSession(undefined, undefined, undefined)).toBeUndefined();
  });

  it('keeps the same account snapshot across address changes but rejects its late request', () => {
    const snapshot = { identity: '101', user: userA };

    const sameAccount = userForSession(snapshot, '101', 'address-b');
    expect(sameAccount?.addresses).toBe(userA.addresses);
    expect(sameAccount?.activeAddress?.address).toBe('address-b');
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '101', '101:user-a:address-b')).toBe(false);
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '202', '202:user-b:address-b')).toBe(false);
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '101', '101:user-a:address-a')).toBe(true);
  });

  it('matches EVM session addresses without case but keeps other chain addresses exact', () => {
    const snapshot = {
      identity: '101',
      user: {
        ...userA,
        addresses: [{ address: '0xAbCd00000000000000000000000000000000Ef12' }, { address: 'bc1qCaseSensitive' }],
      } as User,
    };

    expect(userForSession(snapshot, '101', '0xabcd00000000000000000000000000000000ef12')?.activeAddress?.address).toBe(
      '0xAbCd00000000000000000000000000000000Ef12',
    );
    expect(userForSession(snapshot, '101', 'bc1qcasesensitive')?.activeAddress).toBeUndefined();
  });

  it('hides the active address when the session has no address yet', () => {
    expect(userForSession({ identity: '101', user: userA }, '101', undefined)?.activeAddress).toBeUndefined();
  });

  it('keeps account B updating when an earlier account A operation completes', () => {
    let counts: UserUpdateCounts = {};
    counts = incrementUserUpdate(counts, 'account-a:address-a');
    counts = incrementUserUpdate(counts, 'account-a:address-a');
    counts = incrementUserUpdate(counts, 'account-b:address-b');

    counts = decrementUserUpdate(counts, 'account-a:address-a');
    expect(counts['account-a:address-a']).toBe(1);
    expect(isUserUpdatingForIdentity(counts, 'account-b:address-b')).toBe(true);

    counts = decrementUserUpdate(counts, 'account-a:address-a');
    expect(counts['account-a:address-a']).toBeUndefined();
    expect(isUserUpdatingForIdentity(counts, 'account-b:address-b')).toBe(true);
    expect(isUserUpdatingForIdentity(counts, undefined)).toBe(false);
  });
});
