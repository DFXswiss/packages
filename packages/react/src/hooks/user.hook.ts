import { useMemo } from 'react';
import { ApiKey, Referral, UpdateUser, User, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';
import { SignIn } from '../definitions/auth';
import { TransactionFilter, TransactionFilterKey } from '../definitions/transaction';
import { useUserContext } from '../contexts/user.context';
import { useSessionContext } from '../contexts/session.context';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  changeUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  changeUserAddress: (address: string) => Promise<SignIn>;
  renameUserAddress: (address: string, label: string) => Promise<void>;
  deleteUserAddress: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  addDiscountCode: (code: string) => Promise<void>;
  generateCTApiKey: (types?: TransactionFilterKey[]) => Promise<ApiKey>;
  deleteCTApiKey: () => Promise<void>;
  updateCTApiFilter: (types?: TransactionFilterKey[]) => Promise<TransactionFilter[]>;
}

export function useUser(): UserInterface {
  const { call } = useApi();
  const { user } = useUserContext();
  const { tokenStore } = useSessionContext();

  async function getUser(): Promise<User | undefined> {
    return call<User>({ url: UserUrl.get, version: 'v2', method: 'GET' });
  }

  async function getRef(): Promise<Referral | undefined> {
    return call<Referral>({ url: UserUrl.ref, version: 'v2', method: 'GET' });
  }

  async function changeUser(updateUser?: UpdateUser, userLinkAction?: () => void): Promise<User | undefined> {
    if (!updateUser) return undefined;
    return call<User>({
      url: UserUrl.change,
      version: 'v2',
      method: 'PUT',
      data: { ...updateUser },
      specialHandling: userLinkAction && {
        action: userLinkAction,
        statusCode: 202,
      },
    });
  }

  async function renameUserAddress(address: string, label: string): Promise<void> {
    return call({
      url: `${UserUrl.addresses}/${address}`,
      version: 'v2',
      method: 'PUT',
      data: { label },
    });
  }

  async function changeUserAddress(address: string): Promise<SignIn> {
    return call<SignIn>({
      url: UserUrl.changeAddress,
      data: { address },
      method: 'POST',
    });
  }

  async function deleteUserAddress(address?: string): Promise<void> {
    return call({
      url: `${UserUrl.addresses}/${address}`,
      version: 'v2',
      method: 'DELETE',
    });
  }

  async function deleteUserAccount(): Promise<void> {
    return call({
      url: UserUrl.delete,
      version: 'v2',
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

  async function updateCTApiFilter(types?: TransactionFilterKey[]): Promise<TransactionFilter[]> {
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
      renameUserAddress,
      deleteUserAddress,
      deleteUserAccount,
      addDiscountCode,
      generateCTApiKey,
      deleteCTApiKey,
      updateCTApiFilter,
    }),
    [call],
  );

  function toHistoryQuery(types?: TransactionFilterKey[]): string {
    return types ? '?' + types.join('&') : '';
  }
}
