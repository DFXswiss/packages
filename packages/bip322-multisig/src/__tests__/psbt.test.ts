import * as bitcoin from 'bitcoinjs-lib';
import { buildBip322Psbt } from '../psbt';
import { parseDescriptor } from '../descriptor';
import { extractBip322Signature } from '../witness';

const testDescriptor =
  'wsh(sortedmulti(2,' +
  '[1bb8690c/48h/0h/0h/2h]xpub6EBLyXgtnSWSBU1w4LoKDVd9HCgLSLzeQLdBVFCyAMyj9zJkmYETsbg8AiYG3Jbva5oYDSWBfkBeptREEqmAqMu2skRR37F9mG2sAExacDt/<0;1>/*,' +
  '[4c6ad2dd/48h/0h/0h/2h]xpub6EZmQU6eoRTP6Pg8qQUtmtxJ1PSSWMkvm3TSWMwK77rMcAujGVx1YAtcrRNjgTpDkeYGyxskUuJxTy4bVCkK4E62WGhggQmZ8CWBSa8bnP7/<0;1>/*,' +
  '[593e1579/48h/0h/0h/2h]xpub6EfMCm6rZteRoEiEfnSevj5Cd2M1mVi1m4Ua3utM7zHV7HJTQVv7hFrvms2qCzZRAPgVUsvP2Mdr9mYnEdeowXhausk97j7PbBkQG6yGL2E/<0;1>/*' +
  '))#2q0ffjjc';

const testAddress = 'bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep';
const testMessage = 'Hello DFX BIP-322 multisig auth';

describe('buildBip322Psbt', () => {
  it('builds a PSBT with all fields needed for HW-wallet signing', () => {
    const result = buildBip322Psbt({ message: testMessage, descriptor: testDescriptor, address: testAddress });
    const psbt = bitcoin.Psbt.fromBase64(result.psbtBase64);
    expect(psbt.version).toBe(0);
    expect(psbt.locktime).toBe(0);
    expect(psbt.data.inputs).toHaveLength(1);

    const inp = psbt.data.inputs[0];
    expect(inp.witnessUtxo!.value).toBe(0);
    expect(inp.witnessUtxo!.script.toString('hex')).toMatch(/^0020[0-9a-f]{64}$/);
    expect(inp.witnessScript![0]).toBe(0x52);
    expect(inp.sighashType).toBe(bitcoin.Transaction.SIGHASH_ALL);
    expect(inp.bip32Derivation).toHaveLength(3);
    expect(inp.bip32Derivation![0].path).toBe("m/48'/0'/0'/2'/0/7");
    expect(inp.nonWitnessUtxo).toBeDefined();

    const tx = (psbt.data.globalMap as any).unsignedTx.tx as bitcoin.Transaction;
    expect(tx.outs).toHaveLength(1);
    expect(tx.outs[0].value).toBe(0);
    expect(tx.outs[0].script.toString('hex')).toBe('6a');
  });

  it('accepts pre-parsed descriptor', () => {
    const desc = parseDescriptor(testDescriptor);
    const result = buildBip322Psbt({ message: testMessage, descriptor: desc, address: testAddress });
    expect(result.derived.index).toBe(7);
  });

  it('throws when address is not derivable', () => {
    expect(() =>
      buildBip322Psbt({
        message: testMessage,
        descriptor: testDescriptor,
        address: 'bc1qjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunk0qrl3cep',
        maxIndex: 5,
      }),
    ).toThrow(/not derivable/);
  });

  it('produces deterministic to_spend.txid for the same inputs', () => {
    const a = buildBip322Psbt({ message: testMessage, descriptor: testDescriptor, address: testAddress });
    const b = buildBip322Psbt({ message: testMessage, descriptor: testDescriptor, address: testAddress });
    expect(a.toSpendTxid).toBe(b.toSpendTxid);
  });
});

describe('extractBip322Signature', () => {
  it('throws when PSBT has no finalized witness and cannot finalize', () => {
    const result = buildBip322Psbt({ message: testMessage, descriptor: testDescriptor, address: testAddress });
    expect(() => extractBip322Signature(result.psbtBase64)).toThrow();
  });
});
