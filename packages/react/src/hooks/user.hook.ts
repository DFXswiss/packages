import { useMemo } from 'react';
import { ApiKey, Referral, UpdateUser, User, UserProfile, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';
import { SignIn } from '../definitions/auth';
import { TransactionFilter, TransactionFilterKey } from '../definitions/transaction';

export interface UserInterface {
  getUser: () => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  getProfile: () => Promise<UserProfile | undefined>;
  updateUser: (user?: Partial<User>, userLinkAction?: () => void) => Promise<User | undefined>;
  updatePhone: (phone: string) => Promise<User | undefined>;
  updateMail: (mail: string) => Promise<void>;
  verifyMail: (token: string) => Promise<User>;
  changeUserAddress: (address: string) => Promise<SignIn>;
  renameUserAddress: (address: string, label: string) => Promise<User | undefined>;
  deleteUserAddress: (address: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  addSpecialCode: (code: string) => Promise<void>;
  generateCTApiKey: (types?: TransactionFilterKey[]) => Promise<ApiKey>;
  deleteCTApiKey: () => Promise<void>;
  updateCTApiFilter: (types?: TransactionFilterKey[]) => Promise<TransactionFilter[]>;
}

export function useUser(): UserInterface {
  const { call } = useApi();

  async function getUser(): Promise<User | undefined> {
    return call<User>({ url: UserUrl.get, version: 'v2', method: 'GET' });
  }

  async function getRef(): Promise<Referral | undefined> {
    return call<Referral>({ url: UserUrl.ref, version: 'v2', method: 'GET' });
  }

  async function getProfile(): Promise<UserProfile | undefined> {
    return call<UserProfile>({ url: UserUrl.profile, version: 'v2', method: 'GET' });
  }

  async function updateUser(updateUser?: UpdateUser, userLinkAction?: () => void): Promise<User | undefined> {
    if (!updateUser) return undefined;
    return call<User>({
      url: UserUrl.update,
      version: 'v2',
      method: 'PUT',
      data: { ...updateUser },
      specialHandling: userLinkAction && {
        action: userLinkAction,
        statusCode: 202,
      },
    });
  }

  async function updatePhone(phone: string): Promise<User | undefined> {
    return call<User>({
      url: UserUrl.updatePhone,
      version: 'v2',
      method: 'PUT',
      data: { phone },
    });
  }

  async function updateMail(mail: string): Promise<void> {
    return call<void>({
      url: UserUrl.updateMail,
      version: 'v2',
      method: 'PUT',
      data: { mail },
    });
  }

  async function verifyMail(token: string): Promise<User> {
    return call<User>({ url: UserUrl.verifyMail, version: 'v2', method: 'POST', data: { token } });
  }

  async function renameUserAddress(address: string, label: string): Promise<User | undefined> {
    if (!address || !label) return undefined;
    return call<User>({
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

  async function deleteUserAddress(address: string): Promise<void> {
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

  async function addSpecialCode(code: string): Promise<void> {
    return call({
      url: `${UserUrl.specialCodes}?code=${code}`,
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
      getProfile,
      updateUser,
      updatePhone,
      updateMail,
      verifyMail,
      changeUserAddress,
      renameUserAddress,
      deleteUserAddress,
      deleteUserAccount,
      addSpecialCode,
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
