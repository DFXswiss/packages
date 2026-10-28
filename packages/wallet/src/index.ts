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
