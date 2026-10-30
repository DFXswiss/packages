import { useCallback, useMemo } from 'react';
import { PasskeyUrl, PasskeyWallet, PasskeyRevocationReason, passkeyWalletUrl } from '@dfx.swiss/core';
import { useApi } from './api.hook';

/** Passkey wallet management for the settings screens (D11, D14 reduced). */
export interface PasskeyInterface {
  wallets: (token?: string) => Promise<PasskeyWallet[]>;
  backupSeen: (id: number, token: string) => Promise<PasskeyWallet>;
  revoke: (id: number, reason: PasskeyRevocationReason, token: string) => Promise<PasskeyWallet>;
}

export function usePasskeyApi(): PasskeyInterface {
  const { call } = useApi();

  const wallets = useCallback(
    (token?: string) =>
      call<PasskeyWallet[]>({ url: PasskeyUrl.wallets, method: 'GET', token, skipAuthHandling: true }),
    [call],
  );

  const backupSeen = useCallback(
    (id: number, token: string) =>
      call<PasskeyWallet>({ url: passkeyWalletUrl(id, 'backupSeen'), method: 'PUT', token, skipAuthHandling: true }),
    [call],
  );

  const revoke = useCallback(
    (id: number, reason: PasskeyRevocationReason, token: string) =>
      call<PasskeyWallet>({
        url: passkeyWalletUrl(id, 'revoke'),
        method: 'PUT',
        data: { reason },
        token,
        skipAuthHandling: true,
      }),
    [call],
  );

  return useMemo(() => ({ wallets, backupSeen, revoke }), [wallets, backupSeen, revoke]);
}
