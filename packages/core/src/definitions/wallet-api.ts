/**
 * Contract of DFXswiss/wallet-api, reached through the DFX API host under `/v1/wallet/*` (front-api routes
 * that prefix to wallet-api, everything else to the DFX backend). wallet-api sessions are wallet sessions,
 * not DFX customer sessions: a wallet token is never sent to the backend and a customer token never to
 * wallet-api. Errors are `{ statusCode, code, message }` and surface as `ApiException` with `code` set.
 */

/** Bitcoin networks of the wallet-api Bitcoin endpoints. `BitcoinRegtest` never answers on PRD. */
export type WalletBitcoinBlockchain = 'Bitcoin' | 'BitcoinTestnet4' | 'BitcoinRegtest';

/** Chains of `PUT /wallet/addresses` (`UpsertAddressDto.chain`). */
export type WalletChainId = 'bitcoin' | 'ethereum' | 'spark';

/** Routes of wallet-api, relative to the versioned DFX API URL (`/v1`). */
export const WalletApiUrl = {
  registerBegin: 'wallet/register/begin',
  registerFinish: 'wallet/register/finish',
  authenticateBegin: 'wallet/authenticate/begin',
  authenticateFinish: 'wallet/authenticate/finish',
  revokeBegin: 'wallet/revoke/begin',
  revokeFinish: 'wallet/revoke/finish',
  credentials: 'wallet/credentials',
  addresses: 'wallet/addresses',
  config: 'wallet/config',
  chains: 'wallet/chains',
  list: (id: string) => `wallet/lists/${encodeURIComponent(id)}`,
  prices: 'wallet/prices',
  ensAddress: 'wallet/ens/address',
  ensName: 'wallet/ens/name',
  lnurl: 'wallet/lnurl',
  lightningAddress: (address: string) => `wallet/lightning-address/${encodeURIComponent(address)}`,
  diagnostics: 'wallet/diagnostics',
  esplora: (blockchain: WalletBitcoinBlockchain, path: string) =>
    `wallet/esplora/${blockchain}/${path.replace(/^\/+/, '')}`,
  evmRpc: (chainId: number | string) => `wallet/evm/${encodeURIComponent(String(chainId))}/rpc`,
  bitcoinAccount: (blockchain: WalletBitcoinBlockchain) => `wallet/bitcoin/${blockchain}/account`,
  bitcoinFees: (blockchain: WalletBitcoinBlockchain) => `wallet/bitcoin/${blockchain}/fees`,
  bitcoinPrepare: (blockchain: WalletBitcoinBlockchain) => `wallet/bitcoin/${blockchain}/prepare`,
  bitcoinSubmit: (blockchain: WalletBitcoinBlockchain) => `wallet/bitcoin/${blockchain}/submit`,
};

/** Error codes wallet-api answers with (`code` of the error body). Not exhaustive; unknown codes stay strings. */
export type WalletApiErrorCode =
  | 'SessionRequired'
  | 'SessionInvalid'
  | 'ChallengeInvalid'
  | 'ChallengeRateLimited'
  | 'PrfResultsRefused'
  | 'CrossDeviceRegistration'
  | 'PasskeyCredentialAlreadyRegistered'
  | 'PasskeyCredentialNotFound'
  | 'PasskeyCredentialRevoked'
  | 'DiagnosticInvalid'
  | 'DiagnosticTooLarge'
  | 'EsploraNotConfigured'
  | 'EsploraPathInvalid'
  | 'AddressInvalid'
  | 'HistoryLimitInvalid'
  | 'OutboundRequestFailed'
  | 'FeeEstimatesUnavailable'
  | 'DestinationInvalid'
  | 'DestinationWrongNetwork'
  | 'AmountInvalid'
  | 'FeeRateChoiceInvalid'
  | 'DestinationIsOwnAddress'
  | 'InsufficientFunds'
  | 'AmountBelowDust'
  | 'FeeExceedsAmount'
  | 'TooManyInputs'
  | 'PrepareRateLimited'
  | 'SubmitPayloadInvalid'
  | 'TransactionInvalid'
  | 'TransactionNotSigned'
  | 'PrepareNotFound'
  | 'PrepareExpired'
  | 'TransactionMismatch'
  | 'BroadcastRejected';

// --- WebAuthn JSON (shapes of @simplewebauthn/server, base64url strings) -----------------------------------

export type WalletAuthenticatorTransport = 'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb';

export interface WalletCredentialDescriptorJSON {
  /** Credential id, base64url. */
  id: string;
  type: 'public-key';
  transports?: WalletAuthenticatorTransport[];
}

/** `PublicKeyCredentialCreationOptionsJSON`. */
export interface WalletCreationOptionsJSON {
  rp: { name: string; id?: string };
  /** `user.id` is base64url; wallet-api sets it to the `userHandle` of the ceremony. */
  user: { id: string; name: string; displayName: string };
  /** Base64url. */
  challenge: string;
  pubKeyCredParams: { alg: number; type: 'public-key' }[];
  timeout?: number;
  excludeCredentials?: WalletCredentialDescriptorJSON[];
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    residentKey?: 'discouraged' | 'preferred' | 'required';
    userVerification?: 'discouraged' | 'preferred' | 'required';
  };
  hints?: string[];
  attestation?: 'direct' | 'enterprise' | 'indirect' | 'none';
  attestationFormats?: string[];
  extensions?: Record<string, unknown>;
}

/** `PublicKeyCredentialRequestOptionsJSON`. */
export interface WalletRequestOptionsJSON {
  /** Base64url. */
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: WalletCredentialDescriptorJSON[];
  userVerification?: 'discouraged' | 'preferred' | 'required';
  hints?: string[];
  extensions?: Record<string, unknown>;
}

/** `RegistrationResponseJSON` or `AuthenticationResponseJSON`; PRF results must be stripped. */
export type WalletWebAuthnResponseJSON = Record<string, unknown>;

// --- Passkeys -----------------------------------------------------------------------------------------------

/** `POST /wallet/register/begin` (public). */
export interface WalletRegisterBeginResponse extends WalletCreationOptionsJSON {
  rpId: string;
  rpName: string;
  /** UUID; send it back with the finish call. */
  challengeId: string;
  /** Base64url user handle; equals `user.id`. */
  userHandle: string;
}

/** `POST /wallet/register/finish` (public). */
export interface WalletRegisterFinishRequest {
  challengeId: string;
  /** `RegistrationResponseJSON` of a platform authenticator, PRF results stripped. */
  response: WalletWebAuthnResponseJSON;
}

/** `POST /wallet/authenticate/begin` (public). Without `credentialId` the options allow any discoverable credential. */
export interface WalletAuthenticateBeginRequest {
  credentialId?: string;
}

export interface WalletAuthenticateBeginResponse extends WalletRequestOptionsJSON {
  challengeId: string;
}

/** `POST /wallet/authenticate/finish` (public). */
export interface WalletAuthenticateFinishRequest {
  challengeId: string;
  /** `AuthenticationResponseJSON`, PRF results stripped. */
  response: WalletWebAuthnResponseJSON;
}

/** Answer of register/finish and authenticate/finish: a wallet session, not a DFX customer session. */
export interface WalletSessionResponse {
  token: string;
  accountId: string;
}

/** `POST /wallet/revoke/begin` (bearer). */
export type WalletRevokeBeginResponse = WalletAuthenticateBeginResponse;

/** `POST /wallet/revoke/finish` (bearer). */
export type WalletRevokeFinishRequest = WalletAuthenticateFinishRequest;

export interface WalletRevokeFinishResponse {
  /** ISO 8601. Every session of the account issued before this instant is invalid. */
  revokedAt: string;
}

/** `GET /wallet/credentials` (bearer), newest first. */
export interface WalletCredential {
  /** Credential id, base64url. */
  id: string;
  backupEligible: boolean;
  backedUp: boolean;
  revokedAt: string | null;
  createdAt: string;
}

// --- Addresses ----------------------------------------------------------------------------------------------

/** `PUT /wallet/addresses` (bearer); refused when the chain's family is off in `GET /wallet/config`. */
export interface WalletUpsertAddressRequest {
  chain: WalletChainId;
  /** 1..512 characters. */
  address: string;
}

/**
 * A stored address (`AddressesService`). `chain` and `address` are the upserted values; further fields of the
 * service answer pass through untyped.
 */
export interface WalletAddress {
  chain: WalletChainId;
  address: string;
  [field: string]: unknown;
}

// --- Config -------------------------------------------------------------------------------------------------

/** The families the app shows: exactly those that are `true`. */
export interface WalletFamilies {
  /** Bitcoin on-chain. */
  bitcoin: boolean;
  /** Spark and Lightning. */
  spark: boolean;
  /** EVM chains. */
  evm: boolean;
}

/** `GET /wallet/config` (public). */
export interface WalletConfig {
  families: WalletFamilies;
}

// --- Diagnostics --------------------------------------------------------------------------------------------

/** `POST /wallet/diagnostics` (optional bearer): any JSON object up to 16 KiB serialized. */
export type WalletDiagnostic = Record<string, unknown>;

export interface WalletDiagnosticResponse {
  accepted: true;
}

// --- Bitcoin ------------------------------------------------------------------------------------------------

/** `POST /wallet/bitcoin/:blockchain/account` (bearer). */
export interface WalletBitcoinAccountRequest {
  /** 1..50 P2WPKH addresses of the network. */
  addresses: string[];
  /** 1..100, default 50. */
  historyLimit?: number;
}

/** Integer satoshis. */
export interface WalletBitcoinBalance {
  confirmed: number;
  unconfirmed: number;
  total: number;
}

export interface WalletBitcoinAddressSummary extends WalletBitcoinBalance {
  address: string;
  txCount: number;
  /** Drives the device's gap-limit discovery. */
  used: boolean;
}

export interface WalletBitcoinAccountUtxo {
  txid: string;
  vout: number;
  value: number;
  address: string;
  confirmed: boolean;
  height: number | null;
  confirmations: number;
}

export type WalletBitcoinDirection = 'incoming' | 'outgoing' | 'self';

export interface WalletBitcoinHistoryEntry {
  txid: string;
  confirmed: boolean;
  /** Typed nullable for unconfirmed transactions. */
  height: number | null;
  /** Unix seconds; typed nullable for unconfirmed transactions. */
  time: number | null;
  confirmations: number;
  /** Signed satoshis from the wallet's point of view. */
  netAmount: number;
  fee: number;
  direction: WalletBitcoinDirection;
}

export interface WalletBitcoinAccount {
  blockchain: WalletBitcoinBlockchain;
  tipHeight: number;
  balance: WalletBitcoinBalance;
  addresses: WalletBitcoinAddressSummary[];
  utxos: WalletBitcoinAccountUtxo[];
  /** First Esplora page per address, merged and cut at `historyLimit`; not paginated. */
  history: WalletBitcoinHistoryEntry[];
  historyLimit: number;
  /** `false` when older transactions exist. */
  historyComplete: boolean;
}

/** `GET /wallet/bitcoin/:blockchain/fees` (bearer). Whole sat/vB for 1, 6 and 144 blocks. */
export interface WalletBitcoinFees {
  blockchain: WalletBitcoinBlockchain;
  source: 'esplora' | 'fallback';
  unit: 'sat/vB';
  rates: { fast: number; normal: number; slow: number };
}

export type WalletBitcoinFeeRateChoice = 'fast' | 'normal' | 'slow';

interface WalletBitcoinPrepareBase {
  /** 1..50 own P2WPKH addresses whose UTXOs may be spent. */
  addresses: string[];
  changeAddress: string;
  destination: string;
  /** Integer satoshis as a decimal string, or `max` (everything spendable, no change). */
  amount: string;
  /** Default `true`. */
  rbf?: boolean;
  /** Default `false`. */
  includeUnconfirmed?: boolean;
  /** Default `false`. */
  allowOwnDestination?: boolean;
}

/** `POST /wallet/bitcoin/:blockchain/prepare` (bearer): `feeRate` XOR `feeRateSatPerVb`. */
export type WalletBitcoinPrepareRequest = WalletBitcoinPrepareBase &
  ({ feeRate?: WalletBitcoinFeeRateChoice; feeRateSatPerVb?: never } | { feeRateSatPerVb: number; feeRate?: never });

export interface WalletBitcoinPrepareInput {
  txid: string;
  vout: number;
  value: number;
  /** The device signs input `i` with the key of `inputs[i].address`. */
  address: string;
}

export interface WalletBitcoinPrepareOutput {
  address: string;
  value: number;
  kind: 'destination' | 'change';
}

export interface WalletBitcoinPrepare {
  /** UUID; valid for 10 minutes. */
  prepareId: string;
  expiresAt: string;
  blockchain: WalletBitcoinBlockchain;
  /** Unsigned PSBT v0, base64; every input has `witnessUtxo`, no BIP-32 paths. */
  psbt: string;
  /** Submit only accepts a transaction with exactly this txid. */
  txid: string;
  destination: string;
  amount: number;
  fee: number;
  feeRate: number;
  change: number;
  changeAddress: string | null;
  /** Remainder below 294 sat that went into the fee. */
  changeAddedToFee: number;
  vsize: number;
  rbf: boolean;
  totalInput: number;
  uneconomicalUtxos: number;
  inputs: WalletBitcoinPrepareInput[];
  outputs: WalletBitcoinPrepareOutput[];
}

/** `POST /wallet/bitcoin/:blockchain/submit` (bearer): exactly one of `transactionHex` or `psbt` (signed). */
export type WalletBitcoinSubmitRequest = { prepareId: string } & (
  | { transactionHex: string; psbt?: never }
  | { psbt: string; transactionHex?: never }
);

export interface WalletBitcoinSubmitResponse {
  txid: string;
  prepareId: string;
  /** `true` for a repeat of an already submitted transaction (no second broadcast). */
  alreadySubmitted: boolean;
}

// --- Proxies ------------------------------------------------------------------------------------------------

/** JSON-RPC request or batch item for `POST /wallet/evm/:chainId/rpc`. */
export interface WalletEvmRpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: unknown[];
}
