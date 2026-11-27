import { Address, OutScript, selectUTXO, SigHash, Transaction, bip32Path } from '@scure/btc-signer';
import type { BTC_NETWORK } from '@scure/btc-signer/utils';
import { base64 } from '@scure/base';
import type { BitcoinNetwork } from '../config/environment';
import {
  BITCOIN_BASE58_VERSIONS,
  BITCOIN_HRP,
  bitcoinAccountPath,
  bitcoinAddressPath,
  hash160,
  p2wpkhScript,
} from '../derivation/bitcoin-keys';
import type { OwnBitcoinKey } from '../derivation/keyring';
import { findBitcoinKey, findBitcoinKeyByHash, KeyRing, withPrivateKey } from '../derivation/keyring';
import { bytesToHex, equalBytes, isBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/**
 * Bitcoin send transactions of the wallet's BIP-84 account as PSBT (BIP-174, version 0), on mainnet, testnet4
 * and regtest. Every input must be a P2WPKH output of the ring's own receive or change chain; inputs are
 * signed with SIGHASH_ALL only. The app shows {@link describeBitcoinPsbt} to the user before it signs.
 */

/** An unspent output of one of the wallet's own addresses (Esplora `address/:address/utxo` plus the address). */
export interface BitcoinSpendableUtxo {
  /** Transaction id in the usual display (big-endian) hex form. */
  txid: string;
  vout: number;
  /** Value in satoshis. */
  value: number | bigint;
  /** The wallet's own P2WPKH address that holds the output. */
  address: string;
}

export interface BitcoinSendRequest {
  /** Destination address of the ring's network (P2WPKH, P2WSH, P2TR, P2PKH or P2SH). */
  to: string;
  /** Amount for the destination in satoshis. */
  amount: number | bigint;
  /** Fee rate in sat/vB; fractions are rounded up. */
  feeRate: number;
  /** Candidate outputs to spend; coin selection picks from them. */
  utxos: BitcoinSpendableUtxo[];
  /** Index on the change chain (1) that receives the change. */
  changeIndex: number;
  /** How many receive and change indexes are searched for own addresses (default 100). */
  scan?: number;
}

export interface BitcoinPsbtOutput {
  /** Address of the output on the ring's network, if the script has one. */
  address?: string;
  script: string;
  amount: bigint;
  /** True for an output to the ring's own change chain. */
  change: boolean;
}

export interface BitcoinPsbtSummary {
  network: BitcoinNetwork;
  inputs: { txid: string; vout: number; amount: bigint; path: string }[];
  outputs: BitcoinPsbtOutput[];
  /** Sum of the inputs minus the sum of the outputs, in satoshis. */
  fee: bigint;
}

export interface BitcoinSendPsbt extends BitcoinPsbtSummary {
  /** The unsigned PSBT, base64. */
  psbt: string;
}

export interface SignedBitcoinTransaction extends BitcoinPsbtSummary {
  /** The signed and finalized PSBT, base64. */
  psbt: string;
  /** The raw transaction for broadcasting, lowercase hex. */
  hex: string;
  txid: string;
}

/** Highest fee rate the builder accepts, in sat/vB; anything above is treated as an input error. */
export const MAX_FEE_RATE = 10_000;

/** Sequence of every input: final for locktime purposes, signals replace-by-fee (BIP-125). */
const RBF_SEQUENCE = 0xfffffffd;

/** The `@scure/btc-signer` network parameters of a wallet network. */
export function btcSignerNetwork(network: BitcoinNetwork): BTC_NETWORK {
  const base58 = BITCOIN_BASE58_VERSIONS[network];
  if (!base58) throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
  return { bech32: BITCOIN_HRP[network], ...base58 };
}

/**
 * The output script of `address` on `network`. Throws `invalid-address` for an address of another network
 * or a malformed one, so a mainnet address can never be paid from a regtest ring and the other way round.
 */
export function bitcoinOutputScript(address: string, network: BitcoinNetwork): Uint8Array {
  try {
    return OutScript.encode(Address(btcSignerNetwork(network)).decode(address));
  } catch (error) {
    throw new WalletError('invalid-address', `Not a ${network} Bitcoin address: ${address}`, { cause: error });
  }
}

/**
 * Builds the unsigned PSBT of a payment: coin selection over `utxos`, one output to `to`, the change (if it is
 * above the dust limit) to change index `changeIndex`. Inputs and the change output carry their BIP-32
 * derivation, so hardware signers and {@link signBitcoinPsbt} find the keys without searching.
 */
export function buildBitcoinSendPsbt(keys: KeyRing, request: BitcoinSendRequest): BitcoinSendPsbt {
  const network = keys.bitcoinNetwork;
  const btcNetwork = btcSignerNetwork(network);
  const amount = satoshis(request?.amount, 'amount');
  const destination = bitcoinOutputScript(request.to, network);
  if (amount < dustThreshold(destination)) {
    throw new WalletError(
      'amount-below-dust',
      `The amount is below the dust limit of ${dustThreshold(destination)} sat`,
    );
  }
  const feePerByte = feeRate(request.feeRate);
  if (!Array.isArray(request.utxos) || request.utxos.length === 0) {
    throw new WalletError('insufficient-funds', 'No outputs to spend');
  }

  const fingerprint = masterFingerprint(keys);
  const change = keys.bitcoinAddress(1, request.changeIndex);

  // A payment to the own change chain would be indistinguishable from change on the confirmation screen: refuse
  // this build's change address whatever its index, and every other change address inside the scan window.
  const isP2wpkh = destination.length === 22 && destination[0] === 0x00 && destination[1] === 0x14;
  if (
    equalBytes(destination, p2wpkhScript(hash160(change.publicKey))) ||
    (isP2wpkh && findBitcoinKeyByHash(keys, destination.subarray(2), request.scan)?.chain === 1)
  ) {
    throw new WalletError('invalid-address', 'The destination is a change address of this wallet');
  }
  const outpoints = new Set<string>();
  const inputs = request.utxos.map((utxo) => {
    const key = findBitcoinKey(keys, utxo?.address, request.scan);
    if (!key) throw new WalletError('unknown-address', `${utxo?.address} is not a Bitcoin address of this wallet`);
    if (typeof utxo.txid !== 'string' || !/^[0-9a-fA-F]{64}$/.test(utxo.txid)) {
      throw new WalletError('invalid-utxo', `Invalid transaction id: ${utxo.txid}`);
    }
    if (!Number.isSafeInteger(utxo.vout) || utxo.vout < 0 || utxo.vout > 0xffffffff) {
      throw new WalletError('invalid-utxo', `Invalid output index: ${utxo.vout}`);
    }
    const outpoint = `${utxo.txid.toLowerCase()}:${utxo.vout}`;
    if (outpoints.has(outpoint)) throw new WalletError('invalid-utxo', `Output ${outpoint} is listed twice`);
    outpoints.add(outpoint);
    return {
      txid: utxo.txid.toLowerCase(),
      index: utxo.vout,
      sequence: RBF_SEQUENCE,
      witnessUtxo: { script: p2wpkhScript(hash160(key.publicKey)), amount: satoshis(utxo.value, 'utxo value') },
      bip32Derivation: [derivation(keys, key, fingerprint)],
    };
  });

  let selection: ReturnType<typeof selectUTXO>;
  try {
    selection = selectUTXO(inputs, [{ script: destination, amount }], 'default', {
      feePerByte,
      changeAddress: change.address,
      network: btcNetwork,
      createTx: true,
      bip69: false,
    });
  } catch (error) {
    throw new WalletError('invalid-utxo', 'Coin selection failed', { cause: error });
  }
  if (!selection || !selection.tx) {
    throw new WalletError('insufficient-funds', 'The outputs do not cover the amount and the fee');
  }

  const tx = selection.tx;
  const changeScript = p2wpkhScript(hash160(change.publicKey));
  for (let i = 0; i < tx.outputsLength; i++) {
    const script = tx.getOutput(i).script;
    if (script && equalBytes(script, changeScript)) {
      tx.updateOutput(i, {
        bip32Derivation: [
          derivation(keys, { chain: 1, index: request.changeIndex, publicKey: change.publicKey }, fingerprint),
        ],
      });
    }
  }

  return { ...summarize(keys, tx, request.scan), psbt: base64.encode(tx.toPSBT(0)) };
}

/**
 * What a PSBT spends and pays, for the confirmation screen. Throws for a PSBT this wallet would not sign:
 * an input that is not an own P2WPKH output with a witness UTXO, or a sighash type other than ALL.
 */
export function describeBitcoinPsbt(keys: KeyRing, psbt: string | Uint8Array, scan?: number): BitcoinPsbtSummary {
  return summarize(keys, parsePsbt(psbt), scan);
}

/**
 * Signs every input of the PSBT with the ring's keys (SIGHASH_ALL), finalizes it and returns the raw
 * transaction. Every input must belong to this ring, see {@link describeBitcoinPsbt}.
 */
export function signBitcoinPsbt(keys: KeyRing, psbt: string | Uint8Array, scan?: number): SignedBitcoinTransaction {
  const tx = parsePsbt(psbt);
  const owned = ownInputs(keys, tx, scan);
  const summary = summarize(keys, tx, scan, owned);

  owned.forEach((key, idx) => {
    withPrivateKey(keys, { family: 'bitcoin', chain: key.chain, index: key.index }, (privateKey) => {
      if (!tx.signIdx(privateKey, idx, [SigHash.ALL])) {
        throw new WalletError('signing-failed', `Input ${idx} could not be signed`);
      }
    });
  });
  tx.finalize();

  return { ...summary, psbt: base64.encode(tx.toPSBT(0)), hex: bytesToHex(tx.extract()), txid: tx.id };
}

// ---------------------------------------------------------------------------------------------------------------

function parsePsbt(psbt: string | Uint8Array): Transaction {
  try {
    return Transaction.fromPSBT(isBytes(psbt) ? psbt : base64.decode(psbt));
  } catch (error) {
    throw new WalletError('invalid-psbt', 'The PSBT could not be parsed', { cause: error });
  }
}

/** The own key of every input, in input order. */
function ownInputs(keys: KeyRing, tx: Transaction, scan?: number): OwnBitcoinKey[] {
  if (tx.inputsLength === 0) throw new WalletError('invalid-psbt', 'The PSBT has no inputs');
  if (tx.outputsLength === 0) throw new WalletError('invalid-psbt', 'The PSBT has no outputs');
  const fingerprint = masterFingerprint(keys);
  const owned: OwnBitcoinKey[] = [];
  for (let i = 0; i < tx.inputsLength; i++) {
    const input = tx.getInput(i);
    if (input.sighashType !== undefined && input.sighashType !== SigHash.ALL) {
      throw new WalletError('unsupported-sighash', `Input ${i} asks for sighash type ${input.sighashType}`);
    }
    const script = input.witnessUtxo?.script;
    if (!script || script.length !== 22 || script[0] !== 0x00 || script[1] !== 0x14) {
      throw new WalletError('foreign-input', `Input ${i} is not a P2WPKH output with a witness UTXO`);
    }
    const keyHash = script.subarray(2);
    const key =
      fromDerivation(keys, input.bip32Derivation, keyHash, fingerprint) ?? findBitcoinKeyByHash(keys, keyHash, scan);
    if (!key) throw new WalletError('foreign-input', `Input ${i} does not belong to this wallet`);
    owned.push(key);
  }
  return owned;
}

function summarize(
  keys: KeyRing,
  tx: Transaction,
  scan?: number,
  owned = ownInputs(keys, tx, scan),
): BitcoinPsbtSummary {
  const network = keys.bitcoinNetwork;
  const btcNetwork = btcSignerNetwork(network);
  const fingerprint = masterFingerprint(keys);

  const inputs = owned.map((key, i) => {
    const input = tx.getInput(i);
    return {
      txid: input.txid ? bytesToHex(input.txid) : '',
      vout: input.index ?? 0,
      amount: input.witnessUtxo?.amount ?? 0n,
      path: bitcoinAddressPath(network, key.chain, key.index),
    };
  });

  const outputs: BitcoinPsbtOutput[] = [];
  for (let i = 0; i < tx.outputsLength; i++) {
    const output = tx.getOutput(i);
    const script = output.script ?? new Uint8Array();
    let change = false;
    if (script.length === 22 && script[0] === 0x00 && script[1] === 0x14) {
      const keyHash = script.subarray(2);
      const own =
        fromDerivation(keys, output.bip32Derivation, keyHash, fingerprint) ?? findBitcoinKeyByHash(keys, keyHash, scan);
      change = own?.chain === 1;
    }
    outputs.push({
      address: tx.getOutputAddress(i, btcNetwork),
      script: bytesToHex(script),
      amount: output.amount ?? 0n,
      change,
    });
  }

  const totalIn = inputs.reduce((sum, input) => sum + input.amount, 0n);
  const totalOut = outputs.reduce((sum, output) => sum + output.amount, 0n);
  if (totalOut > totalIn) throw new WalletError('invalid-psbt', 'The outputs exceed the inputs');
  return { network, inputs, outputs, fee: totalIn - totalOut };
}

/** The key named by a BIP-32 derivation entry of this ring's master and BIP-84 account, verified by derivation. */
function fromDerivation(
  keys: KeyRing,
  entries: [Uint8Array, { fingerprint: number; path: number[] }][] | undefined,
  keyHash: Uint8Array,
  fingerprint: number,
): OwnBitcoinKey | undefined {
  const account = bip32Path(bitcoinAccountPath(keys.bitcoinNetwork));
  for (const [publicKey, { fingerprint: fp, path }] of entries ?? []) {
    if (fp !== fingerprint || path.length !== 5 || !account.every((step, i) => path[i] === step)) continue;
    const [chain, index] = [path[3], path[4]];
    if ((chain !== 0 && chain !== 1) || index >= 0x80000000) continue;
    const derived = keys.bitcoinAddress(chain, index).publicKey;
    if (equalBytes(derived, publicKey) && equalBytes(hash160(derived), keyHash))
      return { chain, index, publicKey: derived };
  }
  return undefined;
}

function derivation(
  keys: KeyRing,
  key: OwnBitcoinKey,
  fingerprint: number,
): [Uint8Array, { fingerprint: number; path: number[] }] {
  return [
    key.publicKey,
    { fingerprint, path: bip32Path(bitcoinAddressPath(keys.bitcoinNetwork, key.chain, key.index)) },
  ];
}

function masterFingerprint(keys: KeyRing): number {
  return parseInt(keys.bitcoinAccount().fingerprint, 16);
}

function satoshis(value: unknown, label: string): bigint {
  const amount = typeof value === 'bigint' ? value : Number.isSafeInteger(value) ? BigInt(value as number) : undefined;
  if (amount === undefined || amount <= 0n || amount > 2_100_000_000_000_000n) {
    throw new WalletError('invalid-amount', `Invalid ${label}: ${String(value)}`);
  }
  return amount;
}

function feeRate(value: unknown): bigint {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > MAX_FEE_RATE) {
    throw new WalletError('invalid-fee-rate', `Invalid fee rate: ${String(value)}`);
  }
  return BigInt(Math.ceil(value));
}

/** Bitcoin Core's dust limit at 3 sat/vB: segwit outputs 67 vB spend size, all others 148 vB. */
function dustThreshold(script: Uint8Array): bigint {
  const witness =
    script.length >= 4 &&
    script.length <= 42 &&
    (script[0] === 0x00 || (script[0] >= 0x51 && script[0] <= 0x60)) &&
    script[1] === script.length - 2;
  const outputSize = 8 + 1 + script.length;
  return BigInt((outputSize + (witness ? 67 : 148)) * 3);
}
