/**
 * BIP-322 P2WSH signature verification.
 *
 * Verifies BIP-322 "simple" signatures produced by P2WSH multisig wallets.
 */
import { Transaction, crypto as btcCrypto } from 'bitcoinjs-lib';
import { bech32 } from 'bech32';
import { secp256k1 } from '@noble/curves/secp256k1';

import { bip322MessageHash, buildToSpendTx, p2wshScriptPubKey } from './core';

// ---------------------------------------------------------------------------
// Address validation
// ---------------------------------------------------------------------------

/**
 * Returns true when `address` is a mainnet P2WSH bech32 address
 * (bc1q..., 62 characters, witness version 0, 32-byte program).
 */
export function isP2wshAddress(address: string): boolean {
  if (typeof address !== 'string') return false;
  try {
    const decoded = bech32.decode(address);
    if (decoded.prefix !== 'bc') return false;
    const words = decoded.words;
    if (words.length === 0) return false;
    if (words[0] !== 0) return false;
    const program = Buffer.from(bech32.fromWords(words.slice(1)));
    return program.length === 32;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Witness stack decoding
// ---------------------------------------------------------------------------

function decodeWitnessStack(buf: Buffer): Buffer[] {
  let offset = 0;

  function readVarint(): number {
    const first = buf[offset++];
    if (first < 0xfd) return first;
    if (first === 0xfd) {
      const v = buf.readUInt16LE(offset);
      offset += 2;
      return v;
    }
    if (first === 0xfe) {
      const v = buf.readUInt32LE(offset);
      offset += 4;
      return v;
    }
    const lo = buf.readUInt32LE(offset);
    offset += 4;
    const hi = buf.readUInt32LE(offset);
    offset += 4;
    return hi * 0x100000000 + lo;
  }

  const itemCount = readVarint();
  const items: Buffer[] = [];
  for (let i = 0; i < itemCount; i++) {
    const len = readVarint();
    items.push(buf.subarray(offset, offset + len));
    offset += len;
  }
  if (offset !== buf.length) return [];
  return items;
}

// ---------------------------------------------------------------------------
// Multisig script parsing
// ---------------------------------------------------------------------------

interface MultisigInfo {
  m: number;
  n: number;
  pubkeys: Buffer[];
}

function parseMultisigScript(script: Buffer): MultisigInfo | null {
  if (script.length < 1) return null;

  const first = script[0];
  if (first < 0x51 || first > 0x60) return null;
  const m = first - 0x50;

  let offset = 1;
  const pubkeys: Buffer[] = [];

  while (offset < script.length) {
    if (script[offset] !== 0x21) break;
    offset += 1;
    if (offset + 33 > script.length) return null;
    const pk = script.subarray(offset, offset + 33);
    if (pk[0] !== 0x02 && pk[0] !== 0x03) return null;
    pubkeys.push(Buffer.from(pk));
    offset += 33;
  }

  if (offset + 2 > script.length) return null;
  const nOp = script[offset];
  if (nOp < 0x51 || nOp > 0x60) return null;
  const n = nOp - 0x50;

  if (script[offset + 1] !== 0xae) return null;
  if (offset + 2 !== script.length) return null;
  if (pubkeys.length !== n) return null;
  if (m > n) return null;

  return { m, n, pubkeys };
}

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

/**
 * Verify a BIP-322 "simple" signature produced by a P2WSH multisig wallet.
 *
 * @param message         The signed message (UTF-8 string)
 * @param address         A mainnet P2WSH address (bc1q...)
 * @param signatureBase64 The base64-encoded witness stack
 * @returns true when the signature is valid
 */
export function verifyBip322P2wshSignature(message: string, address: string, signatureBase64: string): boolean {
  try {
    if (!isP2wshAddress(address)) return false;
    const decoded = bech32.decode(address);
    const program = Buffer.from(bech32.fromWords(decoded.words.slice(1)));

    const witnessBuf = Buffer.from(signatureBase64, 'base64');
    const stack = decodeWitnessStack(witnessBuf);
    if (stack.length < 3) return false;

    const witnessScript = stack[stack.length - 1];
    if (!btcCrypto.sha256(witnessScript).equals(program)) return false;

    const info = parseMultisigScript(witnessScript);
    if (!info) return false;

    if (stack[0].length !== 0) return false;

    const sigs = stack.slice(1, stack.length - 1);
    if (sigs.length !== info.m) return false;

    const scriptPubKey = p2wshScriptPubKey(witnessScript);
    const messageHash = bip322MessageHash(message);
    const toSpend = buildToSpendTx(messageHash, scriptPubKey);

    const toSign = new Transaction();
    toSign.version = 0;
    toSign.locktime = 0;
    toSign.addInput(toSpend.getHash(), 0, 0);
    toSign.addOutput(Buffer.from([0x6a]), 0);

    const sighash = toSign.hashForWitnessV0(0, witnessScript, 0, Transaction.SIGHASH_ALL);

    let pkIdx = 0;
    for (const sigBuf of sigs) {
      if (sigBuf.length < 1) return false;

      const sighashType = sigBuf[sigBuf.length - 1];
      if (sighashType !== Transaction.SIGHASH_ALL) return false;

      const der = sigBuf.subarray(0, sigBuf.length - 1);
      const compact = secp256k1.Signature.fromDER(der).normalizeS().toCompactRawBytes();

      let matched = false;
      while (pkIdx < info.pubkeys.length) {
        const pk = info.pubkeys[pkIdx];
        pkIdx++;
        if (secp256k1.verify(compact, sighash, pk)) {
          matched = true;
          break;
        }
      }
      if (!matched) return false;
    }

    return true;
  } catch {
    return false;
  }
}
