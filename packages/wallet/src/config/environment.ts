/**
 * Deployment environment of the DFX app that hosts the wallet. It is compiled into the app build and never
 * taken from the server, the URL or user input: the RP ID and the login message prefix follow from it.
 */
export type WalletEnv = 'prd' | 'dev' | 'stg' | 'loc';

export const WALLET_ENVS: readonly WalletEnv[] = Object.freeze(['prd', 'dev', 'stg', 'loc'] as const);

export function isWalletEnv(value: unknown): value is WalletEnv {
  return typeof value === 'string' && (WALLET_ENVS as readonly string[]).includes(value);
}

/**
 * WebAuthn relying-party ID per environment. The RP ID is the app host, never the apex `dfx.swiss`. DEV and
 * STG are the existing Pages hosts under `app.dfx.swiss`: WebAuthn RP scope only grows downward, so a
 * passkey of `dev.app.dfx.swiss` or `stg.app.dfx.swiss` can never satisfy a PRD ceremony, which pins
 * `app.dfx.swiss`, and every ceremony always passes its own environment's RP ID. A passkey is bound to its
 * RP ID forever, so these values must never change for an existing environment.
 */
export const RP_IDS: Readonly<Record<WalletEnv, string>> = Object.freeze({
  prd: 'app.dfx.swiss',
  dev: 'dev.app.dfx.swiss',
  stg: 'stg.app.dfx.swiss',
  loc: 'localhost',
});

/**
 * Prefix of the DFX login message per environment, identical to the DFX API, which computes
 * `this.environment === Environment.PRD ? '' : `[${this.environment}]_`` (DFX API source
 * `src/config/config.ts:410`, environment values `src/config/config.ts:37-41`) and puts it in front of both
 * login templates (`auth.signMessage` and `auth.signMessageGeneral`, `src/config/config.ts:440-445`).
 */
export const SIGN_MESSAGE_PREFIX: Readonly<Record<WalletEnv, string>> = Object.freeze({
  prd: '',
  dev: '[dev]_',
  stg: '[stg]_',
  loc: '[loc]_',
});

/**
 * Bitcoin network of a key ring. `regtest` is a local test chain (HRP `bcrt`, coin type 1'); no environment
 * selects it in {@link WALLET_NETWORKS}. A regtest ring exists only in an environment that
 * {@link isRegtestAllowed} admits, never in a PRD build.
 */
export type BitcoinNetwork = 'mainnet' | 'testnet4' | 'regtest';

export const BITCOIN_NETWORKS: readonly BitcoinNetwork[] = Object.freeze(['mainnet', 'testnet4', 'regtest'] as const);

export function isBitcoinNetwork(value: unknown): value is BitcoinNetwork {
  return typeof value === 'string' && (BITCOIN_NETWORKS as readonly string[]).includes(value);
}

/**
 * Environments in which a regtest ring may be derived unless the app build passes its own list. Test networks
 * are allowed on DEV and STG (and on local LOC builds), never in a production build (D28).
 */
export const DEFAULT_REGTEST_ENVS: readonly WalletEnv[] = Object.freeze(['dev', 'stg', 'loc'] as const);

/**
 * Whether `env` may use Bitcoin regtest. PRD is refused whatever `enabledEnvs` says, so a production build
 * can never derive or sign for a regtest ring; every other environment must be listed in `enabledEnvs`.
 */
export function isRegtestAllowed(env: unknown, enabledEnvs: readonly WalletEnv[] = DEFAULT_REGTEST_ENVS): boolean {
  return isWalletEnv(env) && env !== 'prd' && Array.isArray(enabledEnvs) && enabledEnvs.includes(env);
}

/** Spark runs on mainnet in every DFX environment. */
export type SparkNetwork = 'mainnet';

export type EvmNetworkKind = 'mainnet' | 'testnet';

export interface WalletNetworks {
  /** Bitcoin network of the BIP-84 account (mainnet coin type 0', testnet4 and regtest coin type 1'). */
  bitcoin: BitcoinNetwork;
  /** Spark network of the Breez SDK. */
  spark: SparkNetwork;
  /** Kind of EVM chains the wallet supports in this environment. */
  evm: EvmNetworkKind;
}

/**
 * Networks per environment, matching the chain list rule of the DFX API: PRD uses Bitcoin mainnet and EVM
 * mainnets only; DEV, STG and LOC use Bitcoin testnet4 and EVM test chains only; Spark is mainnet everywhere.
 * These Bitcoin networks are the receive and change accounts. The Bitcoin login and link address is mainnet
 * BIP-84 receive index 0 in every environment, because the API can verify only a mainnet address.
 */
export const WALLET_NETWORKS: Readonly<Record<WalletEnv, Readonly<WalletNetworks>>> = Object.freeze({
  prd: Object.freeze({ bitcoin: 'mainnet', spark: 'mainnet', evm: 'mainnet' }),
  dev: Object.freeze({ bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' }),
  stg: Object.freeze({ bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' }),
  loc: Object.freeze({ bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' }),
});
