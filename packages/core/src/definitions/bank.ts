export const BankUrl = {
  get: 'bank',
};

export interface Bank {
  name: string;
  iban: string;
  bic: string;
  currency: string;
}
