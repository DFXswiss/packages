import {
  createUserRequestIdentity,
  decrementUserUpdate,
  hasSameUserScope,
  incrementUserUpdate,
  isMatchingAddress,
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
    expect(
      userForSession({ identity: '101:user-a:address-a:User', user: userA }, '202:user-b:address-b:User', 'address-b'),
    ).toBeUndefined();
    expect(userForSession({ identity: '101', user: userA }, undefined, undefined)).toBeUndefined();
    expect(userForSession(undefined, undefined, undefined)).toBeUndefined();
  });

  it('masks a snapshot when user or address changes within the same account', () => {
    const snapshot = { identity: '101:user-a:address-a:User', user: userA };

    expect(userForSession(snapshot, '101:user-a:address-b:User', 'address-b')).toBeUndefined();
    expect(userForSession(snapshot, '101:user-b:address-a:User', 'address-a')).toBeUndefined();
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '101', '101:user-a:address-b')).toBe(false);
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '202', '202:user-b:address-b')).toBe(false);
    expect(isCurrentUserRequest('101', '101:user-a:address-a', '101', '101:user-a:address-a')).toBe(true);
  });

  it('matches EVM session addresses without case but keeps other chain addresses exact', () => {
    const address = '0xAbCd00000000000000000000000000000000Ef12';
    const snapshot = {
      identity: createUserRequestIdentity('101', 'user-a', address, 'User'),
      user: {
        ...userA,
        addresses: [{ address }, { address: 'bc1qCaseSensitive' }],
      } as User,
    };

    const lowerCaseAddress = '0xabcd00000000000000000000000000000000ef12';
    expect(
      userForSession(snapshot, createUserRequestIdentity('101', 'user-a', lowerCaseAddress, 'User'), lowerCaseAddress)
        ?.activeAddress?.address,
    ).toBe(address);
    expect(
      userForSession(
        snapshot,
        createUserRequestIdentity('101', 'user-a', 'bc1qcasesensitive', 'User'),
        'bc1qcasesensitive',
      )?.activeAddress,
    ).toBeUndefined();
  });

  it('normalizes optional identity claims and requires both address claims to be valid before folding case', () => {
    expect(createUserRequestIdentity('account')).toBe('account:::');
    expect(createUserRequestIdentity('account', 17, 'bc1qCaseSensitive', 'User')).toBe(
      'account:17:bc1qCaseSensitive:User',
    );
    expect(isMatchingAddress('0xAbC123', '0xabc123')).toBe(true);
    expect(isMatchingAddress('bc1qExample', 'bc1qExample')).toBe(true);
    expect(isMatchingAddress('bc1qExample', 'bc1qexample')).toBe(false);
    expect(isMatchingAddress(undefined, undefined)).toBe(true);
    expect(isMatchingAddress(undefined, 'address')).toBe(false);
    expect(isMatchingAddress('0xAbC', '0xabc!')).toBe(false);
  });

  it('requires valid account and user claims and the same role for equal auth scopes', () => {
    expect(hasSameUserScope({}, {})).toBe(false);
    expect(hasSameUserScope({ account: 101, role: 'User' }, { account: 101, role: 'User' })).toBe(false);
    expect(
      hasSameUserScope(
        { account: 101, user: 11, address: 'address-a', role: 'User' },
        { account: 101, user: 11, address: 'address-a', role: 'User' },
      ),
    ).toBe(true);
    expect(
      hasSameUserScope(
        { account: 101, user: 11, address: 'address-a', role: 'User' },
        { account: 101, user: 11, address: 'address-a', role: 'Admin' },
      ),
    ).toBe(false);
    expect(hasSameUserScope(undefined, {})).toBe(false);
    expect(hasSameUserScope({ account: 0, user: 11, role: 'User' }, { account: 0, user: 11, role: 'User' })).toBe(
      false,
    );
    expect(hasSameUserScope({ account: 1.5, user: 11, role: 'User' }, { account: 1.5, user: 11, role: 'User' })).toBe(
      false,
    );
    expect(hasSameUserScope({ account: 101, user: 0, role: 'User' }, { account: 101, user: 0, role: 'User' })).toBe(
      false,
    );
    expect(hasSameUserScope({ account: 101, user: 11, role: '' }, { account: 101, user: 11, role: '' })).toBe(false);
    expect(
      hasSameUserScope(
        { account: 101, user: 11, address: '', role: 'User' },
        { account: 101, user: 11, address: '', role: 'User' },
      ),
    ).toBe(false);
    expect(
      hasSameUserScope(
        { account: 101, user: 11, address: 123, role: 'User' },
        { account: 101, user: 11, address: 123, role: 'User' },
      ),
    ).toBe(false);
  });

  it('hides the active address when the session has no address yet', () => {
    expect(
      userForSession({ identity: '101:user-a::User', user: userA }, '101:user-a::User', undefined)?.activeAddress,
    ).toBeUndefined();
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
    expect(decrementUserUpdate({}, 'absent')).toEqual({});
  });
});
