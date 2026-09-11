// Low-level BIP-322 primitives (no ecc side-effects, React-Native-safe)
export {
  bip322MessageHash,
  buildToSpendTx,
  buildToSignPsbt,
  extractBip322Signature,
  buildSortedMultisigScript,
  p2wshScriptPubKey,
  p2wshAddress,
  BIP322_SIMPLE_PREFIX,
  BIP322_FULL_PREFIX,
  BIP322_POF_PREFIX,
  PSBT_GLOBAL_GENERIC_SIGNED_MESSAGE,
  parseBip322SignatureEncoding,
  encodeBip322SimpleSignature,
} from './core';
export type {
  Bip32Derivation,
  BuildToSignPsbtArgs,
  BuildToSignPsbtResult,
  Bip322SignatureVariant,
  ParsedBip322Signature,
} from './core';

// High-level API (descriptor-based, requires ecc)
export { parseDescriptor, deriveAddress, findAddress } from './descriptor';
export type { DescriptorKey, MultisigDescriptor, DerivedAddress } from './descriptor';

export { buildBip322Psbt } from './psbt';
export type { BuildPsbtArgs, BuiltPsbt } from './psbt';

// Verification
export { isP2wshAddress, verifyBip322P2wshSignature } from './verify';
