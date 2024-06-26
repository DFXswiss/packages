import { useMemo } from 'react';
import { Referral, User, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';
import { SignIn } from '../definitions/auth';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  changeUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  changeUserAddress: (address: string) => Promise<SignIn>;
  deleteUserAddress: () => Promise<void>;
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

  async function changeUserAddress(address: string): Promise<SignIn> {
    return call<SignIn>({
      url: UserUrl.changeAddress,
      data: { address },
      method: 'POST',
    });
  }

  async function deleteUserAddress(): Promise<void> {
    return call({
      url: UserUrl.delete,
      method: 'DELETE',
    });
  }

  async function addDiscountCode(code: string): Promise<void> {
    return call({
      url: `${UserUrl.discountCodes}?code=${code}`,
      method: 'PUT',
    });
  }

  return useMemo(
    () => ({ getUser, getRef, changeUser, changeUserAddress, deleteUserAddress, addDiscountCode }),
    [call],
  );
}
