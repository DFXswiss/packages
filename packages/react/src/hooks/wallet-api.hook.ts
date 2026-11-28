import { useCallback, useMemo } from 'react';
import {
  WalletAddress,
  WalletApiUrl,
  WalletBitcoinAccount,
  WalletBitcoinAccountRequest,
  WalletBitcoinBlockchain,
  WalletBitcoinFees,
  WalletBitcoinPrepare,
  WalletBitcoinPrepareRequest,
  WalletBitcoinSubmitRequest,
  WalletBitcoinSubmitResponse,
  WalletConfig,
  WalletCredential,
  WalletUpsertAddressRequest,
} from '../definitions/wallet-api';
import { CallConfig, useApi } from './api.hook';

/** wallet-api (`/v1/wallet/*`) for the passkey wallet screens. */
export interface WalletApiInterface {
  /** The families the app shows (`GET wallet/config`, public). */
  getConfig: () => Promise<WalletConfig>;
  getCredentials: () => Promise<WalletCredential[]>;
  getAddresses: () => Promise<WalletAddress[]>;
  upsertAddress: (request: WalletUpsertAddressRequest) => Promise<WalletAddress>;
  /** Balance, UTXOs and capped history of up to 50 own addresses. */
  getBitcoinAccount: (
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinAccountRequest,
  ) => Promise<WalletBitcoinAccount>;
  getBitcoinFees: (blockchain: WalletBitcoinBlockchain) => Promise<WalletBitcoinFees>;
  /** Server-side coin selection; verify and sign the PSBT on the device (`@dfx.swiss/wallet` `BitcoinSend`). */
  prepareBitcoinSend: (
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinPrepareRequest,
  ) => Promise<WalletBitcoinPrepare>;
  submitBitcoinSend: (
    blockchain: WalletBitcoinBlockchain,
    request: WalletBitcoinSubmitRequest,
  ) => Promise<WalletBitcoinSubmitResponse>;
}

/**
 * wallet-api calls with the wallet session `sessionToken` (from the passkey login), never with the DFX customer
 * session: without a wallet token the session routes go out without one and answer 401 `SessionRequired`. A 401
 * neither clears the customer session nor retries.
 */
export function useWalletApi(sessionToken?: string): WalletApiInterface {
  const { call } = useApi();

  const publicCall = useCallback(
    <T>(config: Omit<CallConfig, 'token' | 'skipAuthHandling'>) =>
      call<T>({ ...config, token: false, skipAuthHandling: true }),
    [call],
  );

  const sessionCall = useCallback(
    <T>(config: Omit<CallConfig, 'token' | 'skipAuthHandling'>) =>
      call<T>({ ...config, token: sessionToken || false, skipAuthHandling: true }),
    [call, sessionToken],
  );

  const getConfig = useCallback(
    () => publicCall<WalletConfig>({ url: WalletApiUrl.config, method: 'GET' }),
    [publicCall],
  );

  const getCredentials = useCallback(
    () => sessionCall<WalletCredential[]>({ url: WalletApiUrl.credentials, method: 'GET' }),
    [sessionCall],
  );

  const getAddresses = useCallback(
    () => sessionCall<WalletAddress[]>({ url: WalletApiUrl.addresses, method: 'GET' }),
    [sessionCall],
  );

  const upsertAddress = useCallback(
    (request: WalletUpsertAddressRequest) =>
      sessionCall<WalletAddress>({ url: WalletApiUrl.addresses, method: 'PUT', data: request }),
    [sessionCall],
  );

  const getBitcoinAccount = useCallback(
    (blockchain: WalletBitcoinBlockchain, request: WalletBitcoinAccountRequest) =>
      sessionCall<WalletBitcoinAccount>({
        url: WalletApiUrl.bitcoinAccount(blockchain),
        method: 'POST',
        data: request,
      }),
    [sessionCall],
  );

  const getBitcoinFees = useCallback(
    (blockchain: WalletBitcoinBlockchain) =>
      sessionCall<WalletBitcoinFees>({ url: WalletApiUrl.bitcoinFees(blockchain), method: 'GET' }),
    [sessionCall],
  );

  const prepareBitcoinSend = useCallback(
    (blockchain: WalletBitcoinBlockchain, request: WalletBitcoinPrepareRequest) =>
      sessionCall<WalletBitcoinPrepare>({
        url: WalletApiUrl.bitcoinPrepare(blockchain),
        method: 'POST',
        data: request,
      }),
    [sessionCall],
  );

  const submitBitcoinSend = useCallback(
    (blockchain: WalletBitcoinBlockchain, request: WalletBitcoinSubmitRequest) =>
      sessionCall<WalletBitcoinSubmitResponse>({
        url: WalletApiUrl.bitcoinSubmit(blockchain),
        method: 'POST',
        data: request,
      }),
    [sessionCall],
  );

  return useMemo(
    () => ({
      getConfig,
      getCredentials,
      getAddresses,
      upsertAddress,
      getBitcoinAccount,
      getBitcoinFees,
      prepareBitcoinSend,
      submitBitcoinSend,
    }),
    [
      getConfig,
      getCredentials,
      getAddresses,
      upsertAddress,
      getBitcoinAccount,
      getBitcoinFees,
      prepareBitcoinSend,
      submitBitcoinSend,
    ],
  );
}
