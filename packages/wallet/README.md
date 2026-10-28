# @dfx.swiss/wallet

Self-custodial wallet core of the [DFX.swiss](https://dfx.swiss) app: a 12-word seed derived from a passkey (WebAuthn PRF),
Bitcoin, EVM and Spark accounts on that seed, and the flows that connect the wallet to the DFX API. Keys stay on the
device; the DFX API never receives them and cannot sign.

> **Status:** under construction. The public API is not stable yet and changes without notice until `1.0.0`.

## Installation

```bash
npm install @dfx.swiss/wallet
```

The package ships ES2020 ES modules for browsers and needs no Node polyfills. The Breez SDK (Spark) and WalletConnect
are loaded on demand through dynamic `import()`, so they end up in separate bundler chunks.

## Environments

The app build selects the environment (`'prd'`, `'dev'` or `'loc'`). The WebAuthn RP ID, the DFX login message prefix
and the networks follow from it and are compiled-in constants:

| Environment | RP ID               | Login message prefix | Bitcoin  | EVM chains | Spark   |
| ----------- | ------------------- | -------------------- | -------- | ---------- | ------- |
| `prd`       | `app.dfx.swiss`     | none                 | mainnet  | mainnets   | mainnet |
| `dev`       | `dev-app.dfx.swiss` | `[dev]_`             | testnet4 | testnets   | mainnet |
| `loc`       | `localhost`         | `[loc]_`             | testnet4 | testnets   | mainnet |

```typescript
import { RP_IDS, SIGN_MESSAGE_PREFIX, WALLET_NETWORKS } from '@dfx.swiss/wallet';

RP_IDS.prd; // 'app.dfx.swiss'
SIGN_MESSAGE_PREFIX.dev; // '[dev]_'
WALLET_NETWORKS.dev.bitcoin; // 'testnet4'
```

## Local storage

Local wallet data (never secrets) is kept in IndexedDB (`dfx-wallet`) through the `KeyValueStore` interface;
`MemoryKeyValueStore` serves tests and platforms without IndexedDB.
