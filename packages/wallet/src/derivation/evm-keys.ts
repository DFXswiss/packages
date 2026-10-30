import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, isBytes, utf8ToBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import { checkIndex } from './bitcoin-keys';

export type EvmAddress = `0x${string}`;

/** MetaMask account path: `m/44'/60'/0'/0/i`, always derived from the master node. */
export function evmAddressPath(index: number): string {
  checkIndex(index);
  return `m/44'/60'/0'/0/${index}`;
}

/** EIP-55 address of a secp256k1 public key (33 bytes compressed or 65 bytes uncompressed). */
export function evmAddressFromPublicKey(publicKey: Uint8Array): EvmAddress {
  if (!isBytes(publicKey) || (publicKey.length !== 33 && publicKey.length !== 65)) {
    throw new WalletError('invalid-public-key', 'Expected a 33- or 65-byte secp256k1 public key');
  }
  const uncompressed = secp256k1.ProjectivePoint.fromHex(publicKey).toRawBytes(false);
  return toChecksumAddress(`0x${bytesToHex(keccak_256(uncompressed.subarray(1)).subarray(-20))}`);
}

/** EIP-55 mixed-case checksum spelling of a 20-byte hex address (input case is ignored). */
export function toChecksumAddress(address: string): EvmAddress {
  if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new WalletError('invalid-evm-address', 'Expected a 0x-prefixed 20-byte hex address');
  }
  const lower = address.slice(2).toLowerCase();
  const hash = bytesToHex(keccak_256(utf8ToBytes(lower)));
  let result = '0x';
  for (let i = 0; i < lower.length; i++) {
    result += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
  }
  return result as EvmAddress;
}
