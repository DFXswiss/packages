import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
import { buildSortedMultisigScript, p2wshAddress } from './core';

const bip32 = BIP32Factory(ecc);

export interface DescriptorKey {
  fingerprint: string;
  originPath: string;
  xpub: string;
}

export interface MultisigDescriptor {
  threshold: number;
  keys: DescriptorKey[];
  receiveBranch: number;
  changeBranch: number;
}

export interface DerivedAddress {
  branch: number;
  index: number;
  pubkeys: Buffer[];
  witnessScript: Buffer;
  address: string;
}

export function parseDescriptor(input: string): MultisigDescriptor {
  const stripped = input.replace(/\s+/g, '');
  const m = stripped.match(/^wsh\(sortedmulti\((\d+),(.+)\)\)(?:#[a-z0-9]{8})?$/i);
  if (!m) throw new Error('Only wsh(sortedmulti(...)) descriptors are supported');
  const threshold = parseInt(m[1], 10);
  const keyStrs = splitTopLevel(m[2]);
  const parsed = keyStrs.map(parseKey);

  const receiveBranches = new Set(parsed.map((k) => k.receiveBranch));
  const changeBranches = new Set(parsed.map((k) => k.changeBranch));
  if (receiveBranches.size > 1 || changeBranches.size > 1) {
    throw new Error('Inconsistent receive/change branches across cosigners');
  }

  return {
    threshold,
    keys: parsed.map(({ fingerprint, originPath, xpub }) => ({ fingerprint, originPath, xpub })),
    receiveBranch: parsed[0].receiveBranch,
    changeBranch: parsed[0].changeBranch,
  };
}

function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf) out.push(buf);
  return out;
}

interface ParsedKey extends DescriptorKey {
  receiveBranch: number;
  changeBranch: number;
}

function parseKey(s: string): ParsedKey {
  const m = s.match(
    /^\[([0-9a-f]{8})((?:\/[0-9]+[h']?)+)\](xpub[1-9A-HJ-NP-Za-km-z]+)(?:\/<([0-9]+);([0-9]+)>)?(?:\/(\*|\d+))?$/i,
  );
  if (!m) throw new Error(`Cannot parse descriptor key: ${s}`);
  return {
    fingerprint: m[1].toLowerCase(),
    originPath: m[2].replace(/^\//, '').replace(/'/g, 'h'),
    xpub: m[3],
    receiveBranch: m[4] !== undefined ? parseInt(m[4], 10) : 0,
    changeBranch: m[5] !== undefined ? parseInt(m[5], 10) : 1,
  };
}

export function deriveAddress(desc: MultisigDescriptor, branch: number, index: number): DerivedAddress {
  const nodes: BIP32Interface[] = desc.keys.map((k) => bip32.fromBase58(k.xpub));
  const pubkeys = nodes.map((n) => Buffer.from(n.derive(branch).derive(index).publicKey));
  const witnessScript = buildSortedMultisigScript(pubkeys, desc.threshold);
  const address = p2wshAddress(witnessScript);
  return { branch, index, pubkeys, witnessScript, address };
}

export function findAddress(desc: MultisigDescriptor, targetAddress: string, maxIndex = 200): DerivedAddress | null {
  for (const branch of [desc.receiveBranch, desc.changeBranch]) {
    for (let i = 0; i < maxIndex; i++) {
      const derived = deriveAddress(desc, branch, i);
      if (derived.address === targetAddress) return derived;
    }
  }
  return null;
}

// buildSortedMultisigScript and p2wshAddress are in core.ts
export { buildSortedMultisigScript, p2wshAddress } from './core';
