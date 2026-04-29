# @dfx.swiss/bip322-multisig

Build and verify BIP-322 *simple* signatures for Bitcoin **P2WSH multisig** wallets via PSBT. Provides both a JavaScript / TypeScript library (Node + browser) and CLI binaries.

## Installation

```bash
npm install @dfx.swiss/bip322-multisig
```

Requires Node.js ≥ 18 (uses native `fetch` in the CLI).

## CLI

After global install, two commands are available:

```bash
npm install -g @dfx.swiss/bip322-multisig

bip322-sign \
  --descriptor 'wsh(sortedmulti(2,[fp1/48h/0h/0h/2h]xpub.../<0;1>/*,...))' \
  --address bc1q...

# Sign the resulting PSBT in Sparrow with the threshold number of cosigners,
# save it as signed.psbt, then:

bip322-finalize --psbt signed.psbt --address bc1q...
```

Both commands accept `--api <baseUrl>` (default `https://api.dfx.swiss`) and `bip322-finalize` accepts `--no-submit` to print the signature without contacting the API.

## Library

```typescript
import {
  parseDescriptor,
  findAddress,
  buildBip322Psbt,
  extractBip322Signature,
} from '@dfx.swiss/bip322-multisig';

// Build a BIP-322 to_sign PSBT for a given P2WSH multisig address
const built = buildBip322Psbt({
  message: 'challenge string from server',
  descriptor: 'wsh(sortedmulti(2,[fp1/48h/0h/0h/2h]xpub.../<0;1>/*,...))',
  address: 'bc1q...',
});
// → built.psbtBase64, built.toSpendTxid, built.derived

// After the PSBT has been signed (e.g. by Sparrow + hardware wallets):
const signatureBase64 = extractBip322Signature(signedPsbtBase64);
```

## Scope

| Supported | Not supported |
|-----------|---------------|
| `wsh(sortedmulti(t, …))` descriptors with key origin info | Non-multisig descriptors |
| Both `h` and `'` hardened path notations | Miniscript / Taproot policies |
| Whitespace and newlines in descriptor input | Testnet / signet (`tpub`) |
| BIP-389 multipath `<0;1>/*` (receive + change branches) | Multipath with > 2 branches |
| Standard `OP_M … OP_N OP_CHECKMULTISIG` witness scripts | Non-standard witness scripts |

## How it works

[BIP-322](https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki) defines a generic message-signing scheme by constructing two virtual transactions: `to_spend` commits the message to the address, and `to_sign` spends `to_spend`. The simple-format signature is just the witness stack of `to_sign`'s input, base64-encoded.

This package builds `to_sign` as a regular PSBT with all the BIP32 derivation paths, witness UTXO, witness script, and sighash type that hardware wallets need to sign. Sparrow (or any other coordinator) handles the multisig orchestration via its standard PSBT-signing flow; this package extracts the resulting witness as a BIP-322 simple signature.

## License

MIT
