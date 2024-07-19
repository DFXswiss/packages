import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Country } from '../definitions/country';
import { UpdateUser, User } from '../definitions/user';
import { useCountry } from '../hooks/country.hook';
import { useUser } from '../hooks/user.hook';
import { useApiSession } from '../hooks/api-session.hook';
import { Language } from '../definitions/language';
import { Fiat } from '../definitions/fiat';

interface UserInterface {
  user?: User;
  refLink?: string;
  countries: Country[];
  isUserLoading: boolean;
  isUserUpdating: boolean;
  changeMail: (mail: string) => Promise<void>;
  changeLanguage: (language: Language) => Promise<void>;
  changeCurrency: (currency: Fiat) => Promise<void>;
  addDiscountCode: (code: string) => Promise<void>;
  register: (userLink: () => void) => void;
  reloadUser: () => Promise<void>;
}

const UserContext = createContext<UserInterface>(undefined as any);

export function useUserContext(): UserInterface {
  return useContext(UserContext);
}

export function UserContextProvider(props: PropsWithChildren): JSX.Element {
  const { isLoggedIn, session } = useApiSession();
  const { getUser, changeUser, addDiscountCode } = useUser();
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

  function register(userLink: () => void) {
    userLinkAction = userLink;
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
      addDiscountCode,
      register,
      reloadUser,
    }),
    [user, refLink, countries, isUserLoading, isUserUpdating, changeMail, register, reloadUser],
  );

  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
}
