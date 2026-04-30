// Low-level BIP-322 primitives (no ecc side-effects, React-Native-safe)
export {
  bip322MessageHash,
  buildToSpendTx,
  buildToSignPsbt,
  extractBip322Signature,
  buildSortedMultisigScript,
  p2wshScriptPubKey,
  p2wshAddress,
} from './core';
export type { Bip32Derivation, BuildToSignPsbtArgs, BuildToSignPsbtResult } from './core';

// High-level API (descriptor-based, requires ecc)
export { parseDescriptor, deriveAddress, findAddress } from './descriptor';
export type { DescriptorKey, MultisigDescriptor, DerivedAddress } from './descriptor';

export { buildBip322Psbt } from './psbt';
export type { BuildPsbtArgs, BuiltPsbt } from './psbt';

// Verification
export { isP2wshAddress, verifyBip322P2wshSignature } from './verify';
