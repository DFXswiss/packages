import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiKey, PhoneCallTime, UpdateUser, User, UserAddress } from '../definitions/user';
import { useUser } from '../hooks/user.hook';
import { useApiSession } from '../hooks/api-session.hook';
import { Language } from '../definitions/language';
import { Fiat } from '../definitions/fiat';
import { TransactionFilterKey } from '../definitions/transaction';
import {
  decrementUserUpdate,
  incrementUserUpdate,
  isCurrentUserRequest,
  isUserUpdatingForIdentity,
  userForSession,
  type UserSnapshot,
  type UserUpdateCounts,
} from './user-identity';

interface UserInterface {
  user?: User;
  refLink?: string;
  isUserLoading: boolean;
  userLoadError: boolean;
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
  const accountId = isLoggedIn ? session?.account : undefined;
  const identity = accountId === undefined ? undefined : String(accountId);
  const requestIdentity =
    identity === undefined ? undefined : `${identity}:${session?.user ?? ''}:${session?.address ?? ''}`;
  const identityRef = useRef(identity);
  const requestIdentityRef = useRef(requestIdentity);
  const accountIdRef = useRef(accountId);
  const userLoadRequestRef = useRef(0);
  // Update during render so async completions and event handlers observe the
  // account/token-address scope represented by the tree about to be committed.
  identityRef.current = identity;
  requestIdentityRef.current = requestIdentity;
  accountIdRef.current = accountId;
  const [userSnapshot, setUserSnapshot] = useState<UserSnapshot>();
  const user = useMemo(
    () => userForSession(userSnapshot, identity, session?.address),
    [identity, session?.address, userSnapshot],
  );
  const [loadedIdentity, setLoadedIdentity] = useState<string>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [userLoadErrorIdentity, setUserLoadErrorIdentity] = useState<
    { identity: string; requestIdentity: string } | undefined
  >();
  const [userUpdateCounts, setUserUpdateCounts] = useState<UserUpdateCounts>({});
  const beginUserUpdate = useCallback(
    (requestIdentity: string) => setUserUpdateCounts((counts) => incrementUserUpdate(counts, requestIdentity)),
    [],
  );
  const endUserUpdate = useCallback(
    (requestIdentity: string) => setUserUpdateCounts((counts) => decrementUserUpdate(counts, requestIdentity)),
    [],
  );
  const isUserUpdating = isUserUpdatingForIdentity(userUpdateCounts, requestIdentity);
  const userLoadError =
    userLoadErrorIdentity !== undefined &&
    isCurrentUserRequest(
      userLoadErrorIdentity.identity,
      userLoadErrorIdentity.requestIdentity,
      identity,
      requestIdentity,
    );

  const setUserForIdentity = useCallback(
    (
      expectedIdentity: string,
      expectedRequestIdentity: string,
      expectedAccountId: number,
      next: User | undefined | ((previous: User | undefined) => User | undefined),
    ) => {
      if (
        !isCurrentUserRequest(
          expectedIdentity,
          expectedRequestIdentity,
          identityRef.current,
          requestIdentityRef.current,
        )
      )
        return;
      setUserSnapshot((previous) => {
        if (
          !isCurrentUserRequest(
            expectedIdentity,
            expectedRequestIdentity,
            identityRef.current,
            requestIdentityRef.current,
          )
        )
          return previous;
        const current = previous?.identity === expectedIdentity ? previous.user : undefined;
        const nextUser = typeof next === 'function' ? next(current) : next;
        if (nextUser && nextUser.accountId !== expectedAccountId) return previous;
        return nextUser ? { identity: expectedIdentity, user: nextUser } : undefined;
      });
    },
    [],
  );
  const hasCurrentIdentity = useCallback(
    () =>
      identity !== undefined &&
      accountId !== undefined &&
      requestIdentity !== undefined &&
      isCurrentUserRequest(identity, requestIdentity, identityRef.current, requestIdentityRef.current),
    [accountId, identity, requestIdentity],
  );

  const refCode = user?.activeAddress?.refCode;
  const refLink = refCode && `${process.env.REACT_APP_REF_URL ?? 'https://dfx.swiss/app?code='}${refCode}`;

  const reloadUser = useCallback(async (): Promise<void> => {
    const requestAccountIdentity = identityRef.current;
    const requestIdentity = requestIdentityRef.current;
    const requestAccountId = accountIdRef.current;
    if (!requestAccountIdentity || !requestIdentity || requestAccountId === undefined) {
      userLoadRequestRef.current += 1;
      setUserSnapshot(undefined);
      setLoadedIdentity(undefined);
      setUserLoadErrorIdentity(undefined);
      setIsUserLoading(false);
      return;
    }
    const requestId = ++userLoadRequestRef.current;
    setUserLoadErrorIdentity(undefined);
    setIsUserLoading(true);
    try {
      const nextUser = await getUser();
      if (
        isCurrentUserRequest(requestAccountIdentity, requestIdentity, identityRef.current, requestIdentityRef.current)
      ) {
        setUserForIdentity(requestAccountIdentity, requestIdentity, requestAccountId, nextUser);
      }
    } catch {
      if (
        requestId === userLoadRequestRef.current &&
        isCurrentUserRequest(requestAccountIdentity, requestIdentity, identityRef.current, requestIdentityRef.current)
      ) {
        setUserLoadErrorIdentity({ identity: requestAccountIdentity, requestIdentity });
      }
    } finally {
      if (
        requestId === userLoadRequestRef.current &&
        isCurrentUserRequest(requestAccountIdentity, requestIdentity, identityRef.current, requestIdentityRef.current)
      ) {
        setLoadedIdentity(requestAccountIdentity);
        setIsUserLoading(false);
      }
    }
  }, [getUser, setUserForIdentity]);

  useEffect(() => {
    if (isLoggedIn) {
      void reloadUser();
    } else {
      setUserSnapshot(undefined);
      setLoadedIdentity(undefined);
      setUserLoadErrorIdentity(undefined);
      userLoadRequestRef.current += 1;
      setIsUserLoading(false);
    }
  }, [isLoggedIn, identity, requestIdentity, reloadUser]);

  const updateUser = useCallback(
    async (update: UpdateUser, linkAction?: () => void): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      return updateUserApi(update, linkAction)
        .then((updated) => setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, updated))
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      updateUserApi,
      user,
    ],
  );

  const updateMail = useCallback(
    async (mail: string): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;
      // The endpoint returns an empty body, so the refreshed user has to be fetched. The refresh is
      // best-effort, and keeps the previous object when the address did not move — a change pending
      // mail verification (202) leaves it untouched, and a fresh identity there would re-trigger
      // effects that watch `user` and re-submit endlessly. A cleared state stays cleared: a refresh
      // landing after a logout must not put the signed-out user back.
      beginUserUpdate(expectedRequestIdentity);
      return updateMailApi(mail)
        .then(() => {
          if (requestIdentityRef.current !== expectedRequestIdentity) return;
          return getUser()
            .then((refreshed) =>
              setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, (previous) =>
                previous && refreshed && refreshed.mail !== previous.mail ? refreshed : previous,
              ),
            )
            .catch(() => undefined);
        })
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      getUser,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      updateMailApi,
      user,
    ],
  );

  const verifyMail = useCallback(
    async (token: string): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      return verifyMailApi(token)
        .then((updated) => setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, updated))
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      user,
      verifyMailApi,
    ],
  );

  const updatePhone = useCallback(
    async (phone: string): Promise<void> => {
      return updateUser({ phone });
    },
    [updateUser],
  );

  const updateLanguage = useCallback(
    async (language: Language): Promise<void> => {
      return updateUser({ language });
    },
    [updateUser],
  );

  const updateCurrency = useCallback(
    async (currency: Fiat): Promise<void> => {
      return updateUser({ currency });
    },
    [updateUser],
  );

  const renameAddress = useCallback(
    async (address: string, label: string): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      return renameUserAddress(address, label)
        .then((updated) => setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, updated))
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      hasCurrentIdentity,
      identity,
      renameUserAddress,
      requestIdentity,
      setUserForIdentity,
      user,
    ],
  );

  const changeAddress = useCallback(
    async (address: string): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      return changeUserAddress(address)
        .then(({ accessToken }) => {
          if (requestIdentityRef.current !== expectedRequestIdentity) return;
          setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, {
            ...user,
            activeAddress: user.addresses.find((a) => a.address === address),
          });
          updateSession(accessToken);
        })
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      changeUserAddress,
      endUserUpdate,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      updateSession,
      user,
    ],
  );

  const deleteAddress = useCallback(
    async (address: string): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;

      const requiresFallback = address === user.activeAddress?.address;
      const fallbackAddress =
        requiresFallback && user.addresses.length > 1
          ? user.addresses.find((a) => a.address !== address)?.address
          : undefined;

      return deleteUserAddress(address).then(() => {
        if (identityRef.current !== expectedIdentity || requestIdentityRef.current !== expectedRequestIdentity) return;
        if (requiresFallback) {
          fallbackAddress ? changeAddress(fallbackAddress) : deleteSession();
        } else {
          reloadUser();
        }
      });
    },
    [
      accountId,
      changeAddress,
      deleteSession,
      deleteUserAddress,
      hasCurrentIdentity,
      identity,
      reloadUser,
      requestIdentity,
      user,
    ],
  );

  const deleteAccount = useCallback(async (): Promise<void> => {
    if (!user || !hasCurrentIdentity() || identity === undefined || !requestIdentity) return;
    const expectedRequestIdentity = requestIdentity;

    return deleteUserAccount().then(() => {
      if (requestIdentityRef.current === expectedRequestIdentity) deleteSession();
    });
  }, [deleteSession, deleteUserAccount, hasCurrentIdentity, identity, requestIdentity, user]);

  const generateKeyCT = useCallback(
    async (types?: TransactionFilterKey[]): Promise<ApiKey | undefined> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      try {
        const key = await generateCTApiKey(types);
        if (identityRef.current === expectedIdentity && requestIdentityRef.current === expectedRequestIdentity) {
          const refreshed = await getUser();
          setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, refreshed);
        } else {
          return undefined;
        }
        return key;
      } finally {
        endUserUpdate(expectedRequestIdentity);
      }
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      generateCTApiKey,
      getUser,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      user,
    ],
  );

  const deleteKeyCT = useCallback(async (): Promise<void> => {
    if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity) return;
    const expectedIdentity = identity;
    const expectedRequestIdentity = requestIdentity;
    const expectedAccountId = accountId;

    beginUserUpdate(expectedRequestIdentity);
    deleteCTApiKey()
      .then(async () => {
        if (identityRef.current !== expectedIdentity || requestIdentityRef.current !== expectedRequestIdentity) return;
        const refreshed = await getUser();
        setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, refreshed);
      })
      .finally(() => endUserUpdate(expectedRequestIdentity));
  }, [
    accountId,
    beginUserUpdate,
    deleteCTApiKey,
    endUserUpdate,
    getUser,
    hasCurrentIdentity,
    identity,
    requestIdentity,
    setUserForIdentity,
    user,
  ]);

  const updateFilterCT = useCallback(
    async (types?: TransactionFilterKey[]): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      updateCTApiFilter(types)
        .then(async () => {
          if (identityRef.current !== expectedIdentity || requestIdentityRef.current !== expectedRequestIdentity)
            return;
          const refreshed = await getUser();
          setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, refreshed);
        })
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      getUser,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      updateCTApiFilter,
      user,
    ],
  );

  const updateCallSettings = useCallback(
    async (preferredPhoneTimes?: PhoneCallTime[], acceptCall?: boolean): Promise<void> => {
      if (!user || !hasCurrentIdentity() || accountId === undefined || identity === undefined || !requestIdentity)
        return;
      const expectedIdentity = identity;
      const expectedRequestIdentity = requestIdentity;
      const expectedAccountId = accountId;

      beginUserUpdate(expectedRequestIdentity);
      return updateCallSettingsApi(preferredPhoneTimes, acceptCall)
        .then((updated) => setUserForIdentity(expectedIdentity, expectedRequestIdentity, expectedAccountId, updated))
        .finally(() => endUserUpdate(expectedRequestIdentity));
    },
    [
      accountId,
      beginUserUpdate,
      endUserUpdate,
      hasCurrentIdentity,
      identity,
      requestIdentity,
      setUserForIdentity,
      updateCallSettingsApi,
      user,
    ],
  );

  const addSpecialCodeForCurrentIdentity = useCallback(
    async (code: string): Promise<void> => {
      if (!hasCurrentIdentity()) return;
      return addSpecialCode(code);
    },
    [addSpecialCode, hasCurrentIdentity],
  );

  const context: UserInterface = useMemo(() => {
    const userAddresses = user?.addresses.filter((a) => !a.isCustody) ?? [];
    const custodyAddresses = user?.addresses.filter((a) => a.isCustody) ?? [];

    return {
      user,
      refLink,
      isUserLoading: isUserLoading || (!!identity && loadedIdentity !== identity),
      userLoadError,
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
      addSpecialCode: addSpecialCodeForCurrentIdentity,
      reloadUser,
      filterCT: user?.apiFilterCT ?? user?.activeAddress?.apiFilterCT,
      keyCT: user?.apiKeyCT ?? user?.activeAddress?.apiKeyCT,
      generateKeyCT,
      deleteKeyCT,
      updateFilterCT,
      updateCallSettings,
    };
  }, [
    user,
    refLink,
    isUserLoading,
    userLoadError,
    identity,
    loadedIdentity,
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
    addSpecialCodeForCurrentIdentity,
    reloadUser,
    generateKeyCT,
    deleteKeyCT,
    updateFilterCT,
    updateCallSettings,
  ]);

  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
}
