import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { CreateBankAccount, UpdateBankAccount, useBankAccount } from '../hooks/bank-account.hook';
import { BankAccount } from '../definitions/bank-account';
import { useApiSession } from '../hooks/api-session.hook';

interface BankAccountInterface {
  bankAccounts?: BankAccount[];
  isAccountLoading: boolean;
  createAccount: (newAccount: CreateBankAccount) => Promise<BankAccount>;
  updateAccount: (id: number, changedAccount: UpdateBankAccount) => Promise<BankAccount>;
}

const BankAccountContext = createContext<BankAccountInterface>(undefined as any);

export function useBankAccountContext(): BankAccountInterface {
  return useContext(BankAccountContext);
}

export function BankAccountContextProvider(props: PropsWithChildren): JSX.Element {
  const { isLoggedIn, session } = useApiSession();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>();
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const { getAccounts, createAccount, updateAccount } = useBankAccount();

  useEffect(() => {
    if (isLoggedIn) {
      getAccounts().then(setBankAccounts).catch(console.error); // TODO: (Krysh) add real error handling
    }
  }, [isLoggedIn, session]);

  async function addNewAccount(newAccount: CreateBankAccount): Promise<BankAccount> {
    setIsAccountLoading(true);
    return createAccount(newAccount)
      .then((b) => {
        setBankAccounts((bankAccounts ?? []).concat(b));
        return b;
      })
      .finally(() => setIsAccountLoading(false));
  }

  async function updateExistingAccount(id: number, changedAccount: UpdateBankAccount): Promise<BankAccount> {
    return updateAccount(id, changedAccount).then((b) => {
      setBankAccounts(replace(b, bankAccounts));
      return b;
    });
  }

  function replace(account: BankAccount, accounts?: BankAccount[]): BankAccount[] | undefined {
    const index = accounts?.findIndex((b) => b.id === account.id);
    if (index && accounts) accounts[index] = account;
    return accounts;
  }

  const context: BankAccountInterface = useMemo(
    () => ({
      bankAccounts,
      isAccountLoading,
      createAccount: addNewAccount,
      updateAccount: updateExistingAccount,
    }),
    [bankAccounts, isAccountLoading, addNewAccount, updateExistingAccount],
  );

  return <BankAccountContext.Provider value={context}>{props.children}</BankAccountContext.Provider>;
}
