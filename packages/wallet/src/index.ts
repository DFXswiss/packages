// Public API. The Breez and WalletConnect SDKs are never imported here at runtime; they load on demand.

// Environment
export { WALLET_ENVS, isWalletEnv, RP_IDS, SIGN_MESSAGE_PREFIX, WALLET_NETWORKS } from './config/environment';
export type { WalletEnv, BitcoinNetwork, SparkNetwork, EvmNetworkKind, WalletNetworks } from './config/environment';

// Errors
export { WalletError, isWalletError } from './util/errors';

// Storage
export {
  WALLET_DB_NAME,
  MemoryKeyValueStore,
  IndexedDbKeyValueStore,
  createDefaultKeyValueStore,
} from './util/kv-store';
export type { KeyValueStore, IndexedDbKeyValueStoreOptions } from './util/kv-store';

// Derivation v1 (§7.1, §7.2)
export { DERIVATION_V1, PRF_OUTPUT_BYTES, prfInputV1, mnemonicFromPrfV1, normalizeMnemonicV1 } from './derivation/v1';
export { KeyRing } from './derivation/keyring';
export type { KeyRingOptions, BitcoinAccountInfo, BitcoinAddressInfo, SparkIdentityInfo } from './derivation/keyring';
export { seedPublicData } from './derivation/public-data';
export type { SeedPublicData } from './derivation/public-data';
export { encodeSparkAddress, decodeSparkAddress } from './derivation/spark-keys';
export { seedCheck } from './derivation/seed-check';
export type { EvmAddress } from './derivation/evm-keys';

// Signing (§8.5, §9.3, D31)
export { LOGIN_TEMPLATES, buildLoginMessage } from './signing/login-messages';
export type { LoginTemplate } from './signing/login-messages';
export { LoginAutoSigner, LoginMessageMismatchError, eip191MessageHash } from './signing/auto-signer';
export { SPARK_LOGIN_TAG, sparkLoginDigestV1, verifySparkLogin } from './signing/spark-login';
export { bitcoinMessageMagicHash, verifyBitcoinMessage } from './signing/bitcoin-message';
export { isDfxLoginText } from './signing/login-text-guard';

// Passkey (§6, §8.3, §8.4, §11.4)
export {
  checkPasskeyPlatform,
  isInAppBrowser,
  openInSystemBrowser,
  iosInstalledVersion,
  androidInstalledVersion,
} from './passkey/platform';
export type { PlatformReport, PlatformHost } from './passkey/platform';
export { PasskeyCeremonies } from './passkey/ceremonies';
export type {
  CeremonyCredentials,
  CeremonyWindow,
  PendingSeedPasskey,
  CreatedSeedPasskey,
  SeedAssertion,
} from './passkey/ceremonies';
export {
  PasskeyError,
  EmbeddedContextError,
  WrongOriginError,
  PlatformUnsupportedError,
  InAppBrowserError,
  CrossDeviceRegistrationError,
  PrfMismatchError,
  PrfUnavailableError,
  CeremonySupersededError,
  CeremonyCancelledError,
  UserActivationMissingError,
  classifyWebAuthnError,
} from './passkey/errors';
export type { WebAuthnErrorKind } from './passkey/errors';
export { CredentialCache } from './passkey/credential-cache';
export type { CachedPasskeyCredential, CredentialStorage } from './passkey/credential-cache';
export { passkeyDiagnostic } from './passkey/diagnostics';
export type { PasskeyDiagnostic, PasskeyDiagnosticInput } from './passkey/diagnostics';
export { credentialToJSON } from './passkey/webauthn-json';
export type { WebAuthnJson } from './passkey/webauthn-json';

// Providers (D8, D23, D32, §9.2)
export { ChainRegistry } from './providers/chain-registry';
export { DfxData, ProviderUnavailableError } from './providers/dfx-data';
export type { DfxDataOptions } from './providers/dfx-data';
export { PricePolicy, PRICE_STALE_MS } from './providers/price';
export { Blocklists } from './providers/blocklist';
export type { WalletSnapshot, SnapshotAsset, SnapshotBlocklists } from './providers/snapshot';

// Session and flows (§8, D5, X24)
export { PasskeyAuth, PasskeyRefusedError } from './session/passkey-auth';
export type { WalletState, AuthResult, PasskeyRefusal, RegisterExtras } from './session/passkey-auth';
export { IdleLock } from './session/idle-lock';
export type { IdleDelay, IdleLockOptions } from './session/idle-lock';
export { TabLock } from './session/tab-lock';
export type { LockManagerLike } from './session/tab-lock';
