export const AuthUrl = {
  signMessage: 'auth/signMessage',
  auth: 'auth',
  signIn: 'auth/signIn',
  signUp: 'auth/signUp',
  signInWithMail: 'auth/mail',
  lnurl: 'lnurla',
  lnurlStatus: 'lnurla/status',
};

export interface SignMessage {
  message: string;
}

export interface SignIn {
  accessToken: string;
}

export interface LnurlAuth {
  k1: string;
  lnurl: string;
}

export type LnurlAuthStatus =
  | {
      isComplete: true;
      accessToken: string;
    }
  | { isComplete: false };

export enum AuthWalletType {
  METAMASK = 'MetaMask',
  RABBY = 'Rabby',
  WALLET_BROWSER = 'WalletBrowser',
  TRUST = 'Trust',
  PHANTOM = 'Phantom',
  TRON_LINK = 'TronLink',
  CLI = 'CLI',
  LEDGER = 'Ledger',
  BIT_BOX = 'BitBox',
  TREZOR = 'Trezor',
  ALBY = 'Alby',
  WALLET_CONNECT = 'WalletConnect',
  DFX_TARO = 'DfxTaro',
}
