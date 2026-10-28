/**
 * Deployment environment of the DFX app that hosts the wallet. It is compiled into the app build and never
 * taken from the server, the URL or user input: the RP ID and the login message prefix follow from it.
 */
export type WalletEnv = 'prd' | 'dev' | 'loc';

export const WALLET_ENVS: readonly WalletEnv[] = Object.freeze(['prd', 'dev', 'loc'] as const);

export function isWalletEnv(value: unknown): value is WalletEnv {
  return typeof value === 'string' && (WALLET_ENVS as readonly string[]).includes(value);
}

/**
 * WebAuthn relying-party ID per environment. The RP ID is the app host, never the apex `dfx.swiss`, and DEV
 * has its own host outside the production RP scope. A passkey is bound to its RP ID forever, so these values
 * must never change for an existing environment.
 */
export const RP_IDS: Readonly<Record<WalletEnv, string>> = Object.freeze({
  prd: 'app.dfx.swiss',
  dev: 'dev-app.dfx.swiss',
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
  loc: '[loc]_',
});

export type BitcoinNetwork = 'mainnet' | 'testnet4';

/** Spark runs on mainnet in every DFX environment. */
export type SparkNetwork = 'mainnet';

export type EvmNetworkKind = 'mainnet' | 'testnet';

export interface WalletNetworks {
  /** Bitcoin network of the BIP-84 account (mainnet coin type 0', testnet4 coin type 1'). */
  bitcoin: BitcoinNetwork;
  /** Spark network of the Breez SDK. */
  spark: SparkNetwork;
  /** Kind of EVM chains the wallet supports in this environment. */
  evm: EvmNetworkKind;
}

/**
 * Networks per environment, matching the chain list rule of the DFX API: PRD uses Bitcoin mainnet and EVM
 * mainnets only; DEV and LOC use Bitcoin testnet4 and EVM test chains only; Spark is mainnet everywhere.
 */
export const WALLET_NETWORKS: Readonly<Record<WalletEnv, Readonly<WalletNetworks>>> = Object.freeze({
  prd: Object.freeze({ bitcoin: 'mainnet', spark: 'mainnet', evm: 'mainnet' }),
  dev: Object.freeze({ bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' }),
  loc: Object.freeze({ bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' }),
});
