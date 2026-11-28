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

The example below is the deprecated direct route (`EsploraClient` / `walletData`, local PSBT build). New code sends
through `BitcoinSend` on wallet-api, see [Passkey wallet on wallet-api](#passkey-wallet-on-wallet-api).

```typescript
import { DfxApiClient } from '@dfx.swiss/core';
import { EsploraClient, buildBitcoinSendPsbt, signBitcoinMessageBip322, signBitcoinPsbt } from '@dfx.swiss/wallet';

const regtest = keys.forBitcoinNetwork('regtest', { env }); // throws 'network-not-allowed' on PRD
// Deprecated route. STG: the backend forward walletData/esplora/BitcoinRegtest (deprecated, being removed);
// DEV/LOC: a configured Esplora endpoint.
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

This applies only to the deprecated `EsploraClient` / `walletData` route: on STG it reads regtest balance and
history and broadcasts through the backend Esplora forward (`walletData/esplora/BitcoinRegtest`, deprecated), on
DEV/LOC through a user-configured endpoint that `EsploraClient` calls directly from the browser (HTTPS with CORS;
plain HTTP only on `localhost`). `BitcoinSend` does not use that route: account (balance, UTXOs, history), fees,
prepare and submit (broadcast) go through wallet-api (`/v1/wallet/bitcoin/:blockchain/*`) in every environment —
`Bitcoin` on PRD, `BitcoinRegtest` on DEV, STG and LOC. PRD has no regtest at all.

## Passkey wallet on wallet-api

`WalletApiAuth` runs register, login, unlock and revoke against wallet-api (`/v1/wallet/*` on the DFX API host).
The WebAuthn options come from the server; the credential goes back with PRF results stripped; the seed is derived
from the PRF output on the device. Only the families `GET /v1/wallet/config` turns on are registered (Bitcoin only
at launch: no EVM or Spark address or proof is sent). On login, every stored address wallet-api holds is checked
against the seed, whether or not its family is on: a stored address of another seed is a seed mismatch and
nothing is registered, so an account never holds the addresses of two seeds. Outside PRD the Bitcoin network is regtest
(`walletApiBitcoinNetwork`), on PRD mainnet. The wallet-api token is a wallet session, not a DFX customer session.

`BitcoinSend` sends Bitcoin on-chain: `prepare` on the server, verify the PSBT against the request and the reported
inputs, outputs and fee (`verifyBitcoinPrepare`), show `prepared.summary`, sign input `i` with the key of
`inputs[i].address` (`signBitcoinPsbt`), then `submit`. The signed txid must equal the prepared txid.

The device also bounds the fee: it estimates the vsize from the PSBT (P2WPKH inputs, outputs from their scripts)
and refuses when the fee exceeds `ceil(rate × vsize) + changeAddedToFee` (a dropped change below 294 sat). `rate`
is `feeRateSatPerVb` (the reported `feeRate` must equal it) or, for `fast`/`normal`/`slow` (default `normal`), the
`fees()` rate of that choice. The reported `feeRate`, `vsize` and `changeAddedToFee` must fit the PSBT. `maxFee`
adds an absolute cap. `send()` requires a `confirm` callback; show the fee there.

A failed `send()` must not be repeated: a new prepare spends other UTXOs and can pay twice. `submit` retries the
same `prepareId` on network errors, 408, 429 and 5xx (bounded, with backoff, until the prepare expires); wallet-api
answers a repeat with `alreadySubmitted: true`. When the outcome stays unknown, or the server answers with another
txid, it throws `BitcoinSubmitError` with code `submit-unknown`, carrying `prepared` and `signed`. Call
`send.submit(error.prepared, error.signed)` again on the same `BitcoinSend`, or look for `error.signed.txid` on
chain. `submit-refused` (a 4xx, nothing broadcast) is only reported while no attempt for that `prepareId` had an
unknown outcome; the `BitcoinSend` remembers lost answers per `prepareId`, so a 4xx on a resume (e.g. 410
`PrepareExpired`) stays `submit-unknown`. When resuming from a new instance, pass
`send.submit(prepared, signed, { outcomeUnknown: true })`.

```typescript
import { DfxApiClient } from '@dfx.swiss/core';
import { BitcoinSend, BitcoinSubmitError, PasskeyCeremonies, WalletApiAuth } from '@dfx.swiss/wallet';

const api = new DfxApiClient({ apiUrl: 'https://stg.api.dfx.swiss/v1' });
const auth = new WalletApiAuth({ api: api.wallet, ceremonies: new PasskeyCeremonies('stg'), env: 'stg' });
const { token, keys, state } = await auth.login(); // or auth.register()
if (state !== 'unlocked' || !keys) throw new Error(state);

const send = new BitcoinSend({ api: api.wallet, keys, token }); // BitcoinRegtest on STG
const own = [keys.bitcoinAddress(0, 0).address];
try {
  const { txid } = await send.send(
    { addresses: own, changeAddress: keys.bitcoinAddress(1, 0).address, destination, amount: 10_000, feeRate: 'normal' },
    (prepared) => confirmOnScreen(prepared.summary), // shows destination, amount and summary.fee
  );
} catch (error) {
  // Signed already: keep error.prepared / error.signed and resubmit later, never call send() again.
  if (error instanceof BitcoinSubmitError) await send.submit(error.prepared, error.signed);
  else throw error;
}
```

`PasskeyAuth`, `DfxApiClient.passkey` and `DfxApiClient.walletData` still work against the backend routes, which are
being removed; they are deprecated.

## Local storage

Local wallet data (never secrets) is kept in IndexedDB (`dfx-wallet`) through the `KeyValueStore` interface;
`MemoryKeyValueStore` serves tests and platforms without IndexedDB.
