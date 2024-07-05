import { useMemo } from 'react';
import { ApiKey, Referral, User, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';
import { SignIn } from '../definitions/auth';
import { TransactionFilter, TransactionFilterKey } from '../definitions/transaction';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  changeUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  changeUserAddress: (address: string) => Promise<SignIn>;
  deleteUserAddress: () => Promise<void>;
  addDiscountCode: (code: string) => Promise<void>;
  generateCTApiKey: (types?: TransactionFilterKey[]) => Promise<ApiKey>;
  deleteCTApiKey: () => Promise<void>;
  putCTApiFilter: (types?: TransactionFilterKey[]) => Promise<TransactionFilter[]>;
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

  async function generateCTApiKey(types?: TransactionFilterKey[]): Promise<ApiKey> {
    return call<ApiKey>({ url: `${UserUrl.apiKey}/CT${toHistoryQuery(types)}`, method: 'POST' });
  }

  async function deleteCTApiKey(): Promise<void> {
    return call<void>({ url: `${UserUrl.apiKey}/CT`, method: 'DELETE' });
  }

  async function putCTApiFilter(types?: TransactionFilterKey[]): Promise<TransactionFilter[]> {
    return call<TransactionFilter[]>({
      url: `${UserUrl.apiFilter}/CT${toHistoryQuery(types)}`,
      method: 'PUT',
    });
  }

  return useMemo(
    () => ({
      getUser,
      getRef,
      changeUser,
      changeUserAddress,
      deleteUserAddress,
      addDiscountCode,
      generateCTApiKey,
      deleteCTApiKey,
      putCTApiFilter,
    }),
    [call],
  );

  function toHistoryQuery(types?: TransactionFilterKey[]): string {
    return types ? '?' + types.join('&') : '';
  }
}
