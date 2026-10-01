import { useCallback, useMemo } from 'react';
import { AuthUrl, AuthWalletType, LnurlAuth, LnurlAuthStatus, SignIn, SignMessage } from '../definitions/auth';
import { TfaLevel, TfaSetup } from '../definitions/kyc';
import { CallConfig, useApi } from './api.hook';
import { ApiError } from '../definitions/error';
import { JobResponse } from '../definitions/job';

export interface AuthInterface {
  confirmAccountMerge: (code: string, authenticated?: boolean) => Promise<AccountMergeResponse | JobResponse>;
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
  check2fa: (level?: TfaLevel) => Promise<TfaSetup>;
  setup2fa: (level?: TfaLevel) => Promise<TfaSetup>;
  verify2fa: (token: string) => Promise<void>;
  createLnurlAuth: () => Promise<LnurlAuth>;
  getLnurlAuth: (k1: string) => Promise<LnurlAuthStatus>;
}

export interface AccountMergeResponse {
  kycHash?: string;
  accessToken?: string;
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

  const confirmAccountMerge = useCallback(
    async (code: string, authenticated = true): Promise<AccountMergeResponse | JobResponse> => {
      return call<AccountMergeResponse | JobResponse>({
        url: `${AuthUrl.confirmMail}?code=${encodeURIComponent(code)}`,
        method: 'GET',
        ...(authenticated ? {} : { token: false }),
      });
    },
    [call],
  );

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

  const check2fa = useCallback(
    async (level?: TfaLevel): Promise<TfaSetup> => {
      const url = level ? `${AuthUrl.tfa}?level=${level}` : AuthUrl.tfa;
      return call({ url, method: 'GET' });
    },
    [call],
  );

  const setup2fa = useCallback(
    async (level?: TfaLevel): Promise<TfaSetup> => {
      const url = level ? `${AuthUrl.tfa}?level=${level}` : AuthUrl.tfa;
      return call({ url, method: 'POST' });
    },
    [call],
  );

  const verify2fa = useCallback(
    async (token: string): Promise<void> => {
      return call({ url: `${AuthUrl.tfa}/verify`, method: 'POST', data: { token } });
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
    () => ({
      confirmAccountMerge,
      getSignMessage,
      authenticate,
      signIn,
      signUp,
      signInWithMail,
      check2fa,
      setup2fa,
      verify2fa,
      createLnurlAuth,
      getLnurlAuth,
    }),
    [
      confirmAccountMerge,
      getSignMessage,
      authenticate,
      signIn,
      signUp,
      signInWithMail,
      check2fa,
      setup2fa,
      verify2fa,
      createLnurlAuth,
      getLnurlAuth,
    ],
  );
}
