import { buildToSignPsbt, p2wshScriptPubKey } from './core';
import { findAddress, MultisigDescriptor, parseDescriptor, DerivedAddress } from './descriptor';
import './ecc-init';

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

  const scriptPubKey = p2wshScriptPubKey(derived.witnessScript);

  const bip32Derivation = desc.keys.map((k, idx) => ({
    masterFingerprint: Buffer.from(k.fingerprint, 'hex'),
    path: `m/${k.originPath.replace(/h/g, "'")}/${derived.branch}/${derived.index}`,
    pubkey: derived.pubkeys[idx],
  }));

  const { psbtBase64, toSpendTxid } = buildToSignPsbt({
    message: args.message,
    scriptPubKey,
    witnessScript: derived.witnessScript,
    bip32Derivation,
  });

  return { psbtBase64, toSpendTxid, derived };
}
