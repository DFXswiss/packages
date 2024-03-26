import { useMemo } from 'react';
import { AuthUrl, LnurlAuth, LnurlAuthStatus, SignIn, SignMessage } from '../definitions/auth';
import { useApi } from './api.hook';

export interface AuthInterface {
  getSignMessage: (address: string) => Promise<string>;
  authenticate: (
    address: string,
    signature: string,
    key?: string,
    discountCode?: string,
    wallet?: string,
    ref?: string,
  ) => Promise<SignIn>;
  signIn: (address: string, signature: string, key?: string, discountCode?: string) => Promise<SignIn>;
  signUp: (
    address: string,
    signature: string,
    key?: string,
    discountCode?: string,
    wallet?: string,
    ref?: string,
  ) => Promise<SignIn>;
  signInWithMail: (mail: string) => Promise<void>;
  createLnurlAuth: () => Promise<LnurlAuth>;
  getLnurlAuth: (k1: string) => Promise<LnurlAuthStatus>;
}

interface SignUpParams {
  address: string;
  signature: string;
  key?: string;
  discountCode?: string;
  walletId?: number;
  wallet?: string;
  usedRef?: string;
}

export function useAuth(): AuthInterface {
  const { call } = useApi();

  async function getSignMessage(address: string): Promise<string> {
    return call<SignMessage>({ url: `${AuthUrl.signMessage}?address=${address}`, method: 'GET' }).then(
      (result) => result.message,
    );
  }

  async function authenticate(
    address: string,
    signature: string,
    key?: string,
    discountCode?: string,
    wallet?: string,
    usedRef?: string,
  ): Promise<SignIn> {
    const data = getParams(address, signature, key, discountCode, wallet, usedRef);
    return call({ url: AuthUrl.auth, method: 'POST', data });
  }

  async function signIn(address: string, signature: string, key?: string, discountCode?: string): Promise<SignIn> {
    const data = getParams(address, signature, key, discountCode);
    return call({ url: AuthUrl.signIn, method: 'POST', data });
  }

  async function signUp(
    address: string,
    signature: string,
    key?: string,
    discountCode?: string,
    wallet?: string,
    usedRef?: string,
  ): Promise<SignIn> {
    const data = getParams(address, signature, key, discountCode, wallet, usedRef);
    return call({ url: AuthUrl.signUp, method: 'POST', data });
  }

  async function signInWithMail(mail: string): Promise<void> {
    return call({ url: AuthUrl.signInWithMail, method: 'POST', data: { mail } });
  }

  async function createLnurlAuth(): Promise<LnurlAuth> {
    return call({ url: AuthUrl.lnurl, method: 'POST' });
  }

  async function getLnurlAuth(k1: string): Promise<LnurlAuthStatus> {
    return call({ url: `${AuthUrl.lnurlStatus}?k1=${k1}`, method: 'GET' });
  }

  function getParams(
    address: string,
    signature: string,
    key?: string,
    discountCode?: string,
    wallet?: string,
    usedRef?: string,
  ): SignUpParams {
    const params: SignUpParams = { address, signature, key, usedRef, discountCode };

    if (wallet) {
      const walletId = parseInt(wallet);
      if (!isNaN(walletId)) {
        params.walletId = walletId;
      } else {
        params.wallet = wallet;
      }
    }

    return params;
  }

  return useMemo(
    () => ({ getSignMessage, authenticate, signIn, signUp, signInWithMail, createLnurlAuth, getLnurlAuth }),
    [call],
  );
}
