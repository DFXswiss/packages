import { useMemo } from 'react';
import { ApiKey, PhoneCallTime, Referral, UpdateUser, User, UserProfile, UserUrl } from '../definitions/user';
import { useApi } from './api.hook';
import { SignIn } from '../definitions/auth';
import { TransactionFilter, TransactionFilterKey } from '../definitions/transaction';

export interface UserInterface {
  getUser: (authToken?: string) => Promise<User | undefined>;
  getRef: () => Promise<Referral | undefined>;
  getProfile: () => Promise<UserProfile | undefined>;
  updateUser: (user?: Partial<User>, userLinkAction?: () => void, authToken?: string) => Promise<User | undefined>;
  updateMail: (mail: string, authToken?: string) => Promise<void>;
  verifyMail: (token: string, authToken?: string) => Promise<User>;
  changeUserAddress: (address: string, authToken?: string) => Promise<SignIn>;
  renameUserAddress: (address: string, label: string, authToken?: string) => Promise<User | undefined>;
  deleteUserAddress: (address: string, authToken?: string) => Promise<void>;
  deleteUserAccount: (authToken?: string) => Promise<void>;
  addSpecialCode: (code: string, authToken?: string) => Promise<void>;
  generateCTApiKey: (types?: TransactionFilterKey[], authToken?: string) => Promise<ApiKey>;
  deleteCTApiKey: (authToken?: string) => Promise<void>;
  updateCTApiFilter: (types?: TransactionFilterKey[], authToken?: string) => Promise<TransactionFilter[]>;
  updateCallSettings: (
    preferredPhoneTimes?: PhoneCallTime[],
    acceptCall?: boolean,
    authToken?: string,
  ) => Promise<User | undefined>;
}

export function useUser(): UserInterface {
  const { call } = useApi();

  async function getUser(authToken?: string): Promise<User | undefined> {
    return call<User>({ url: UserUrl.get, version: 'v2', method: 'GET', token: authToken });
  }

  async function getRef(): Promise<Referral | undefined> {
    return call<Referral>({ url: UserUrl.ref, version: 'v2', method: 'GET' });
  }

  async function getProfile(): Promise<UserProfile | undefined> {
    return call<UserProfile>({ url: UserUrl.profile, version: 'v2', method: 'GET' });
  }

  async function updateUser(
    updateUser?: UpdateUser,
    userLinkAction?: () => void,
    authToken?: string,
  ): Promise<User | undefined> {
    if (!updateUser) return undefined;
    return call<User>({
      url: UserUrl.update,
      version: 'v2',
      method: 'PUT',
      data: { ...updateUser },
      token: authToken,
      specialHandling: userLinkAction && {
        action: userLinkAction,
        statusCode: 202,
      },
    });
  }

  async function updateMail(mail: string, authToken?: string): Promise<void> {
    return call<void>({
      url: UserUrl.updateMail,
      version: 'v2',
      method: 'PUT',
      data: { mail },
      token: authToken,
    });
  }

  async function verifyMail(token: string, authToken?: string): Promise<User> {
    return call<User>({ url: UserUrl.verifyMail, version: 'v2', method: 'POST', data: { token }, token: authToken });
  }

  async function renameUserAddress(address: string, label: string, authToken?: string): Promise<User | undefined> {
    if (!address || !label) return undefined;
    return call<User>({
      url: `${UserUrl.addresses}/${address}`,
      version: 'v2',
      method: 'PUT',
      data: { label },
      token: authToken,
    });
  }

  async function changeUserAddress(address: string, authToken?: string): Promise<SignIn> {
    return call<SignIn>({
      url: UserUrl.changeAddress,
      data: { address },
      method: 'POST',
      token: authToken,
    });
  }

  async function deleteUserAddress(address: string, authToken?: string): Promise<void> {
    return call({
      url: `${UserUrl.addresses}/${address}`,
      version: 'v2',
      method: 'DELETE',
      token: authToken,
    });
  }

  async function deleteUserAccount(authToken?: string): Promise<void> {
    return call({
      url: UserUrl.delete,
      version: 'v2',
      method: 'DELETE',
      token: authToken,
    });
  }

  async function addSpecialCode(code: string, authToken?: string): Promise<void> {
    return call({
      url: `${UserUrl.specialCodes}?code=${code}`,
      method: 'PUT',
      token: authToken,
    });
  }

  async function generateCTApiKey(types?: TransactionFilterKey[], authToken?: string): Promise<ApiKey> {
    return call<ApiKey>({ url: `${UserUrl.apiKey}/CT${toHistoryQuery(types)}`, method: 'POST', token: authToken });
  }

  async function deleteCTApiKey(authToken?: string): Promise<void> {
    return call<void>({ url: `${UserUrl.apiKey}/CT`, method: 'DELETE', token: authToken });
  }

  async function updateCTApiFilter(types?: TransactionFilterKey[], authToken?: string): Promise<TransactionFilter[]> {
    return call<TransactionFilter[]>({
      url: `${UserUrl.apiFilter}/CT${toHistoryQuery(types)}`,
      method: 'PUT',
      token: authToken,
    });
  }

  async function updateCallSettings(
    preferredPhoneTimes?: PhoneCallTime[],
    acceptCall?: boolean,
    authToken?: string,
  ): Promise<User | undefined> {
    return call<User>({
      url: UserUrl.update,
      version: 'v2',
      method: 'PUT',
      data: { preferredPhoneTimes, acceptCall },
      token: authToken,
    });
  }

  return useMemo(
    () => ({
      getUser,
      getRef,
      getProfile,
      updateUser,
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
      updateCallSettings,
    }),
    [call],
  );

  function toHistoryQuery(types?: TransactionFilterKey[]): string {
    return types ? '?' + types.join('&') : '';
  }
}
