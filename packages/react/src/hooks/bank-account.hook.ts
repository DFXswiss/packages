import { useCallback, useMemo } from 'react';
import { BankAccount, BankAccountUrl } from '../definitions/bank-account';
import { Fiat } from '../definitions/fiat';
import { useApi } from './api.hook';

export interface CreateBankAccount {
  label?: string;
  preferredCurrency?: Fiat;
  iban: string;
}

export interface UpdateBankAccount {
  label?: string;
  preferredCurrency?: Fiat;
  active?: boolean;
  default?: boolean;
}

export interface BankAccountInterface {
  getAccounts: () => Promise<BankAccount[]>;
  getAccount: (accounts?: BankAccount[], identifier?: string) => BankAccount | undefined;
  createAccount: (newAccount: CreateBankAccount) => Promise<BankAccount>;
  updateAccount: (id: number, changedAccount: UpdateBankAccount) => Promise<BankAccount>;
}

export function useBankAccount(): BankAccountInterface {
  const { call } = useApi();

  const getAccounts = useCallback(async (): Promise<BankAccount[]> => {
    return call<BankAccount[]>({ url: BankAccountUrl.get, method: 'GET' });
  }, [call]);

  const getAccount = useCallback((accounts: BankAccount[] = [], identifier?: string): BankAccount | undefined => {
    if (!identifier) return undefined;

    return (
      accounts.find((b) => b.id === +identifier) ??
      accounts.find((b) => b.iban.toLowerCase() === identifier.toLowerCase()) ??
      accounts.find((b) => b.label?.toLowerCase() === identifier.toLowerCase())
    );
  }, []);

  const createAccount = useCallback(async (newAccount: CreateBankAccount): Promise<BankAccount> => {
    return call<BankAccount>({ url: BankAccountUrl.create, method: 'POST', data: newAccount });
  }, [call]);

  const updateAccount = useCallback(async (id: number, changedAccount: UpdateBankAccount): Promise<BankAccount> => {
    return call<BankAccount>({ url: BankAccountUrl.update(id), method: 'PUT', data: changedAccount });
  }, [call]);

  return useMemo(() => ({ getAccounts, getAccount, createAccount, updateAccount }), [getAccounts, getAccount, createAccount, updateAccount]);
}
