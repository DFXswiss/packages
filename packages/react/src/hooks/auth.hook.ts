import { useCallback, useMemo } from 'react';
import { AuthUrl, AuthWalletType, LnurlAuth, LnurlAuthStatus, SignIn, SignMessage } from '../definitions/auth';
import { CallConfig, useApi } from './api.hook';
import { ApiError } from '../definitions/error';

export interface AuthInterface {
  getSignMessage: (address: string) => Promise<string>;
  authenticate: (
    address: string,
    signature: string,
    key?: string,
    specialCode?: string,
    wallet?: string,
    ref?: string,
    walletType?: AuthWalletType,
    recommendationCode?: string,
    language?: string,
  ) => Promise<SignIn>;
  signIn: (
    address: string,
    signature: string,
    key?: string,
    specialCode?: string,
    walletType?: AuthWalletType,
  ) => Promise<SignIn>;
  signUp: (
    address: string,
    signature: string,
    key?: string,
    specialCode?: string,
    wallet?: string,
    ref?: string,
    walletType?: AuthWalletType,
    recommendationCode?: string,
    language?: string,
  ) => Promise<SignIn>;
  signInWithMail: (mail: string, redirectUri?: string, recommendationCode?: string, wallet?: string) => Promise<void>;
  createLnurlAuth: () => Promise<LnurlAuth>;
  getLnurlAuth: (k1: string) => Promise<LnurlAuthStatus>;
}

interface SignUpParams {
  address: string;
  signature: string;
  key?: string;
  specialCode?: string;
  walletId?: number;
  wallet?: string;
  usedRef?: string;
  walletType?: AuthWalletType;
  recommendationCode?: string;
  language?: string;
}

export function useAuth(): AuthInterface {
  const { call } = useApi();

  const getParams = useCallback(
    (
      address: string,
      signature: string,
      key?: string,
      specialCode?: string,
      wallet?: string,
      usedRef?: string,
      walletType?: AuthWalletType,
      recommendationCode?: string,
      language?: string,
    ): SignUpParams => {
      const params: SignUpParams = {
        address,
        signature,
        key,
        usedRef,
        specialCode,
        walletType,
        recommendationCode,
        language,
      };

      if (wallet) {
        const walletId = parseInt(wallet);
        if (!isNaN(walletId)) {
          params.walletId = walletId;
        } else {
          params.wallet = wallet;
        }
      }

      return params;
    },
    [],
  );

  const getSignMessage = useCallback(
    async (address: string): Promise<string> => {
      return call<SignMessage>({ url: `${AuthUrl.signMessage}?address=${address}`, method: 'GET' }).then(
        (result) => result.message,
      );
    },
    [call],
  );

  const authenticate = useCallback(
    async (
      address: string,
      signature: string,
      key?: string,
      specialCode?: string,
      wallet?: string,
      usedRef?: string,
      walletType?: AuthWalletType,
      recommendationCode?: string,
      language?: string,
    ): Promise<SignIn> => {
      const data = getParams(
        address,
        signature,
        key,
        specialCode,
        wallet,
        usedRef,
        walletType,
        recommendationCode,
        language,
      );
      const config: CallConfig = { url: AuthUrl.auth, method: 'POST', data };

      return call<SignIn>(config).catch((e: ApiError) => {
        if (e.statusCode === 409) return call<SignIn>({ ...config, token: false });

        throw e;
      });
    },
    [call, getParams],
  );

  const signIn = useCallback(
    async (
      address: string,
      signature: string,
      key?: string,
      specialCode?: string,
      walletType?: AuthWalletType,
    ): Promise<SignIn> => {
      const data = getParams(address, signature, key, specialCode, undefined, undefined, walletType);
      return call({ url: AuthUrl.signIn, method: 'POST', data });
    },
    [call, getParams],
  );

  const signUp = useCallback(
    async (
      address: string,
      signature: string,
      key?: string,
      specialCode?: string,
      wallet?: string,
      usedRef?: string,
      walletType?: AuthWalletType,
      recommendationCode?: string,
      language?: string,
    ): Promise<SignIn> => {
      const data = getParams(
        address,
        signature,
        key,
        specialCode,
        wallet,
        usedRef,
        walletType,
        recommendationCode,
        language,
      );
      return call({ url: AuthUrl.signUp, method: 'POST', data });
    },
    [call, getParams],
  );

  const signInWithMail = useCallback(
    async (mail: string, redirectUri?: string, recommendationCode?: string, wallet?: string): Promise<void> => {
      return call({
        url: AuthUrl.signInWithMail,
        method: 'POST',
        data: { mail, redirectUri, recommendationCode, wallet },
      });
    },
    [call],
  );

  const createLnurlAuth = useCallback(async (): Promise<LnurlAuth> => {
    return call({ url: AuthUrl.lnurl, method: 'POST' });
  }, [call]);

  const getLnurlAuth = useCallback(
    async (k1: string): Promise<LnurlAuthStatus> => {
      return call({ url: `${AuthUrl.lnurlStatus}?k1=${k1}`, method: 'GET' });
    },
    [call],
  );

  return useMemo(
    () => ({ getSignMessage, authenticate, signIn, signUp, signInWithMail, createLnurlAuth, getLnurlAuth }),
    [getSignMessage, authenticate, signIn, signUp, signInWithMail, createLnurlAuth, getLnurlAuth],
  );
}
