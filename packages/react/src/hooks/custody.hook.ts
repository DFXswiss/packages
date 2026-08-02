import { Utils } from '@dfx.swiss/core';
import { useCallback, useMemo } from 'react';
import { PdfDocument } from '../definitions/buy';
import {
  CreateCustodyAccount,
  CreateCustodyAccountAccess,
  CreateCustodyOrder,
  CustodyAccount,
  CustodyAccountAccess,
  CustodyAccountId,
  CustodyAuth,
  CustodyBalance,
  CustodyHistory,
  CustodyOrder,
  CustodyOrderHistory,
  CustodyPdfQuery,
  CustodySignup,
  CustodyUrl,
  PersistedCustodyAccountId,
  UpdateCustodyAccount,
  UpdateCustodyAccountAccess,
} from '../definitions/custody';
import { useApi } from './api.hook';

export interface CustodyInterface {
  /**
   * Signs the account up for custody and returns a custody access token.
   *
   * That token addresses the custody address, not the address the caller signed in with. Order
   * calls need it; keep it next to the session token rather than replacing it.
   */
  signup: (data: CustodySignup) => Promise<CustodyAuth>;
  /** Custody accounts the caller owns or has been granted access to, including the legacy one. */
  getAccounts: () => Promise<CustodyAccount[]>;
  getAccount: (id: CustodyAccountId) => Promise<CustodyAccount>;
  createAccount: (data: CreateCustodyAccount) => Promise<CustodyAccount>;
  /** The legacy account cannot be renamed - it has no row to rename. */
  updateAccount: (id: PersistedCustodyAccountId, data: UpdateCustodyAccount) => Promise<CustodyAccount>;
  /** Balances of the caller's own custody account. For a specific account use getAccountBalance. */
  getBalance: () => Promise<CustodyBalance>;
  getAccountBalance: (id: CustodyAccountId) => Promise<CustodyBalance>;
  getHistory: () => Promise<CustodyHistory>;
  getAccountHistory: (id: CustodyAccountId) => Promise<CustodyHistory>;
  getOrders: () => Promise<CustodyOrderHistory[]>;
  getAccountOrders: (id: CustodyAccountId) => Promise<CustodyOrderHistory[]>;
  /**
   * Quotes an order and reserves it. Nothing moves until the order is confirmed.
   *
   * The custody token from signup is required, not the session token. It is not optional on
   * purpose: leaving it out would send the session token instead and fail on the API side.
   */
  createOrder: (data: CreateCustodyOrder, token: string) => Promise<CustodyOrder>;
  /** Confirms a quoted order. Requires the custody token, like createOrder. */
  confirmOrder: (orderId: number, token: string) => Promise<void>;
  /** Balance report of the caller's own custody account, as a base64 encoded PDF. */
  getPdf: (params: CustodyPdfQuery) => Promise<PdfDocument>;
  getAccountPdf: (id: CustodyAccountId, params: CustodyPdfQuery) => Promise<PdfDocument>;
  getAccess: (id: PersistedCustodyAccountId) => Promise<CustodyAccountAccess[]>;
  grantAccess: (id: CustodyAccountId, data: CreateCustodyAccountAccess) => Promise<CustodyAccountAccess>;
  updateAccess: (
    id: PersistedCustodyAccountId,
    accessId: number,
    data: UpdateCustodyAccountAccess,
  ) => Promise<CustodyAccountAccess>;
  revokeAccess: (id: PersistedCustodyAccountId, accessId: number) => Promise<void>;
}

export function useCustody(): CustodyInterface {
  const { call } = useApi();

  const signup = useCallback(
    async (data: CustodySignup) => call<CustodyAuth>({ url: CustodyUrl.signup, method: 'POST', data }),
    [call],
  );

  const getAccounts = useCallback(
    async () => call<CustodyAccount[]>({ url: CustodyUrl.account, method: 'GET' }),
    [call],
  );

  const getAccount = useCallback(
    async (id: CustodyAccountId) => call<CustodyAccount>({ url: CustodyUrl.accountById(id), method: 'GET' }),
    [call],
  );

  const createAccount = useCallback(
    async (data: CreateCustodyAccount) => call<CustodyAccount>({ url: CustodyUrl.account, method: 'POST', data }),
    [call],
  );

  const updateAccount = useCallback(
    async (id: PersistedCustodyAccountId, data: UpdateCustodyAccount) =>
      call<CustodyAccount>({ url: CustodyUrl.updateAccount(id), method: 'PUT', data }),
    [call],
  );

  const getBalance = useCallback(async () => call<CustodyBalance>({ url: CustodyUrl.balance, method: 'GET' }), [call]);

  const getAccountBalance = useCallback(
    async (id: CustodyAccountId) => call<CustodyBalance>({ url: CustodyUrl.accountBalance(id), method: 'GET' }),
    [call],
  );

  const getHistory = useCallback(async () => call<CustodyHistory>({ url: CustodyUrl.history, method: 'GET' }), [call]);

  const getAccountHistory = useCallback(
    async (id: CustodyAccountId) => call<CustodyHistory>({ url: CustodyUrl.accountHistory(id), method: 'GET' }),
    [call],
  );

  const getOrders = useCallback(
    async () => call<CustodyOrderHistory[]>({ url: CustodyUrl.order, method: 'GET' }),
    [call],
  );

  const getAccountOrders = useCallback(
    async (id: CustodyAccountId) => call<CustodyOrderHistory[]>({ url: CustodyUrl.accountOrder(id), method: 'GET' }),
    [call],
  );

  const createOrder = useCallback(
    async (data: CreateCustodyOrder, token: string) =>
      call<CustodyOrder>({ url: CustodyUrl.order, method: 'POST', data, token }),
    [call],
  );

  const confirmOrder = useCallback(
    async (orderId: number, token: string) =>
      call<void>({ url: CustodyUrl.confirmOrder(orderId), method: 'POST', token }),
    [call],
  );

  const getPdf = useCallback(
    async (params: CustodyPdfQuery) =>
      call<PdfDocument>({ url: `${CustodyUrl.pdf}${Utils.buildQuery({ ...params })}`, method: 'GET' }),
    [call],
  );

  const getAccountPdf = useCallback(
    async (id: CustodyAccountId, params: CustodyPdfQuery) =>
      call<PdfDocument>({ url: `${CustodyUrl.accountPdf(id)}${Utils.buildQuery({ ...params })}`, method: 'GET' }),
    [call],
  );

  const getAccess = useCallback(
    async (id: PersistedCustodyAccountId) =>
      call<CustodyAccountAccess[]>({ url: CustodyUrl.accountAccessList(id), method: 'GET' }),
    [call],
  );

  const grantAccess = useCallback(
    async (id: CustodyAccountId, data: CreateCustodyAccountAccess) =>
      call<CustodyAccountAccess>({ url: CustodyUrl.accountAccess(id), method: 'POST', data }),
    [call],
  );

  const updateAccess = useCallback(
    async (id: PersistedCustodyAccountId, accessId: number, data: UpdateCustodyAccountAccess) =>
      call<CustodyAccountAccess>({ url: CustodyUrl.accountAccessById(id, accessId), method: 'PUT', data }),
    [call],
  );

  const revokeAccess = useCallback(
    async (id: PersistedCustodyAccountId, accessId: number) =>
      call<void>({ url: CustodyUrl.accountAccessById(id, accessId), method: 'DELETE' }),
    [call],
  );

  return useMemo(
    () => ({
      signup,
      getAccounts,
      getAccount,
      createAccount,
      updateAccount,
      getBalance,
      getAccountBalance,
      getHistory,
      getAccountHistory,
      getOrders,
      getAccountOrders,
      createOrder,
      confirmOrder,
      getPdf,
      getAccountPdf,
      getAccess,
      grantAccess,
      updateAccess,
      revokeAccess,
    }),
    [
      signup,
      getAccounts,
      getAccount,
      createAccount,
      updateAccount,
      getBalance,
      getAccountBalance,
      getHistory,
      getAccountHistory,
      getOrders,
      getAccountOrders,
      createOrder,
      confirmOrder,
      getPdf,
      getAccountPdf,
      getAccess,
      grantAccess,
      updateAccess,
      revokeAccess,
    ],
  );
}
