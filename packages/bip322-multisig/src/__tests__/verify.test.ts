import { randomBytes } from 'crypto';
import { Transaction } from 'bitcoinjs-lib';
import { secp256k1 } from '@noble/curves/secp256k1';
import { isP2wshAddress, verifyBip322P2wshSignature } from '../verify';
import { buildSortedMultisigScript, p2wshAddress, p2wshScriptPubKey, bip322MessageHash, buildToSpendTx } from '../core';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a random compressed public key (with corresponding private key). */
function generateKey() {
  const priv = randomBytes(32);
  const pub = Buffer.from(secp256k1.getPublicKey(priv, true));
  return { priv, pub };
}

/** Build a varint-length-prefixed witness stack (Bitcoin serialization). */
function encodeWitnessStack(items: Buffer[]): Buffer {
  const parts: Buffer[] = [encodeVarint(items.length)];
  for (const item of items) {
    parts.push(encodeVarint(item.length));
    parts.push(item);
  }
  return Buffer.concat(parts);
}

function encodeVarint(n: number): Buffer {
  if (n < 0xfd) return Buffer.from([n]);
  if (n <= 0xffff) {
    const b = Buffer.alloc(3);
    b[0] = 0xfd;
    b.writeUInt16LE(n, 1);
    return b;
  }
  const b = Buffer.alloc(5);
  b[0] = 0xfe;
  b.writeUInt32LE(n, 1);
  return b;
}

/** Compute BIP-322 sighash for a given message + witnessScript. */
function computeSighash(message: string, witnessScript: Buffer): Buffer {
  const scriptPubKey = p2wshScriptPubKey(witnessScript);
  const messageHash = bip322MessageHash(message);
  const toSpend = buildToSpendTx(messageHash, scriptPubKey);

  const toSign = new Transaction();
  toSign.version = 0;
  toSign.locktime = 0;
  toSign.addInput(toSpend.getHash(), 0, 0);
  toSign.addOutput(Buffer.from([0x6a]), 0);

  return toSign.hashForWitnessV0(0, witnessScript, 0, Transaction.SIGHASH_ALL);
}

/** Sign a sighash and return DER-encoded signature with SIGHASH_ALL appended. */
function signDer(sighash: Buffer, privKey: Uint8Array): Buffer {
  const sig = secp256k1.sign(sighash, privKey, { lowS: true });
  const der = Buffer.from(sig.toDERRawBytes());
  return Buffer.concat([der, Buffer.from([Transaction.SIGHASH_ALL])]);
}

/** Sign and produce a BIP-322 base64 witness for a 2-of-3 multisig. */
function signMultisig(
  message: string,
  keys: { priv: Uint8Array; pub: Buffer }[],
  signerIndices: number[],
): { address: string; signatureBase64: string; witnessScript: Buffer } {
  const pubkeys = keys.map((k) => k.pub);
  const witnessScript = buildSortedMultisigScript(pubkeys, signerIndices.length);
  const address = p2wshAddress(witnessScript);

  const sighash = computeSighash(message, witnessScript);

  // Sorted pubkeys determine the order in the script
  const sorted = [...pubkeys].sort(Buffer.compare);

  // Build (signerIndex -> position in sorted list) so we sign in sorted order
  const signerPubs = signerIndices.map((i) => keys[i]);
  const orderedSigners = signerPubs
    .map((k) => ({
      priv: k.priv,
      sortedIdx: sorted.findIndex((s) => s.equals(k.pub)),
    }))
    .sort((a, b) => a.sortedIdx - b.sortedIdx);

  const sigs: Buffer[] = [];
  for (const signer of orderedSigners) {
    sigs.push(signDer(sighash, signer.priv));
  }

  // Witness stack: [OP_0 dummy, sig1, sig2, ..., witnessScript]
  const stack: Buffer[] = [Buffer.alloc(0), ...sigs, witnessScript];
  const signatureBase64 = encodeWitnessStack(stack).toString('base64');

  return { address, signatureBase64, witnessScript };
}

// ---------------------------------------------------------------------------
// Tests: isP2wshAddress
// ---------------------------------------------------------------------------

describe('isP2wshAddress', () => {
  it('accepts a valid mainnet P2WSH address', () => {
    expect(isP2wshAddress('bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep')).toBe(true);
  });

  it('rejects a P2WPKH address (20-byte program)', () => {
    expect(isP2wshAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toBe(false);
  });

  it('rejects a legacy address', () => {
    expect(isP2wshAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(false);
  });

  it('rejects a testnet P2WSH address', () => {
    expect(isP2wshAddress('tb1qrp33g0q5b5698ahp5jnf5yzjmgced69zxx0pehrqcgul8ntf0t4qnmva5v')).toBe(false);
  });

  it('rejects a malformed string', () => {
    expect(isP2wshAddress('not-a-bitcoin-address')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isP2wshAddress('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests: verifyBip322P2wshSignature — structural negatives
// ---------------------------------------------------------------------------

describe('verifyBip322P2wshSignature — structural negatives', () => {
  it('returns false for empty signature', () => {
    expect(
      verifyBip322P2wshSignature('hello', 'bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep', ''),
    ).toBe(false);
  });

  it('returns false for garbage base64', () => {
    expect(
      verifyBip322P2wshSignature('hello', 'bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep', 'AAAA'),
    ).toBe(false);
  });

  it('returns false for non-P2WSH address', () => {
    expect(verifyBip322P2wshSignature('hello', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'AAAA')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests: verifyBip322P2wshSignature — synthetic 2-of-3 roundtrip
// ---------------------------------------------------------------------------

describe('verifyBip322P2wshSignature — 2-of-3 roundtrip', () => {
  const key1 = generateKey();
  const key2 = generateKey();
  const key3 = generateKey();
  const keys = [key1, key2, key3];

  it('verifies a short message', () => {
    const msg = 'short';
    const { address, signatureBase64 } = signMultisig(msg, keys, [0, 1]);
    expect(verifyBip322P2wshSignature(msg, address, signatureBase64)).toBe(true);
  });

  it('verifies a medium-length message', () => {
    const msg = 'The quick brown fox jumps over the lazy dog — BIP-322 P2WSH test';
    const { address, signatureBase64 } = signMultisig(msg, keys, [1, 2]);
    expect(verifyBip322P2wshSignature(msg, address, signatureBase64)).toBe(true);
  });

  it('verifies a long message', () => {
    const msg = 'A'.repeat(500);
    const { address, signatureBase64 } = signMultisig(msg, keys, [0, 2]);
    expect(verifyBip322P2wshSignature(msg, address, signatureBase64)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests: verifyBip322P2wshSignature — rejection
// ---------------------------------------------------------------------------

describe('verifyBip322P2wshSignature — rejection', () => {
  const key1 = generateKey();
  const key2 = generateKey();
  const key3 = generateKey();
  const keys = [key1, key2, key3];
  const message = 'rejection test message';

  it('rejects under-threshold (1-of-3 when 2 required)', () => {
    const pubkeys = keys.map((k) => k.pub);
    const witnessScript = buildSortedMultisigScript(pubkeys, 2);
    const address = p2wshAddress(witnessScript);
    const sighash = computeSighash(message, witnessScript);

    // Produce only 1 signature
    const derSig = signDer(sighash, key1.priv);

    // Witness: [dummy, 1 sig, witnessScript] — only 1 sig instead of 2
    const stack = [Buffer.alloc(0), derSig, witnessScript];
    const signatureBase64 = encodeWitnessStack(stack).toString('base64');

    expect(verifyBip322P2wshSignature(message, address, signatureBase64)).toBe(false);
  });

  it('rejects wrong message', () => {
    const { address, signatureBase64 } = signMultisig(message, keys, [0, 1]);
    expect(verifyBip322P2wshSignature('wrong message', address, signatureBase64)).toBe(false);
  });

  it('rejects signature with foreign key', () => {
    const foreignKey = generateKey();
    const pubkeys = keys.map((k) => k.pub);
    const witnessScript = buildSortedMultisigScript(pubkeys, 2);
    const address = p2wshAddress(witnessScript);
    const sighash = computeSighash(message, witnessScript);

    const sorted = [...pubkeys].sort(Buffer.compare);

    // Sign with key1 (valid) and foreignKey (not in script)
    const sig1 = signDer(sighash, key1.priv);
    const sig2 = signDer(sighash, foreignKey.priv);

    // Order: sig for key1 first (by sorted position), then foreign sig
    const idx1 = sorted.findIndex((s) => s.equals(key1.pub));
    const sigs = idx1 === 0 ? [sig1, sig2] : [sig2, sig1];

    const stack = [Buffer.alloc(0), ...sigs, witnessScript];
    const signatureBase64 = encodeWitnessStack(stack).toString('base64');

    expect(verifyBip322P2wshSignature(message, address, signatureBase64)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests: real wallet fixture (placeholder)
// ---------------------------------------------------------------------------

describe('verifyBip322P2wshSignature — real wallet fixture', () => {
  it.todo('verify a signature produced by a real hardware wallet');
});
