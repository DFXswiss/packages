import { useMemo } from 'react';
import { AuthUrl, LnurlAuth, LnurlAuthStatus, SignIn, SignMessage } from '../definitions/auth';
import { useApi } from './api.hook';

export interface AuthInterface {
  getSignMessage: (address: string) => Promise<string>;
  signIn: (address: string, signature: string, discountCode?: string) => Promise<SignIn>;
  signUp: (address: string, signature: string, wallet?: string, ref?: string, discountCode?: string) => Promise<SignIn>;
  createLnurlAuth: () => Promise<LnurlAuth>;
  getLnurlAuth: (k1: string) => Promise<LnurlAuthStatus>;
}

interface SignUpParams {
  address: string;
  signature: string;
  walletId?: number;
  wallet?: string;
  usedRef?: string;
  discountCode?: string;
}

export function useAuth(): AuthInterface {
  const { call } = useApi();

  async function getSignMessage(address: string): Promise<string> {
    return call<SignMessage>({ url: `${AuthUrl.signMessage}?address=${address}`, method: 'GET' }).then(
      (result) => result.message,
    );
  }

  async function signIn(address: string, signature: string, discountCode?: string): Promise<SignIn> {
    return call({ url: AuthUrl.signIn, method: 'POST', data: { address, signature, discountCode } });
  }

  async function signUp(
    address: string,
    signature: string,
    wallet?: string,
    usedRef?: string,
    discountCode?: string,
  ): Promise<SignIn> {
    const data: SignUpParams = { address, signature, usedRef, discountCode };

    if (wallet) {
      const walletId = parseInt(wallet);
      if (!isNaN(walletId)) {
        data.walletId = walletId;
      } else {
        data.wallet = wallet;
      }
    }

    return call({ url: AuthUrl.signUp, method: 'POST', data });
  }

  async function createLnurlAuth(): Promise<LnurlAuth> {
    return call({ url: AuthUrl.lnurl, method: 'POST' });
  }
  async function getLnurlAuth(k1: string): Promise<LnurlAuthStatus> {
    return call({ url: `${AuthUrl.lnurlStatus}?k1=${k1}`, method: 'GET' });
  }

  return useMemo(() => ({ getSignMessage, signIn, signUp, createLnurlAuth, getLnurlAuth }), [call]);
}
