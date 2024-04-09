import { Fiat } from './fiat';

export const BankAccountUrl = {
  get: 'bankAccount',
  create: 'bankAccount',
  update: (id: number) => `bankAccount/${id}`,
  iban: 'bankAccount/iban',
};

export interface BankAccount {
  id: number;
  iban: string;
  label?: string;
  preferredCurrency?: Fiat;
  sepaInstant: boolean;
}

export interface Iban {
  iban: string;
}
