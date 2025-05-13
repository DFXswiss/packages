import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { CreateBankAccount, UpdateBankAccount, useBankAccount } from '../hooks/bank-account.hook';
import { BankAccount } from '../definitions/bank-account';
import { useApiSession } from '../hooks/api-session.hook';

interface BankAccountInterface {
  bankAccounts?: BankAccount[];
  isLoading: boolean;
  error?: string;
  createAccount: (newAccount: CreateBankAccount) => Promise<BankAccount>;
  updateAccount: (id: number, changedAccount: UpdateBankAccount) => Promise<BankAccount>;
}

const BankAccountContext = createContext<BankAccountInterface>(undefined as any);

export function useBankAccountContext(): BankAccountInterface {
  return useContext(BankAccountContext);
}

export function BankAccountContextProvider(props: PropsWithChildren): JSX.Element {
  const { isLoggedIn, session } = useApiSession();
  const { getAccounts, createAccount, updateAccount } = useBankAccount();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      getAccounts()
        .then((accounts) => setBankAccounts(accounts.filter((a) => a.active)))
        .catch((e) => {
          setError(e.message);
          setBankAccounts(undefined);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn, session]);

  async function addNewAccount(newAccount: CreateBankAccount): Promise<BankAccount> {
    setIsLoading(true);
    return createAccount(newAccount)
      .then((b) => {
        setBankAccounts((accounts) => (accounts ?? []).concat(b));
        return b;
      })
      .finally(() => setIsLoading(false));
  }

  async function updateExistingAccount(id: number, changedAccount: UpdateBankAccount): Promise<BankAccount> {
    setIsLoading(true);
    return updateAccount(id, changedAccount)
      .then((b) => {
        setBankAccounts((accounts) => updateLocal(b, accounts));
        return b;
      })
      .finally(() => setIsLoading(false));
  }

  function updateLocal(account: BankAccount, accounts?: BankAccount[]): BankAccount[] | undefined {
    const index = accounts?.findIndex((b) => b.id === account.id);
    if (!accounts || index === undefined || index === -1) return undefined;

    if (account.active === false) {
      return accounts?.filter((b) => b.id !== account.id);
    }

    if (account.default) {
      accounts?.forEach((a) => {
        if (a.id !== account.id) {
          a.default = false;
        }
      });
    }

    accounts[index] = account;
    return accounts;
  }

  const context: BankAccountInterface = useMemo(
    () => ({
      bankAccounts,
      isLoading,
      error,
      createAccount: addNewAccount,
      updateAccount: updateExistingAccount,
    }),
    [bankAccounts, isLoading, error, addNewAccount, updateExistingAccount],
  );

  return <BankAccountContext.Provider value={context}>{props.children}</BankAccountContext.Provider>;
}
