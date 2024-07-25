import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Country } from '../definitions/country';
import { ApiKey, UpdateUser, User } from '../definitions/user';
import { useCountry } from '../hooks/country.hook';
import { useUser } from '../hooks/user.hook';
import { useApiSession } from '../hooks/api-session.hook';
import { Language } from '../definitions/language';
import { Fiat } from '../definitions/fiat';
import { TransactionFilter, TransactionFilterKey } from '../definitions/transaction';

interface UserInterface {
  user?: User;
  refLink?: string;
  countries: Country[];
  isUserLoading: boolean;
  isUserUpdating: boolean;
  changeMail: (mail: string) => Promise<void>;
  changeLanguage: (language: Language) => Promise<void>;
  changeCurrency: (currency: Fiat) => Promise<void>;
  renameAddress: (address: string, label: string) => Promise<void>;
  changeAddress: (address: string) => Promise<void>;
  deleteAddress: (address: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  addDiscountCode: (code: string) => Promise<void>;
  register: (userLink: () => void) => void;
  reloadUser: () => Promise<void>;
  filterCT?: TransactionFilterKey[];
  keyCT?: string;
  generateKeyCT: (types?: TransactionFilterKey[]) => Promise<void>;
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
    changeUser,
    addDiscountCode,
    renameUserAddress,
    changeUserAddress,
    deleteUserAddress,
    deleteUserAccount,
    generateCTApiKey,
    deleteCTApiKey,
    updateCTApiFilter,
  } = useUser();
  const { getCountries } = useCountry();
  const [user, setUser] = useState<User>();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const refCode = user?.activeAddress?.refCode;
  const refLink = refCode && `${process.env.REACT_APP_REF_URL ?? 'https://dfx.swiss/app?code='}${refCode}`;
  let userLinkAction: () => void | undefined;

  useEffect(() => {
    if (isLoggedIn) {
      reloadUser();

      getCountries().then((c) => setCountries(c.sort((a, b) => (a.name > b.name ? 1 : -1))));
    } else {
      setUser(undefined);
      setCountries([]);
    }
  }, [isLoggedIn, session]);

  async function reloadUser(): Promise<void> {
    setIsUserLoading(true);
    getUser()
      .then(setUser)
      .catch(console.error) // TODO: (Krysh) add real error handling
      .finally(() => setIsUserLoading(false));
  }

  async function updateUser(update: UpdateUser, linkAction?: () => void): Promise<void> {
    if (!user) return; // TODO: (Krysh) add real error handling

    setIsUserUpdating(true);
    return changeUser(update, linkAction)
      .then(setUser)
      .catch(console.error) // TODO: (Krysh) add real error handling
      .finally(() => setIsUserUpdating(false));
  }

  async function changeMail(mail: string): Promise<void> {
    return updateUser({ mail }, userLinkAction);
  }

  async function changeLanguage(language: Language): Promise<void> {
    return updateUser({ language });
  }

  async function changeCurrency(currency: Fiat): Promise<void> {
    return updateUser({ currency });
  }

  async function renameAddress(address: string, label: string): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    return renameUserAddress(address, label)
      .then(setUser)
      .catch(console.error)
      .finally(() => setIsUserUpdating(false));
  }

  async function changeAddress(address: string): Promise<void> {
    if (!user) return;

    return changeUserAddress(address)
      .then(({ accessToken }) => updateSession(accessToken))
      .catch(console.error);
  }

  async function deleteAddress(address: string): Promise<void> {
    if (!user) return;

    const requiresFallback = address === user.activeAddress?.address;
    const fallbackAddress =
      requiresFallback && user.addresses.length > 1
        ? user.addresses.find((a) => a.address !== address)?.address
        : undefined;

    return deleteUserAddress(address)
      .then(() => {
        if (requiresFallback) {
          fallbackAddress ? changeAddress(fallbackAddress) : deleteSession();
        } else {
          reloadUser();
        }
      })
      .catch(console.error);
  }

  async function deleteAccount(): Promise<void> {
    if (!user) return;

    return deleteUserAccount().then(deleteSession).catch(console.error);
  }

  function register(userLink: () => void) {
    userLinkAction = userLink;
  }

  async function generateKeyCT(types?: TransactionFilterKey[]): Promise<void> {
    if (!user) return;

    setIsUserUpdating(true);
    generateCTApiKey(types)
      .then(() => getUser().then(setUser))
      .finally(() => setIsUserUpdating(false));
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
      countries,
      isUserLoading,
      isUserUpdating,
      changeMail,
      changeLanguage,
      changeCurrency,
      renameAddress,
      changeAddress,
      deleteAddress,
      deleteAccount,
      addDiscountCode,
      register,
      reloadUser,
      filterCT: user?.activeAddress?.apiFilterCT,
      keyCT: user?.activeAddress?.apiKeyCT,
      generateKeyCT,
      deleteKeyCT,
      updateFilterCT,
    }),
    [user, refLink, countries, isUserLoading, isUserUpdating, changeMail, register, reloadUser],
  );

  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
}
