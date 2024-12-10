import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ApiKey, UpdateUser, User } from '../definitions/user';
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
  renameAddress: (address: string, label: string) => Promise<void>;
  changeAddress: (address: string) => Promise<void>;
  deleteAddress: (address: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  addDiscountCode: (code: string) => Promise<void>;
  reloadUser: () => Promise<void>;
  filterCT?: TransactionFilterKey[];
  keyCT?: string;
  generateKeyCT: (types?: TransactionFilterKey[]) => Promise<ApiKey | undefined>;
  deleteKeyCT: () => Promise<void>;
  updateFilterCT: (types?: TransactionFilterKey[]) => Promise<void>;
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
    addDiscountCode,
    renameUserAddress,
    changeUserAddress,
    deleteUserAddress,
    deleteUserAccount,
    generateCTApiKey,
    deleteCTApiKey,
    updateCTApiFilter,
  } = useUser();
  const [user, setUser] = useState<User>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const refCode = user?.activeAddress?.refCode;
  const refLink = refCode && `${process.env.REACT_APP_REF_URL ?? 'https://dfx.swiss/app?code='}${refCode}`;

  useEffect(() => {
    if (isLoggedIn) {
      reloadUser();
    } else {
      setUser(undefined);
    }
  }, [isLoggedIn, session]);

  async function reloadUser(): Promise<void> {
    setIsUserLoading(true);
    getUser()
      .then(setUser)
      .finally(() => setIsUserLoading(false));
  }

  async function updateUser(update: UpdateUser, linkAction?: () => void): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    return updateUserApi(update, linkAction)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }

  async function updateMail(mail: string): Promise<void> {
    return updateMailApi(mail);
  }

  async function verifyMail(token: string): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    return verifyMailApi(token)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }

  async function updatePhone(phone: string): Promise<void> {
    return updateUser({ phone });
  }

  async function updateLanguage(language: Language): Promise<void> {
    return updateUser({ language });
  }

  async function updateCurrency(currency: Fiat): Promise<void> {
    return updateUser({ currency });
  }

  async function renameAddress(address: string, label: string): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    return renameUserAddress(address, label)
      .then(setUser)
      .finally(() => setIsUserUpdating(false));
  }

  async function changeAddress(address: string): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    return changeUserAddress(address)
      .then(({ accessToken }) => updateSession(accessToken))
      .then(() => setUser({ ...user, activeAddress: user.addresses.find((a) => a.address === address) }))
      .finally(() => setIsUserUpdating(false));
  }

  async function deleteAddress(address: string): Promise<void> {
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
  }

  async function deleteAccount(): Promise<void> {
    if (!user) return;

    return deleteUserAccount().then(deleteSession);
  }

  async function generateKeyCT(types?: TransactionFilterKey[]): Promise<ApiKey | undefined> {
    if (!user) return;

    setIsUserUpdating(true);
    try {
      const key = await generateCTApiKey(types);
      await getUser().then(setUser);
      return key;
    } finally {
      setIsUserUpdating(false);
    }
  }

  async function deleteKeyCT(): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    deleteCTApiKey()
      .then(() => getUser().then(setUser))
      .finally(() => setIsUserUpdating(false));
  }

  async function updateFilterCT(types?: TransactionFilterKey[]): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    updateCTApiFilter(types)
      .then(() => getUser().then(setUser))
      .finally(() => setIsUserUpdating(false));
  }

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
      renameAddress,
      changeAddress,
      deleteAddress,
      deleteAccount,
      addDiscountCode,
      reloadUser,
      filterCT: user?.apiFilterCT ?? user?.activeAddress?.apiFilterCT,
      keyCT: user?.apiKeyCT ?? user?.activeAddress?.apiKeyCT,
      generateKeyCT,
      deleteKeyCT,
      updateFilterCT,
    }),
    [user, refLink, isUserLoading, isUserUpdating, updateMail, updatePhone, reloadUser],
  );

  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
}
