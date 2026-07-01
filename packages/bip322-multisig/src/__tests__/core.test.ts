import * as bitcoin from 'bitcoinjs-lib';
import {
  bip322MessageHash,
  buildToSpendTx,
  buildToSignPsbt,
  extractBip322Signature,
  buildSortedMultisigScript,
  p2wshScriptPubKey,
  p2wshAddress,
} from '../core';

const testMessage = 'Hello DFX BIP-322 multisig auth';

const pk1 = Buffer.from('022cd3d962e7ddc2576d0e27b5ed329b8dc7fc10abcf62e23a238c54c19a0c43be', 'hex');
const pk2 = Buffer.from('0282801a608167af7687e65ced842c2bd8b679a57f5afb1de20aa800c79f759d4d', 'hex');
const pk3 = Buffer.from('037d0bdd7d012df409484aa82caab2f879cc6b83754f95b9fc54b299aa500f31eb', 'hex');

const testAddress = 'bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep';

describe('bip322MessageHash', () => {
  it('produces a 32-byte tagged hash', () => {
    const h = bip322MessageHash(testMessage);
    expect(h).toBeInstanceOf(Buffer);
    expect(h.length).toBe(32);
  });

  it('is deterministic', () => {
    const a = bip322MessageHash(testMessage);
    const b = bip322MessageHash(testMessage);
    expect(a.equals(b)).toBe(true);
  });

  it('differs for different messages', () => {
    const a = bip322MessageHash('message A');
    const b = bip322MessageHash('message B');
    expect(a.equals(b)).toBe(false);
  });
});

describe('buildToSpendTx', () => {
  it('builds a valid to_spend transaction', () => {
    const hash = bip322MessageHash(testMessage);
    const scriptPubKey = Buffer.from('0020' + '00'.repeat(32), 'hex');
    const tx = buildToSpendTx(hash, scriptPubKey);
    expect(tx.version).toBe(0);
    expect(tx.locktime).toBe(0);
    expect(tx.ins).toHaveLength(1);
    expect(tx.outs).toHaveLength(1);
    expect(tx.outs[0].value).toBe(0);
  });

  it('is deterministic', () => {
    const hash = bip322MessageHash(testMessage);
    const scriptPubKey = Buffer.from('0020' + '00'.repeat(32), 'hex');
    const a = buildToSpendTx(hash, scriptPubKey).getId();
    const b = buildToSpendTx(hash, scriptPubKey).getId();
    expect(a).toBe(b);
  });
});

describe('buildToSignPsbt', () => {
  it('builds a valid PSBT from raw inputs', () => {
    const witnessScript = buildSortedMultisigScript([pk1, pk2, pk3], 2);
    const scriptPubKey = p2wshScriptPubKey(witnessScript);

    const result = buildToSignPsbt({
      message: testMessage,
      scriptPubKey,
      witnessScript,
      bip32Derivation: [
        { masterFingerprint: Buffer.from('1bb8690c', 'hex'), path: "m/48'/0'/0'/2'/0/7", pubkey: pk1 },
        { masterFingerprint: Buffer.from('4c6ad2dd', 'hex'), path: "m/48'/0'/0'/2'/0/7", pubkey: pk2 },
        { masterFingerprint: Buffer.from('593e1579', 'hex'), path: "m/48'/0'/0'/2'/0/7", pubkey: pk3 },
      ],
    });

    expect(result.psbtBase64).toBeTruthy();
    expect(result.toSpendTxid).toBeTruthy();
    expect(result.psbt).toBeInstanceOf(bitcoin.Psbt);

    const psbt = bitcoin.Psbt.fromBase64(result.psbtBase64);
    expect(psbt.data.inputs).toHaveLength(1);
    const inp = psbt.data.inputs[0];
    expect(inp.witnessUtxo!.value).toBe(0);
    expect(inp.witnessScript![0]).toBe(0x52);
    expect(inp.sighashType).toBe(bitcoin.Transaction.SIGHASH_ALL);
    expect(inp.bip32Derivation).toHaveLength(3);
    expect(inp.nonWitnessUtxo).toBeDefined();
  });
});

describe('p2wshScriptPubKey', () => {
  it('produces OP_0 PUSH32 <sha256(witnessScript)>', () => {
    const witnessScript = buildSortedMultisigScript([pk1, pk2, pk3], 2);
    const spk = p2wshScriptPubKey(witnessScript);
    expect(spk.length).toBe(34);
    expect(spk[0]).toBe(0x00);
    expect(spk[1]).toBe(0x20);
  });

  it('is consistent with p2wshAddress', () => {
    const witnessScript = buildSortedMultisigScript([pk1, pk2, pk3], 2);
    const spk = p2wshScriptPubKey(witnessScript);
    const addr = p2wshAddress(witnessScript);
    expect(addr).toBe(testAddress);
    expect(spk.toString('hex')).toMatch(/^0020[0-9a-f]{64}$/);
  });
});

describe('extractBip322Signature', () => {
  it('throws when PSBT input is not finalized', () => {
    const witnessScript = buildSortedMultisigScript([pk1, pk2, pk3], 2);
    const scriptPubKey = p2wshScriptPubKey(witnessScript);
    const { psbtBase64 } = buildToSignPsbt({
      message: testMessage,
      scriptPubKey,
      witnessScript,
      bip32Derivation: [],
    });
    expect(() => extractBip322Signature(psbtBase64)).toThrow(/not finalized/);
  });
});
