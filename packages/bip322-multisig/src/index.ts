export { parseDescriptor, deriveAddress, findAddress, buildSortedMultisigScript, p2wshAddress } from './descriptor';
export type { DescriptorKey, MultisigDescriptor, DerivedAddress } from './descriptor';

export { buildBip322Psbt } from './psbt';
export type { BuildPsbtArgs, BuiltPsbt } from './psbt';

export { extractBip322Signature } from './witness';
