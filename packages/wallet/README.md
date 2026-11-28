# @dfx.swiss/wallet

Self-custodial wallet core of the [DFX.swiss](https://dfx.swiss) app: a 12-word seed derived from a passkey (WebAuthn PRF),
Bitcoin, EVM and Spark accounts on that seed, and the flows that connect the wallet to the DFX API. Keys stay on the
device; the DFX API never receives them and cannot sign.

> **Status:** under construction. The public API is not stable yet and changes without notice until `1.0.0`.

## Installation

```bash
npm install @dfx.swiss/wallet
```

The package ships ES2020 ES modules for browsers and needs no Node polyfills. It does not depend on the Breez SDK or
WalletConnect.

## Environments

The app build selects the environment (`'prd'`, `'dev'`, `'stg'` or `'loc'`). The WebAuthn RP ID, the DFX login message prefix
and the networks follow from it and are compiled-in constants:

| Environment | RP ID               | Login message prefix | Bitcoin  | EVM chains | Spark   |
| ----------- | ------------------- | -------------------- | -------- | ---------- | ------- |
| `prd`       | `app.dfx.swiss`     | none                 | mainnet  | mainnets   | mainnet |
| `dev`       | `dev.app.dfx.swiss` | `[dev]_`             | testnet4 | testnets   | mainnet |
| `stg`       | `stg.app.dfx.swiss` | `[stg]_`             | testnet4 | testnets   | mainnet |
| `loc`       | `localhost`         | `[loc]_`             | testnet4 | testnets   | mainnet |

The Bitcoin column is the receive and change network. Linking a Bitcoin address, and the Bitcoin login
address, stay on mainnet BIP-84 receive index 0 in every environment. The API verifies only a mainnet address,
so a testnet receive address cannot be linked.

```typescript
import { RP_IDS, SIGN_MESSAGE_PREFIX, WALLET_NETWORKS } from '@dfx.swiss/wallet';

RP_IDS.prd; // 'app.dfx.swiss'
SIGN_MESSAGE_PREFIX.dev; // '[dev]_'
WALLET_NETWORKS.dev.bitcoin; // 'testnet4'
```

## Bitcoin regtest (test builds only)

A non-production build can use a local Bitcoin regtest chain next to its testnet4 account: HRP `bcrt`, coin type
`1'`, BIP-84 paths `m/84'/1'/0'/0/i` and `m/84'/1'/0'/1/i` (the derivation v1 labels are unchanged). Test networks
are allowed on DEV and STG, never in a production build, so regtest is gated per environment: PRD is always
refused; DEV, STG and LOC are enabled by default, and an app build may narrow that list with `regtestEnvs`.

```typescript
import { DfxApiClient } from '@dfx.swiss/core';
import { EsploraClient, buildBitcoinSendPsbt, signBitcoinMessageBip322, signBitcoinPsbt } from '@dfx.swiss/wallet';

const regtest = keys.forBitcoinNetwork('regtest', { env }); // throws 'network-not-allowed' on PRD
// STG: the DFX API forward walletData/esplora/BitcoinRegtest; DEV/LOC: a configured Esplora endpoint.
const esplora =
  env === 'stg'
    ? new DfxApiClient({ apiUrl }).walletData.bitcoinRegtest
    : new EsploraClient(configuredRegtestEsploraUrl, { network: 'regtest', env });

const address = regtest.bitcoinAddress(0, 0).address; // bcrt1q…
const proof = signBitcoinMessageBip322(regtest, address, 'confirmed by the user'); // BIP-322 simple
const utxos = (await esplora.utxos(address)).map((utxo) => ({ ...utxo, address }));
const { psbt } = buildBitcoinSendPsbt(regtest, { to, amount: 10_000, feeRate: 1, utxos, changeIndex: 0 });
const { hex } = signBitcoinPsbt(regtest, psbt); // after the user confirmed describeBitcoinPsbt(regtest, psbt)
await esplora.broadcast(hex);
regtest.wipe();
```

On STG the regtest balance, history and broadcast go through the DFX API Esplora forward
(`walletData/esplora/BitcoinRegtest`), a named R1 exception for STG only. Everywhere else the wallet uses third-party
or user-configured endpoints; `EsploraClient` calls such an endpoint directly from the browser (HTTPS with CORS;
plain HTTP only on `localhost`). PRD has no regtest at all.

## Passkey wallet on wallet-api

`WalletApiAuth` runs register, login, unlock and revoke against wallet-api (`/v1/wallet/*` on the DFX API host).
The WebAuthn options come from the server; the credential goes back with PRF results stripped; the seed is derived
from the PRF output on the device. Only the families `GET /v1/wallet/config` turns on are derived and registered
(Bitcoin only at launch: no EVM or Spark address or proof). Outside PRD the Bitcoin network is regtest
(`walletApiBitcoinNetwork`), on PRD mainnet. The wallet-api token is a wallet session, not a DFX customer session.

`BitcoinSend` sends Bitcoin on-chain: `prepare` on the server, verify the PSBT against the request and the reported
inputs, outputs and fee (`verifyBitcoinPrepare`), show `prepared.summary`, sign input `i` with the key of
`inputs[i].address` (`signBitcoinPsbt`), then `submit`. The signed txid must equal the prepared txid.

```typescript
import { DfxApiClient } from '@dfx.swiss/core';
import { BitcoinSend, PasskeyCeremonies, WalletApiAuth } from '@dfx.swiss/wallet';

const api = new DfxApiClient({ apiUrl: 'https://stg.api.dfx.swiss/v1' });
const auth = new WalletApiAuth({ api: api.wallet, ceremonies: new PasskeyCeremonies('stg'), env: 'stg' });
const { token, keys, state } = await auth.login(); // or auth.register()
if (state !== 'unlocked' || !keys) throw new Error(state);

const send = new BitcoinSend({ api: api.wallet, keys, token }); // BitcoinRegtest on STG
const own = [keys.bitcoinAddress(0, 0).address];
const { txid } = await send.send(
  { addresses: own, changeAddress: keys.bitcoinAddress(1, 0).address, destination, amount: 10_000, feeRate: 'normal' },
  (prepared) => confirmOnScreen(prepared.summary),
);
```

`PasskeyAuth`, `DfxApiClient.passkey` and `DfxApiClient.walletData` still work against the backend routes, which are
being removed; they are deprecated.

## Local storage

Local wallet data (never secrets) is kept in IndexedDB (`dfx-wallet`) through the `KeyValueStore` interface;
`MemoryKeyValueStore` serves tests and platforms without IndexedDB.
