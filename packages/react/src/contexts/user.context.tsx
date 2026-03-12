import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiKey, PhoneCallTime, UpdateUser, User, UserAddress } from '../definitions/user';
import { useUser } from '../hooks/user.hook';
import { useApiSession } from '../hooks/api-session.hook';
import { Language } from '../definitions/language';
import { Fiat } from '../definitions/fiat';
import { TransactionFilterKey } from '../definitions/transaction';

interface UserInterface {
  user?: User;
  refLink?: string;
  isUserLoading: boolean;
  isUserUpdating: boolean;
  updateMail: (mail: string) => Promise<void>;
  verifyMail: (token: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  updateLanguage: (language: Language) => Promise<void>;
  updateCurrency: (currency: Fiat) => Promise<void>;
  hasAddress: boolean;
  hasCustody: boolean;
  userAddresses: UserAddress[];
  custodyAddresses: UserAddress[];
  renameAddress: (address: string, label: string) => Promise<void>;
  changeAddress: (address: string) => Promise<void>;
  deleteAddress: (address: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  addSpecialCode: (code: string) => Promise<void>;
  reloadUser: () => Promise<void>;
  filterCT?: TransactionFilterKey[];
  keyCT?: string;
  generateKeyCT: (types?: TransactionFilterKey[]) => Promise<ApiKey | undefined>;
  deleteKeyCT: () => Promise<void>;
  updateFilterCT: (types?: TransactionFilterKey[]) => Promise<void>;
  updateCallSettings: (preferredPhoneTimes?: PhoneCallTime[], acceptCall?: boolean) => Promise<void>;
}

const UserContext = createContext<UserInterface>(undefined as any);

export function useUserContext(): UserInterface {
  return useContext(UserContext);
}

export function UserContextProvider(props: PropsWithChildren): JSX.Element {
  const { isLoggedIn, session, updateSession, deleteSession } = useApiSession();
  const {
    getUser,
    updateUser: updateUserApi,
    updateMail: updateMailApi,
    verifyMail: verifyMailApi,
    addSpecialCode,
    renameUserAddress,
    changeUserAddress,
    deleteUserAddress,
    deleteUserAccount,
    generateCTApiKey,
    deleteCTApiKey,
    updateCTApiFilter,
    updateCallSettings: updateCallSettingsApi,
  } = useUser();
  const [user, setUser] = useState<User>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const refCode = user?.activeAddress?.refCode;
  const refLink = refCode && `${process.env.REACT_APP_REF_URL ?? 'https://dfx.swiss/app?code='}${refCode}`;

  const userAddresses = user?.addresses.filter((a) => !a.isCustody) ?? [];
  const custodyAddresses = user?.addresses.filter((a) => a.isCustody) ?? [];

  const reloadUser = useCallback(async (): Promise<void> => {
    setIsUserLoading(true);
    getUser()
      .then(setUser)
      .finally(() => setIsUserLoading(false));
  }, [getUser]);

  useEffect(() => {
    if (isLoggedIn) {
      reloadUser();
    } else {
      setUser(undefined);
    }
  }, [isLoggedIn, reloadUser]);

  const updateUser = useCallback(async (update: UpdateUser, linkAction?: () => void): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    return updateUserApi(update, linkAction)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }, [user, updateUserApi]);

  const updateMail = useCallback(async (mail: string): Promise<void> => {
    return updateMailApi(mail);
  }, [updateMailApi]);

  const verifyMail = useCallback(async (token: string): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    return verifyMailApi(token)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }, [user, verifyMailApi]);

  const updatePhone = useCallback(async (phone: string): Promise<void> => {
    return updateUser({ phone });
  }, [updateUser]);

  const updateLanguage = useCallback(async (language: Language): Promise<void> => {
    return updateUser({ language });
  }, [updateUser]);

  const updateCurrency = useCallback(async (currency: Fiat): Promise<void> => {
    return updateUser({ currency });
  }, [updateUser]);

  const renameAddress = useCallback(async (address: string, label: string): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    return renameUserAddress(address, label)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }, [user, renameUserAddress]);

  const changeAddress = useCallback(async (address: string): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    return changeUserAddress(address)
      .then(({ accessToken }) => updateSession(accessToken))
      .then(() => setUser({ ...user, activeAddress: user.addresses.find((a) => a.address === address) }))
      .finally(() => setIsUserUpdating(false));
  }, [user, changeUserAddress, updateSession]);

  const deleteAddress = useCallback(async (address: string): Promise<void> => {
    if (!user) return;

    const requiresFallback = address === user.activeAddress?.address;
    const fallbackAddress =
      requiresFallback && user.addresses.length > 1
        ? user.addresses.find((a) => a.address !== address)?.address
        : undefined;

    return deleteUserAddress(address).then(() => {
      if (requiresFallback) {
        fallbackAddress ? changeAddress(fallbackAddress) : deleteSession();
      } else {
        reloadUser();
      }
    });
  }, [user, deleteUserAddress, changeAddress, deleteSession, reloadUser]);

  const deleteAccount = useCallback(async (): Promise<void> => {
    if (!user) return;

    return deleteUserAccount().then(deleteSession);
  }, [user, deleteUserAccount, deleteSession]);

  const generateKeyCT = useCallback(async (types?: TransactionFilterKey[]): Promise<ApiKey | undefined> => {
    if (!user) return;

    setIsUserUpdating(true);
    try {
      const key = await generateCTApiKey(types);
      await getUser().then(setUser);
      return key;
    } finally {
      setIsUserUpdating(false);
    }
  }, [user, generateCTApiKey, getUser]);

  const deleteKeyCT = useCallback(async (): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    deleteCTApiKey()
      .then(() => getUser().then(setUser))
      .finally(() => setIsUserUpdating(false));
  }, [user, deleteCTApiKey, getUser]);

  const updateFilterCT = useCallback(async (types?: TransactionFilterKey[]): Promise<void> => {
    if (!user) return;

    setIsUserUpdating(true);
    updateCTApiFilter(types)
      .then(() => getUser().then(setUser))
      .finally(() => setIsUserUpdating(false));
  }, [user, updateCTApiFilter, getUser]);

  const updateCallSettings = useCallback(
    async (preferredPhoneTimes?: PhoneCallTime[], acceptCall?: boolean): Promise<void> => {
      if (!user) return;

      setIsUserUpdating(true);
      return updateCallSettingsApi(preferredPhoneTimes, acceptCall)
        .then(setUser)
        .finally(() => setIsUserUpdating(false));
    },
    [user, updateCallSettingsApi],
  );

  const context: UserInterface = useMemo(
    () => ({
      user,
      refLink,
      isUserLoading,
      isUserUpdating,
      updateMail,
      verifyMail,
      updatePhone,
      updateLanguage,
      updateCurrency,
      hasAddress: !!user?.addresses.length,
      hasCustody: !!custodyAddresses.length,
      userAddresses,
      custodyAddresses,
      renameAddress,
      changeAddress,
      deleteAddress,
      deleteAccount,
      addSpecialCode,
      reloadUser,
      filterCT: user?.apiFilterCT ?? user?.activeAddress?.apiFilterCT,
      keyCT: user?.apiKeyCT ?? user?.activeAddress?.apiKeyCT,
      generateKeyCT,
      deleteKeyCT,
      updateFilterCT,
      updateCallSettings,
    }),
    [
      user,
      refLink,
      isUserLoading,
      isUserUpdating,
      updateMail,
      verifyMail,
      updatePhone,
      updateLanguage,
      updateCurrency,
      userAddresses,
      custodyAddresses,
      renameAddress,
      changeAddress,
      deleteAddress,
      deleteAccount,
      addSpecialCode,
      reloadUser,
      generateKeyCT,
      deleteKeyCT,
      updateFilterCT,
      updateCallSettings,
    ],
  );

  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
}
