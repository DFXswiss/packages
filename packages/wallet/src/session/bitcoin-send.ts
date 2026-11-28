import type {
  WalletApi,
  WalletBitcoinAccount,
  WalletBitcoinBlockchain,
  WalletBitcoinFeeRateChoice,
  WalletBitcoinFees,
  WalletBitcoinPrepare,
  WalletBitcoinPrepareRequest,
  WalletBitcoinSubmitResponse,
} from '@dfx.swiss/core';
import { WALLET_API_BITCOIN_BLOCKCHAINS } from '../config/wallet-api';
import { BITCOIN_ADDRESS_SCAN, findBitcoinKey, KeyRing } from '../derivation/keyring';
import type { BitcoinPsbtSummary, SignedBitcoinTransaction } from '../signing/bitcoin-psbt';
import { bitcoinOutputScript, describeBitcoinPsbt, signBitcoinPsbt } from '../signing/bitcoin-psbt';
import { bytesToHex } from '../util/bytes';
import { WalletError } from '../util/errors';

/** A payment the user asked for; amounts in integer satoshis. */
export interface BitcoinSendParams {
  /** Own P2WPKH addresses whose UTXOs may be spent (1..50). */
  addresses: string[];
  /** Own address that receives the change. */
  changeAddress: string;
  destination: string;
  /** Satoshis, or `max` to send everything spendable without change. */
  amount: number | bigint | 'max';
  /** `fast`, `normal` or `slow`; ignored when `feeRateSatPerVb` is set. */
  feeRate?: WalletBitcoinFeeRateChoice;
  /** Explicit fee rate, 1..1000 sat/vB. */
  feeRateSatPerVb?: number;
  rbf?: boolean;
  includeUnconfirmed?: boolean;
  allowOwnDestination?: boolean;
  /** Refuses a prepared transaction whose fee is higher, in satoshis. */
  maxFee?: number | bigint;
}

/** What the server prepared, checked against the request and the PSBT itself. */
export interface PreparedBitcoinSend {
  blockchain: WalletBitcoinBlockchain;
  request: WalletBitcoinPrepareRequest;
  prepare: WalletBitcoinPrepare;
  /** Decoded from the PSBT on this device; this is what the confirmation screen shows. */
  summary: BitcoinPsbtSummary;
}

export interface BitcoinSendResult extends WalletBitcoinSubmitResponse {
  prepared: PreparedBitcoinSend;
  signed: SignedBitcoinTransaction;
}

export interface BitcoinSendOptions {
  /** `DfxApiClient.wallet`, or a `WalletApi` of its own. */
  api: WalletApi;
  /** The unlocked ring; its Bitcoin network selects the wallet-api blockchain. */
  keys: KeyRing;
  /** Wallet session token; default the token stored on `api`. */
  token?: string;
  /** How many receive and change indexes are searched for own addresses (default 100). */
  scan?: number;
}

/**
 * Bitcoin on-chain send over wallet-api: `prepare` on the server, verify and describe the PSBT on this device,
 * sign input `i` with the key of `inputs[i].address`, then `submit`. The server never sees a key; the device
 * never signs a PSBT whose inputs, outputs, fee or txid differ from what the server reported and the user asked.
 */
export class BitcoinSend {
  readonly blockchain: WalletBitcoinBlockchain;

  constructor(private readonly options: BitcoinSendOptions) {
    this.blockchain = WALLET_API_BITCOIN_BLOCKCHAINS[options.keys.bitcoinNetwork];
  }

  /** Balance, UTXOs and history of up to 50 own addresses. */
  account(addresses: string[], historyLimit?: number): Promise<WalletBitcoinAccount> {
    return this.options.api.bitcoinAccount(
      this.blockchain,
      historyLimit !== undefined ? { addresses, historyLimit } : { addresses },
      this.options.token,
    );
  }

  fees(): Promise<WalletBitcoinFees> {
    return this.options.api.bitcoinFees(this.blockchain, this.options.token);
  }

  /** Prepares the payment on the server and verifies the answer on this device. */
  async prepare(params: BitcoinSendParams): Promise<PreparedBitcoinSend> {
    const request = prepareRequest(params);
    const prepare = await this.options.api.bitcoinPrepare(this.blockchain, request, this.options.token);
    const summary = verifyBitcoinPrepare(this.options.keys, prepare, {
      blockchain: this.blockchain,
      addresses: params.addresses,
      changeAddress: params.changeAddress,
      destination: params.destination,
      amount: params.amount === 'max' ? 'max' : toSats(params.amount, 'amount'),
      maxFee: params.maxFee === undefined ? undefined : toSats(params.maxFee, 'maxFee'),
      scan: this.options.scan,
    });
    return { blockchain: this.blockchain, request, prepare, summary };
  }

  /** Signs the verified PSBT locally; the signed transaction must have the prepared txid. */
  sign(prepared: PreparedBitcoinSend): SignedBitcoinTransaction {
    const signed = signBitcoinPsbt(this.options.keys, prepared.prepare.psbt, this.options.scan);
    if (signed.txid !== prepared.prepare.txid.toLowerCase()) {
      throw new WalletError('txid-mismatch', 'The signed transaction differs from the prepared one');
    }
    return signed;
  }

  /** Submits the signed transaction (raw hex). A repeat answers `alreadySubmitted: true`. */
  submit(prepared: PreparedBitcoinSend, signed: SignedBitcoinTransaction): Promise<WalletBitcoinSubmitResponse> {
    return this.options.api.bitcoinSubmit(
      prepared.blockchain,
      { prepareId: prepared.prepare.prepareId, transactionHex: signed.hex },
      this.options.token,
    );
  }

  /**
   * prepare → verify → `confirm` (the app shows `prepared.summary`; `false` cancels) → sign → submit.
   * Throws `WalletError('send-cancelled')` when the user declines.
   */
  async send(
    params: BitcoinSendParams,
    confirm: (prepared: PreparedBitcoinSend) => boolean | Promise<boolean> = () => true,
  ): Promise<BitcoinSendResult> {
    const prepared = await this.prepare(params);
    if (!(await confirm(prepared))) throw new WalletError('send-cancelled', 'The payment was not confirmed');
    const signed = this.sign(prepared);
    const result = await this.submit(prepared, signed);
    if (result.txid.toLowerCase() !== signed.txid) {
      throw new WalletError('txid-mismatch', 'The server reported another transaction id');
    }
    return { ...result, prepared, signed };
  }
}

export interface BitcoinPrepareExpectation {
  blockchain: WalletBitcoinBlockchain;
  addresses: string[];
  changeAddress: string;
  destination: string;
  amount: bigint | 'max';
  maxFee?: bigint;
  scan?: number;
}

/**
 * Checks a wallet-api prepare answer before anything is signed and returns the PSBT summary. Refuses (code
 * `prepare-mismatch`, or the PSBT codes of `describeBitcoinPsbt`) when the PSBT spends anything but the listed
 * own outputs, pays anything but the destination and the own change address, or when its amounts or fee differ
 * from the reported ones or from the request.
 */
export function verifyBitcoinPrepare(
  keys: KeyRing,
  prepare: WalletBitcoinPrepare,
  expected: BitcoinPrepareExpectation,
): BitcoinPsbtSummary {
  const scan = expected.scan ?? BITCOIN_ADDRESS_SCAN;
  const network = keys.bitcoinNetwork;
  const fail = (message: string): never => {
    throw new WalletError('prepare-mismatch', message);
  };

  if (prepare.blockchain !== expected.blockchain) {
    fail(`Prepared for ${prepare.blockchain}, not ${expected.blockchain}`);
  }
  const destinationScript = bytesToHex(bitcoinOutputScript(expected.destination, network));
  const changeScript = bytesToHex(bitcoinOutputScript(expected.changeAddress, network));
  if (!findBitcoinKey(keys, expected.changeAddress, scan)) {
    fail('The change address is not an address of this wallet');
  }
  if (bytesToHex(bitcoinOutputScript(prepare.destination, network)) !== destinationScript) {
    fail('The prepared destination is not the requested one');
  }

  const summary = describeBitcoinPsbt(keys, prepare.psbt, scan);

  // Inputs: same outpoints and values as reported, each signed with the key of its reported own address.
  if (summary.inputs.length !== prepare.inputs.length || summary.inputs.length === 0) {
    fail('The PSBT inputs differ from the reported inputs');
  }
  const allowed = new Set(expected.addresses.map((address) => bytesToHex(bitcoinOutputScript(address, network))));
  let totalInput = 0n;
  summary.inputs.forEach((input, i) => {
    const reported = prepare.inputs[i];
    if (input.txid !== reported.txid.toLowerCase() || input.vout !== reported.vout) {
      fail(`Input ${i} is not the reported outpoint`);
    }
    if (input.amount !== toSats(reported.value, `input ${i} value`)) fail(`Input ${i} has another value`);
    if (!allowed.has(bytesToHex(bitcoinOutputScript(reported.address, network)))) {
      fail(`Input ${i} spends an address that was not offered`);
    }
    const key = findBitcoinKey(keys, reported.address, scan);
    if (!key || keys.bitcoinAddress(key.chain, key.index).path !== input.path) {
      fail(`Input ${i} is not held by the key of ${reported.address}`);
    }
    totalInput += input.amount;
  });
  if (totalInput !== toSats(prepare.totalInput, 'totalInput')) {
    fail('The input total differs from the reported one');
  }

  // Outputs: exactly the reported ones; one to the destination, at most one to the own change address.
  if (summary.outputs.length !== prepare.outputs.length) fail('The PSBT outputs differ from the reported outputs');
  let destinationCount = 0;
  let destinationAmount = 0n;
  let changeCount = 0;
  let changeAmount = 0n;
  summary.outputs.forEach((output, i) => {
    const reported = prepare.outputs[i];
    if (output.script !== bytesToHex(bitcoinOutputScript(reported.address, network))) {
      fail(`Output ${i} pays another address than reported`);
    }
    if (output.amount !== toSats(reported.value, `output ${i} value`)) fail(`Output ${i} has another value`);
    if (reported.kind === 'destination' && output.script === destinationScript) {
      destinationCount++;
      destinationAmount += output.amount;
    } else if (reported.kind === 'change' && output.script === changeScript) {
      changeCount++;
      changeAmount += output.amount;
    } else {
      fail(`Output ${i} is neither the destination nor the change address`);
    }
  });
  if (destinationCount !== 1) fail('The PSBT must pay the destination exactly once');
  if (changeCount > 1) fail('The PSBT has more than one change output');
  if (destinationAmount !== toSats(prepare.amount, 'amount')) {
    fail('The destination amount differs from the reported one');
  }
  if (expected.amount !== 'max' && destinationAmount !== expected.amount) {
    fail('The destination amount differs from the requested amount');
  }
  if (expected.amount === 'max' && changeCount > 0) fail('A max payment must not have change');
  if (changeAmount !== (changeCount ? toSats(prepare.change, 'change') : 0n)) {
    fail('The change amount differs from the reported');
  }

  if (summary.fee !== toSats(prepare.fee, 'fee', true)) fail('The fee differs from the reported fee');
  if (expected.maxFee !== undefined && summary.fee > expected.maxFee) {
    fail(`The fee of ${summary.fee} sat exceeds the limit of ${expected.maxFee} sat`);
  }
  return summary;
}

function prepareRequest(params: BitcoinSendParams): WalletBitcoinPrepareRequest {
  const base = {
    addresses: params.addresses,
    changeAddress: params.changeAddress,
    destination: params.destination,
    amount: params.amount === 'max' ? 'max' : toSats(params.amount, 'amount').toString(),
    ...(params.rbf !== undefined ? { rbf: params.rbf } : {}),
    ...(params.includeUnconfirmed !== undefined ? { includeUnconfirmed: params.includeUnconfirmed } : {}),
    ...(params.allowOwnDestination !== undefined ? { allowOwnDestination: params.allowOwnDestination } : {}),
  };
  if (params.feeRateSatPerVb !== undefined) {
    const rate = params.feeRateSatPerVb;
    if (!Number.isSafeInteger(rate) || rate < 1 || rate > 1000) {
      throw new WalletError('invalid-fee-rate', `Invalid fee rate: ${String(rate)}`);
    }
    return { ...base, feeRateSatPerVb: rate };
  }
  return params.feeRate !== undefined ? { ...base, feeRate: params.feeRate } : base;
}

function toSats(value: unknown, label: string, allowZero = false): bigint {
  let amount: bigint | undefined;
  if (typeof value === 'bigint') amount = value;
  else if (typeof value === 'number' && Number.isSafeInteger(value)) amount = BigInt(value);
  else if (typeof value === 'string' && /^(?:0|[1-9]\d*)$/.test(value)) amount = BigInt(value);
  if (amount === undefined || amount < (allowZero ? 0n : 1n) || amount > 2_100_000_000_000_000n) {
    throw new WalletError('invalid-amount', `Invalid ${label}: ${String(value)}`);
  }
  return amount;
}
