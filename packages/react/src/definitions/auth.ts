export const AuthUrl = {
  signMessage: 'auth/signMessage',
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
