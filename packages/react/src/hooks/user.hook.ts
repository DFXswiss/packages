import { useMemo } from 'react';
import { Referral, User, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  changeUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  addDiscountCode: (code: string) => Promise<void>;
}

export function useUser(): UserInterface {
  const { call } = useApi();

  async function getUser(): Promise<User | undefined> {
    return call<User>({ url: UserUrl.get, version: 'v2', method: 'GET' });
  }

  async function getRef(): Promise<Referral | undefined> {
    return call<Referral>({ url: UserUrl.ref, version: 'v2', method: 'GET' });
  }

  async function changeUser(user?: Partial<User>, userLinkAction?: () => void): Promise<User | undefined> {
    if (!user) return undefined;
    return call<User>({
      url: UserUrl.change,
      version: 'v2',
      method: 'PUT',
      data: { ...user },
      specialHandling: userLinkAction && {
        action: userLinkAction,
        statusCode: 202,
      },
    });
  }

  async function addDiscountCode(code: string): Promise<void> {
    return call({
      url: `${UserUrl.discountCodes}?code=${code}`,
      method: 'PUT',
    });
  }

  return useMemo(() => ({ getUser, getRef, changeUser, addDiscountCode }), [call]);
}
