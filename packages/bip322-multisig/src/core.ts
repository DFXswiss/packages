/**
 * Low-level BIP-322 primitives.
 *
 * This module has NO ecc side-effects and NO descriptor/bip32 dependencies.
 * It can be imported safely in environments with their own ecc setup (e.g. React Native).
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki
 */
import * as bitcoin from 'bitcoinjs-lib';
import { bech32 } from 'bech32';

// ---------------------------------------------------------------------------
// BIP-322 Tagged Message Hash
// ---------------------------------------------------------------------------

const TAG = Buffer.from('BIP0322-signed-message', 'utf8');

export function bip322MessageHash(message: string): Buffer {
  const tagHash = bitcoin.crypto.sha256(TAG);
  return bitcoin.crypto.sha256(Buffer.concat([tagHash, tagHash, Buffer.from(message, 'utf8')]));
}

// ---------------------------------------------------------------------------
// BIP-322 to_spend Transaction (synthetic)
// ---------------------------------------------------------------------------

export function buildToSpendTx(messageHash: Buffer, scriptPubKey: Buffer): bitcoin.Transaction {
  const tx = new bitcoin.Transaction();
  tx.version = 0;
  tx.locktime = 0;
  const scriptSig = Buffer.concat([Buffer.from([0x00, 0x20]), messageHash]);
  tx.addInput(Buffer.alloc(32), 0xffffffff, 0, scriptSig);
  tx.addOutput(scriptPubKey, 0);
  return tx;
}

// ---------------------------------------------------------------------------
// BIP-322 to_sign PSBT (low-level)
// ---------------------------------------------------------------------------

export interface Bip32Derivation {
  masterFingerprint: Buffer;
  path: string;
  pubkey: Buffer;
}

export interface BuildToSignPsbtArgs {
  message: string;
  scriptPubKey: Buffer;
  witnessScript: Buffer;
  bip32Derivation: Bip32Derivation[];
}

export interface BuildToSignPsbtResult {
  psbt: bitcoin.Psbt;
  psbtBase64: string;
  toSpendTxid: string;
}

export function buildToSignPsbt(args: BuildToSignPsbtArgs): BuildToSignPsbtResult {
  const messageHash = bip322MessageHash(args.message);
  const toSpend = buildToSpendTx(messageHash, args.scriptPubKey);
  const toSpendTxid = toSpend.getId();

  const psbt = new bitcoin.Psbt();
  psbt.setVersion(0);
  psbt.setLocktime(0);

  psbt.addInput({
    hash: toSpendTxid,
    index: 0,
    sequence: 0,
    witnessUtxo: { script: args.scriptPubKey, value: 0 },
    witnessScript: args.witnessScript,
    sighashType: bitcoin.Transaction.SIGHASH_ALL,
    bip32Derivation: args.bip32Derivation,
    nonWitnessUtxo: toSpend.toBuffer(),
  });

  psbt.addOutput({ value: 0, script: Buffer.from([0x6a]) });

  return { psbt, psbtBase64: psbt.toBase64(), toSpendTxid };
}

// ---------------------------------------------------------------------------
// BIP-322 Signature Extraction
// ---------------------------------------------------------------------------

export function extractBip322Signature(signedPsbtBase64: string): string {
  const psbt = bitcoin.Psbt.fromBase64(signedPsbtBase64);
  const input = psbt.data.inputs[0];
  if (!input) throw new Error('PSBT has no inputs');

  if (input.finalScriptWitness) {
    return input.finalScriptWitness.toString('base64');
  }

  throw new Error('PSBT input is not finalized — ensure all required signatures are present and the PSBT is finalized');
}

// ---------------------------------------------------------------------------
// P2WSH Helpers
// ---------------------------------------------------------------------------

export function buildSortedMultisigScript(pubkeys: Buffer[], threshold: number): Buffer {
  if (threshold < 1 || threshold > 16) throw new Error(`threshold out of range: ${threshold}`);
  if (pubkeys.length < 1 || pubkeys.length > 16) throw new Error(`pubkey count out of range: ${pubkeys.length}`);
  if (threshold > pubkeys.length) {
    throw new Error(`threshold ${threshold} exceeds pubkey count ${pubkeys.length} (would be unspendable)`);
  }
  for (const pk of pubkeys) {
    if (pk.length !== 33) throw new Error(`pubkey must be 33 bytes (compressed), got ${pk.length}`);
    if (pk[0] !== 0x02 && pk[0] !== 0x03)
      throw new Error(`pubkey must start with 0x02 or 0x03, got 0x${pk[0].toString(16)}`);
  }
  const sorted = [...pubkeys].sort(Buffer.compare);
  const parts: Buffer[] = [Buffer.from([0x50 + threshold])];
  for (const pk of sorted) parts.push(Buffer.from([0x21]), pk);
  parts.push(Buffer.from([0x50 + sorted.length, 0xae]));
  return Buffer.concat(parts);
}

export function p2wshScriptPubKey(witnessScript: Buffer): Buffer {
  const program = bitcoin.crypto.sha256(witnessScript);
  return Buffer.concat([Buffer.from([0x00, 0x20]), program]);
}

export function p2wshAddress(witnessScript: Buffer): string {
  const h = bitcoin.crypto.sha256(witnessScript);
  const words = [0, ...bech32.toWords(h)];
  return bech32.encode('bc', words);
}
