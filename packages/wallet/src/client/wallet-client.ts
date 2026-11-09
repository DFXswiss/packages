import { DfxHttpClient, PasskeyApi } from '@dfx.swiss/core';
import type {
  PasskeyAddress,
  PasskeyCredentialStatusResult,
  PasskeyDiagnosticParams,
  PasskeyWallet,
} from '@dfx.swiss/core';
import type { WalletEnv } from '../config/environment';
import type { KeyRing } from '../derivation/keyring';
import { PasskeyCeremonies } from '../passkey/ceremonies';
import type { CredentialCache } from '../passkey/credential-cache';
import { PasskeyAuth } from '../session/passkey-auth';
import type { AuthResult, RegisterExtras, WalletState } from '../session/passkey-auth';

export interface WalletClient {
  login(): Promise<AuthResult>;
  register(extras: RegisterExtras): Promise<AuthResult>;
  unlock(): Promise<{ keys?: KeyRing; state: WalletState }>;
  link(
    family: 'evm' | 'bitcoin',
    sessionToken: string,
    keys: KeyRing,
    evmIndex?: number,
  ): Promise<{ accessToken: string; address: PasskeyAddress }>;
  revoke(reason: 'Lost' | 'Compromised'): Promise<PasskeyWallet>;
  exportMnemonic(credentialId?: Uint8Array): Promise<string[]>;
  verifyServerAddresses(wallet: PasskeyWallet, keys: KeyRing): { address: string; family: string; matches: boolean }[];
  wallets(sessionToken: string): Promise<PasskeyWallet[]>;
  backupSeen(walletId: number, sessionToken: string): Promise<PasskeyWallet>;
  credentialStatus(ids: string[]): Promise<PasskeyCredentialStatusResult[]>;
  diagnostics(input: PasskeyDiagnosticParams): Promise<void>;
}

export interface WalletClientOptions {
  /** Versioned API base, the same value a `DfxApiClient` gets, e.g. `https://api.dfx.swiss/v1`. */
  apiUrl: string;
  env: WalletEnv;
  cache?: CredentialCache;
  ceremonies?: PasskeyCeremonies;
  fetchFn?: typeof fetch;
}

/** DFXswiss/wallet-api connects here; until then calls go through the existing passkey routes of the DFX API. */
export function createWalletClient(options: WalletClientOptions): WalletClient {
  const http = new DfxHttpClient({ apiUrl: options.apiUrl, fetchFn: options.fetchFn });
  const passkey = new PasskeyApi(http);
  const auth = new PasskeyAuth({
    api: { passkey },
    ceremonies: options.ceremonies ?? new PasskeyCeremonies(options.env),
    env: options.env,
    cache: options.cache,
  });

  return {
    login: () => auth.login(),
    register: (extras) => auth.register(extras),
    unlock: () => auth.unlock(),
    link: (family, sessionToken, keys, evmIndex) => auth.link(family, sessionToken, keys, evmIndex),
    revoke: (reason) => auth.revoke(reason),
    exportMnemonic: (credentialId) => auth.exportMnemonic(credentialId),
    verifyServerAddresses: (wallet, keys) => auth.verifyServerAddresses(wallet, keys),
    wallets: (sessionToken) => passkey.wallets(sessionToken),
    backupSeen: (walletId, sessionToken) => passkey.backupSeen(walletId, sessionToken),
    credentialStatus: (ids) => passkey.credentialStatus(ids),
    diagnostics: (input) => passkey.diagnostics(input),
  };
}
