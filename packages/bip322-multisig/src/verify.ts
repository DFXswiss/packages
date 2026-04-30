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
    const witnessVersion = words[0];
    if (witnessVersion !== 0) return false;
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
    // 0xff — 8-byte; unlikely for witness but handle gracefully
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
// DER signature parsing
// ---------------------------------------------------------------------------

/**
 * Parse a DER-encoded ECDSA signature into a compact 64-byte (r || s) Buffer.
 * Accepts both low-S and high-S; noble/curves verify handles normalization.
 */
function parseDerSignature(der: Buffer): Buffer | null {
  // DER: 0x30 <total-len> 0x02 <r-len> <r> 0x02 <s-len> <s>
  if (der.length < 8) return null;
  if (der[0] !== 0x30) return null;

  let offset = 2; // skip 0x30 and length byte

  // Parse R
  if (der[offset] !== 0x02) return null;
  offset++;
  const rLen = der[offset++];
  if (offset + rLen > der.length) return null;
  const rRaw = der.subarray(offset, offset + rLen);
  offset += rLen;

  // Parse S
  if (der[offset] !== 0x02) return null;
  offset++;
  const sLen = der[offset++];
  if (offset + sLen > der.length) return null;
  const sRaw = der.subarray(offset, offset + sLen);

  // Convert to 32-byte big-endian, stripping leading zero padding
  const r = padTo32(rRaw);
  const s = padTo32(sRaw);
  if (!r || !s) return null;

  // Return compact 64-byte signature (r || s)
  return Buffer.concat([r, s]);
}

function padTo32(buf: Buffer): Buffer | null {
  // Strip leading zeros
  let start = 0;
  while (start < buf.length - 1 && buf[start] === 0) start++;
  const trimmed = buf.subarray(start);
  if (trimmed.length > 32) return null;
  if (trimmed.length === 32) return Buffer.from(trimmed);
  const padded = Buffer.alloc(32);
  trimmed.copy(padded, 32 - trimmed.length);
  return padded;
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
  if (first < 0x51 || first > 0x60) return null; // OP_1..OP_16
  const m = first - 0x50;

  let offset = 1;
  const pubkeys: Buffer[] = [];

  while (offset < script.length) {
    const op = script[offset];
    if (op === 0x21) {
      // PUSH 33 bytes (compressed pubkey)
      offset += 1;
      if (offset + 33 > script.length) return null;
      const pk = script.subarray(offset, offset + 33);
      if (pk[0] !== 0x02 && pk[0] !== 0x03) return null;
      pubkeys.push(Buffer.from(pk));
      offset += 33;
    } else {
      break;
    }
  }

  if (offset + 2 > script.length) return null;
  const nOp = script[offset];
  if (nOp < 0x51 || nOp > 0x60) return null;
  const n = nOp - 0x50;

  if (script[offset + 1] !== 0xae) return null; // OP_CHECKMULTISIG
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
    // 1. Decode address -> 32-byte witness program
    if (!isP2wshAddress(address)) return false;
    const decoded = bech32.decode(address);
    const program = Buffer.from(bech32.fromWords(decoded.words.slice(1)));

    // 2. Decode base64 -> witness stack
    const witnessBuf = Buffer.from(signatureBase64, 'base64');
    const stack = decodeWitnessStack(witnessBuf);
    if (stack.length < 3) return false; // at least: dummy, 1 sig, witnessScript

    // 3. Last item = witnessScript; verify SHA256 matches program
    const witnessScript = stack[stack.length - 1];
    const scriptHash = btcCrypto.sha256(witnessScript);
    if (!scriptHash.equals(program)) return false;

    // 4. Parse multisig script
    const info = parseMultisigScript(witnessScript);
    if (!info) return false;

    // 5. First item must be empty (OP_0 dummy for CHECKMULTISIG)
    if (stack[0].length !== 0) return false;

    // 6. Signature count must equal m
    const sigs = stack.slice(1, stack.length - 1);
    if (sigs.length !== info.m) return false;

    // 7. Compute BIP-143 sighash
    const scriptPubKey = p2wshScriptPubKey(witnessScript);
    const messageHash = bip322MessageHash(message);
    const toSpend = buildToSpendTx(messageHash, scriptPubKey);

    const toSign = new Transaction();
    toSign.version = 0;
    toSign.locktime = 0;
    toSign.addInput(toSpend.getHash(), 0, 0);
    toSign.addOutput(Buffer.from([0x6a]), 0);

    const sighash = toSign.hashForWitnessV0(0, witnessScript, 0, Transaction.SIGHASH_ALL);

    // 8. Verify multisig (OP_CHECKMULTISIG convention)
    let pkIdx = 0;
    for (const sigBuf of sigs) {
      if (sigBuf.length < 1) return false;

      // Last byte is sighash type
      const sighashType = sigBuf[sigBuf.length - 1];
      if (sighashType !== Transaction.SIGHASH_ALL) return false;

      const derBytes = sigBuf.subarray(0, sigBuf.length - 1);

      // Parse DER into compact (r||s) with low-S normalization
      const compactSig = parseDerSignature(Buffer.from(derBytes));
      if (!compactSig) return false;

      // Find a matching pubkey (must be in order)
      let matched = false;
      while (pkIdx < info.pubkeys.length) {
        const pk = info.pubkeys[pkIdx];
        pkIdx++;
        if (secp256k1.verify(compactSig, sighash, pk, { lowS: false })) {
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
