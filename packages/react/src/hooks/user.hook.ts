import { useMemo } from 'react';
import { User, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  changeUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  addDiscountCode: (code: string) => Promise<void>;
}

export function useUser(): UserInterface {
  const { call } = useApi();

  async function getUser(): Promise<User | undefined> {
    return call<User>({ url: UserUrl.get, method: 'GET' });
  }

  async function changeUser(user?: Partial<User>, userLinkAction?: () => void): Promise<User | undefined> {
    if (!user) return undefined;
    return call<User>({
      url: UserUrl.change,
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

  return useMemo(() => ({ getUser, changeUser, addDiscountCode }), [call]);
}
