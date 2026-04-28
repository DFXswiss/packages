import * as bitcoin from 'bitcoinjs-lib';
import { findAddress, MultisigDescriptor, parseDescriptor, DerivedAddress } from './descriptor';
import './ecc-init';

const TAG = Buffer.from('BIP0322-signed-message', 'utf8');

export interface BuildPsbtArgs {
  message: string;
  descriptor: MultisigDescriptor | string;
  address: string;
  maxIndex?: number;
}

export interface BuiltPsbt {
  psbtBase64: string;
  toSpendTxid: string;
  derived: DerivedAddress;
}

export function buildBip322Psbt(args: BuildPsbtArgs): BuiltPsbt {
  const desc = typeof args.descriptor === 'string' ? parseDescriptor(args.descriptor) : args.descriptor;
  const derived = findAddress(desc, args.address, args.maxIndex);
  if (!derived) {
    throw new Error(`Address ${args.address} not derivable from descriptor in first ${args.maxIndex ?? 200} indices`);
  }

  const program = bitcoin.crypto.sha256(derived.witnessScript);
  const scriptPubKey = Buffer.concat([Buffer.from([0x00, 0x20]), program]);

  const messageHash = bip322MessageHash(args.message);
  const toSpend = buildToSpendTx(messageHash, scriptPubKey);
  const toSpendTxid = toSpend.getId();

  const psbt = new bitcoin.Psbt();
  psbt.setVersion(0);
  psbt.setLocktime(0);

  const bip32Derivation = desc.keys.map((k, idx) => ({
    masterFingerprint: Buffer.from(k.fingerprint, 'hex'),
    path: `m/${k.originPath.replace(/h/g, "'")}/${derived.branch}/${derived.index}`,
    pubkey: derived.pubkeys[idx],
  }));

  psbt.addInput({
    hash: toSpendTxid,
    index: 0,
    sequence: 0,
    witnessUtxo: { script: scriptPubKey, value: 0 },
    witnessScript: derived.witnessScript,
    sighashType: bitcoin.Transaction.SIGHASH_ALL,
    bip32Derivation,
    nonWitnessUtxo: toSpend.toBuffer(),
  });

  psbt.addOutput({ value: 0, script: Buffer.from([0x6a]) });

  return { psbtBase64: psbt.toBase64(), toSpendTxid, derived };
}

function bip322MessageHash(message: string): Buffer {
  const tagHash = bitcoin.crypto.sha256(TAG);
  return bitcoin.crypto.sha256(Buffer.concat([tagHash, tagHash, Buffer.from(message, 'utf8')]));
}

function buildToSpendTx(messageHash: Buffer, scriptPubKey: Buffer): bitcoin.Transaction {
  const tx = new bitcoin.Transaction();
  tx.version = 0;
  tx.locktime = 0;
  const scriptSig = Buffer.concat([Buffer.from([0x00, 0x20]), messageHash]);
  tx.addInput(Buffer.alloc(32), 0xffffffff, 0, scriptSig);
  tx.addOutput(scriptPubKey, 0);
  return tx;
}
