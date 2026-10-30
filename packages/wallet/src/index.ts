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
