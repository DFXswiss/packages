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
import { ApiException } from '@dfx.swiss/core';
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
  /**
   * `fast`, `normal` or `slow` (default `normal`, always sent explicitly); ignored when `feeRateSatPerVb` is set.
   * The fee is bounded on this device by the rate `fees()` reports for the choice.
   */
  feeRate?: WalletBitcoinFeeRateChoice;
  /** Explicit fee rate, 1..1000 sat/vB; the prepared transaction must use exactly this rate. */
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
  /** The fee rate bound the fee was checked against: the requested rate (`exact`) or the `fees()` rate. */
  feeRate: BitcoinFeeRateBound;
  /** Virtual size of the signed transaction, estimated on this device from the PSBT. */
  vsize: BitcoinVsizeEstimate;
}

export interface BitcoinFeeRateBound {
  /** sat/vB */
  satPerVb: number;
  /** `true`: the prepared rate must equal `satPerVb`; `false`: it must not exceed it. */
  exact: boolean;
}

/** vsize range of a transaction whose inputs are all P2WPKH: `max` with 72-byte, `min` with 71-byte signatures. */
export interface BitcoinVsizeEstimate {
  min: number;
  max: number;
}

/** Remainder that wallet-api may add to the fee instead of creating change (below the 294 sat P2WPKH dust limit). */
export const MAX_CHANGE_ADDED_TO_FEE = 293;

/** Highest fee rate wallet-api accepts, in sat/vB. */
export const MAX_PREPARE_FEE_RATE = 1000;

/**
 * Submitting failed after the transaction was signed. `prepared` and `signed` are kept so the app can call
 * `BitcoinSend.submit(error.prepared, error.signed)` again (same `prepareId`, idempotent on wallet-api); it must
 * never start a new `send()` or `prepare()` for the same payment, which would spend other UTXOs and pay twice.
 *
 * - `submit-unknown`: the outcome is unknown (network error, 5xx, or the server answered with another txid);
 *   the transaction may have been broadcast. Resubmit, or look for `signed.txid` on chain.
 * - `submit-refused`: wallet-api refused with a 4xx, and no earlier attempt for this `prepareId` (in this
 *   `BitcoinSend`, or marked with `{ outcomeUnknown: true }`) had an unknown outcome; nothing was broadcast.
 *   After any lost answer for the same `prepareId`, a 4xx (e.g. 410 `PrepareExpired`, 404 `PrepareNotFound`)
 *   is reported as `submit-unknown`, because the earlier attempt may have broadcast the transaction.
 */
export class BitcoinSubmitError extends WalletError {
  /** The submit answer, when the server answered with another txid. */
  readonly response?: WalletBitcoinSubmitResponse;

  constructor(
    code: 'submit-unknown' | 'submit-refused',
    message: string,
    readonly prepared: PreparedBitcoinSend,
    readonly signed: SignedBitcoinTransaction,
    options?: { cause?: unknown; response?: WalletBitcoinSubmitResponse },
  ) {
    super(code, message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.response = options?.response;
  }
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
  /** Submit attempts on network errors, 408, 429 and 5xx, within the prepare lifetime (default 6). */
  submitAttempts?: number;
  /** Wait before retry `attempt + 1` of a submit (default 500 ms doubling, at most 8 s). */
  submitBackoffMs?: (attempt: number) => number;
  /** Clock for the prepare expiry (default `Date.now`). */
  now?: () => number;
}

/**
 * Bitcoin on-chain send over wallet-api: `prepare` on the server, verify and describe the PSBT on this device,
 * sign input `i` with the key of `inputs[i].address`, then `submit`. The server never sees a key; the device
 * never signs a PSBT whose inputs, outputs or txid differ from what the server reported and the user asked, or
 * whose fee is above the requested rate (or the `fees()` rate of the chosen `fast`/`normal`/`slow`) times the
 * vsize estimated on this device, plus a reported dust remainder below 294 sat.
 *
 * A failed submit is never answered with a new prepare: `submit` retries the same `prepareId`, and when the
 * outcome stays unknown it throws {@link BitcoinSubmitError} with `prepared` and `signed`, so the app calls
 * `submit()` again instead of `send()`.
 */
export class BitcoinSend {
  readonly blockchain: WalletBitcoinBlockchain;
  /** `prepareId`s with an attempt whose outcome is unknown: a later 4xx for them proves nothing. */
  private readonly unknownOutcomes = new Set<string>();

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

  /**
   * Prepares the payment on the server and verifies the answer on this device. For `fast`/`normal`/`slow` the
   * current `fees()` rate of that choice is fetched alongside and bounds the fee.
   */
  async prepare(params: BitcoinSendParams): Promise<PreparedBitcoinSend> {
    const request = prepareRequest(params);
    const choice = request.feeRateSatPerVb === undefined ? request.feeRate : undefined;
    const [fees, prepare] = await Promise.all([
      choice !== undefined ? this.fees() : Promise.resolve(undefined),
      this.options.api.bitcoinPrepare(this.blockchain, request, this.options.token),
    ]);
    const feeRate: BitcoinFeeRateBound =
      choice !== undefined
        ? { satPerVb: feeRateOfChoice(fees, choice), exact: false }
        : { satPerVb: request.feeRateSatPerVb as number, exact: true };
    const summary = verifyBitcoinPrepare(this.options.keys, prepare, {
      blockchain: this.blockchain,
      addresses: params.addresses,
      changeAddress: params.changeAddress,
      destination: params.destination,
      amount: params.amount === 'max' ? 'max' : toSats(params.amount, 'amount'),
      feeRate,
      maxFee: params.maxFee === undefined ? undefined : toSats(params.maxFee, 'maxFee'),
      scan: this.options.scan,
    });
    return { blockchain: this.blockchain, request, prepare, summary, feeRate, vsize: estimateBitcoinVsize(summary) };
  }

  /** Signs the verified PSBT locally; the signed transaction must have the prepared txid. */
  sign(prepared: PreparedBitcoinSend): SignedBitcoinTransaction {
    const signed = signBitcoinPsbt(this.options.keys, prepared.prepare.psbt, this.options.scan);
    if (signed.txid !== prepared.prepare.txid.toLowerCase()) {
      throw new WalletError('txid-mismatch', 'The signed transaction differs from the prepared one');
    }
    return signed;
  }

  /**
   * Submits the signed transaction (raw hex) under the same `prepareId`; wallet-api answers a repeat with
   * `alreadySubmitted: true` and broadcasts at most once. Retries network errors (status 0), 408, 429 and 5xx with
   * backoff, at most `submitAttempts` times and only while the prepare is valid. Throws {@link BitcoinSubmitError}:
   * `submit-refused` for a 4xx when no attempt for this `prepareId` had an unknown outcome before, `submit-unknown`
   * when the outcome stays unknown, the server answers with another txid, or a 4xx follows an unknown outcome.
   * On either, call `submit(error.prepared, error.signed)` again, never `send()`.
   *
   * Unknown outcomes are remembered per `prepareId` in this instance. When resuming with a new instance (e.g.
   * after a reload), pass `{ outcomeUnknown: true }` if an earlier attempt ended in `submit-unknown`.
   */
  async submit(
    prepared: PreparedBitcoinSend,
    signed: SignedBitcoinTransaction,
    submitOptions?: { outcomeUnknown?: boolean },
  ): Promise<WalletBitcoinSubmitResponse> {
    const attempts = Math.max(1, Math.floor(this.options.submitAttempts ?? 6));
    const backoff = this.options.submitBackoffMs ?? ((attempt: number) => Math.min(500 * 2 ** attempt, 8000));
    const now = this.options.now ?? Date.now;
    const expiresAt = Date.parse(prepared.prepare.expiresAt);
    const prepareId = prepared.prepare.prepareId;
    if (submitOptions?.outcomeUnknown === true) this.unknownOutcomes.add(prepareId);
    let outcomeUnknown = this.unknownOutcomes.has(prepareId);

    for (let attempt = 0; ; attempt++) {
      let result: WalletBitcoinSubmitResponse;
      try {
        result = await this.options.api.bitcoinSubmit(
          prepared.blockchain,
          { prepareId, transactionHex: signed.hex },
          this.options.token,
        );
      } catch (error) {
        const status = error instanceof ApiException ? error.statusCode : undefined;
        const retryable = status !== undefined && (status === 0 || status === 408 || status === 429 || status >= 500);
        if (status !== undefined && !retryable) {
          // A definite refusal; after an earlier lost answer for this prepareId (this call or an earlier one) it
          // does not prove that nothing was broadcast.
          if (!outcomeUnknown) {
            throw new BitcoinSubmitError('submit-refused', 'wallet-api refused the transaction', prepared, signed, {
              cause: error,
            });
          }
          throw new BitcoinSubmitError(
            'submit-unknown',
            'The transaction may have been broadcast; submit it again, do not prepare a new one',
            prepared,
            signed,
            { cause: error },
          );
        }
        // Network error, 5xx or anything that is not an API answer: the server may have broadcast it.
        outcomeUnknown = true;
        this.unknownOutcomes.add(prepareId);
        const wait = Math.max(0, backoff(attempt));
        const expired = !Number.isFinite(expiresAt) || now() + wait >= expiresAt;
        if (!retryable || attempt + 1 >= attempts || expired) {
          throw new BitcoinSubmitError(
            'submit-unknown',
            'The transaction may have been broadcast; submit it again, do not prepare a new one',
            prepared,
            signed,
            { cause: error },
          );
        }
        if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
        continue;
      }
      if (typeof result?.txid !== 'string' || result.txid.toLowerCase() !== signed.txid) {
        this.unknownOutcomes.add(prepareId);
        throw new BitcoinSubmitError(
          'submit-unknown',
          `wallet-api accepted the submit but reported another transaction id; look for ${signed.txid} on chain`,
          prepared,
          signed,
          { response: result },
        );
      }
      this.unknownOutcomes.delete(prepareId);
      return result;
    }
  }

  /**
   * prepare → verify → `confirm` (the app shows `prepared.summary`, including the fee; `false` cancels) → sign →
   * submit. `confirm` is required: nothing is signed without the user seeing the fee. Throws
   * `WalletError('send-cancelled')` when the user declines. Once signed, a failure is a {@link BitcoinSubmitError}
   * carrying `prepared` and `signed`: the app must then call `submit()` with them and must not repeat `send()`,
   * because a new prepare spends other UTXOs and can pay a second time.
   */
  async send(
    params: BitcoinSendParams,
    confirm: (prepared: PreparedBitcoinSend) => boolean | Promise<boolean>,
  ): Promise<BitcoinSendResult> {
    if (typeof confirm !== 'function') {
      throw new WalletError('confirm-required', 'send() needs a confirm callback that shows the payment');
    }
    const prepared = await this.prepare(params);
    if ((await confirm(prepared)) !== true) throw new WalletError('send-cancelled', 'The payment was not confirmed');
    const signed = this.sign(prepared);
    const result = await this.submit(prepared, signed);
    return { ...result, prepared, signed };
  }
}

export interface BitcoinPrepareExpectation {
  blockchain: WalletBitcoinBlockchain;
  addresses: string[];
  changeAddress: string;
  destination: string;
  amount: bigint | 'max';
  /** The requested rate (`exact`), or the `fees()` rate of the chosen `fast`/`normal`/`slow`. */
  feeRate: BitcoinFeeRateBound;
  maxFee?: bigint;
  scan?: number;
}

/**
 * Checks a wallet-api prepare answer before anything is signed and returns the PSBT summary. Refuses (code
 * `prepare-mismatch`, or the PSBT codes of `describeBitcoinPsbt`) when the PSBT spends anything but the listed
 * own outputs, pays anything but the destination and the own change address, when its amounts or fee differ
 * from the reported ones or from the request, when the reported `feeRate`, `vsize` or `changeAddedToFee` do not
 * fit the PSBT and the request, or when the fee exceeds `ceil(rate × vsize) + changeAddedToFee` with the vsize
 * estimated on this device.
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
  if (changeAmount !== toSats(prepare.change, 'change', true)) {
    fail('The change amount differs from the reported');
  }

  if (summary.fee !== toSats(prepare.fee, 'fee', true)) fail('The fee differs from the reported fee');

  // Fee rate: the reported rate must be the requested one, or at most the fees() rate of the chosen class.
  const bound = expected.feeRate;
  if (!bound || !Number.isFinite(bound.satPerVb) || bound.satPerVb <= 0) {
    fail('No fee rate to check the fee against');
  }
  const rate = prepare.feeRate;
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0 || rate > MAX_PREPARE_FEE_RATE) {
    fail(`Invalid reported fee rate: ${String(rate)}`);
  }
  if (bound.exact ? rate !== bound.satPerVb : rate > bound.satPerVb) {
    fail(`The fee rate of ${rate} sat/vB is not the requested ${bound.satPerVb} sat/vB`);
  }

  // Dust remainder: only when the change was dropped, never for max, never 294 sat or more.
  const added = prepare.changeAddedToFee;
  if (!Number.isSafeInteger(added) || added < 0 || added > MAX_CHANGE_ADDED_TO_FEE) {
    fail(`Invalid changeAddedToFee: ${String(added)}`);
  }
  if (added > 0 && (changeCount > 0 || expected.amount === 'max')) {
    fail('A remainder went into the fee although there is no dropped change');
  }

  // vsize: estimated here from the PSBT; the reported one must fit, and the fee must fit the rate.
  const vsize = estimateBitcoinVsize(summary);
  if (!Number.isSafeInteger(prepare.vsize) || prepare.vsize < vsize.min - 1 || prepare.vsize > vsize.max + 1) {
    fail(`The reported vsize of ${String(prepare.vsize)} vB does not fit the PSBT (${vsize.min}..${vsize.max} vB)`);
  }
  const allowedFee = BigInt(Math.ceil(rate * vsize.max)) + BigInt(added);
  if (summary.fee > allowedFee) {
    fail(
      `The fee of ${summary.fee} sat exceeds ${allowedFee} sat (${rate} sat/vB × ${vsize.max} vB + ${added} sat remainder)`,
    );
  }
  const reportedFee = BigInt(Math.ceil(rate * (prepare.vsize + 1))) + BigInt(added);
  if (summary.fee > reportedFee) fail('The fee does not fit the reported fee rate and vsize');

  if (expected.maxFee !== undefined && summary.fee > expected.maxFee) {
    fail(`The fee of ${summary.fee} sat exceeds the limit of ${expected.maxFee} sat`);
  }
  return summary;
}

/**
 * vsize of the signed transaction of a PSBT whose inputs are all P2WPKH (which `describeBitcoinPsbt` enforces):
 * 41 bytes plus a 108 (or 107) weight-unit witness per input, every output from its script, version, locktime,
 * counts and the segwit marker. `max` assumes 72-byte signatures, `min` 71-byte ones.
 */
export function estimateBitcoinVsize(summary: Pick<BitcoinPsbtSummary, 'inputs' | 'outputs'>): BitcoinVsizeEstimate {
  const inputs = summary.inputs.length;
  const outputBytes = summary.outputs.reduce((sum, output) => {
    const length = output.script.length / 2;
    return sum + 8 + varIntSize(length) + length;
  }, 0);
  const baseBytes = 4 + varIntSize(inputs) + 41 * inputs + varIntSize(summary.outputs.length) + outputBytes + 4;
  // Witness per input: item count, signature (length + DER + sighash byte), public key (length + 33).
  const witness = (signature: number) => 2 + inputs * (1 + 1 + signature + 1 + 33);
  return {
    min: Math.floor((baseBytes * 4 + witness(71)) / 4),
    max: Math.ceil((baseBytes * 4 + witness(72)) / 4),
  };
}

function varIntSize(n: number): number {
  return n < 0xfd ? 1 : n <= 0xffff ? 3 : 5;
}

function feeRateOfChoice(fees: WalletBitcoinFees | undefined, choice: WalletBitcoinFeeRateChoice): number {
  const rate = fees?.rates?.[choice];
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    throw new WalletError('invalid-fee-rate', `wallet-api reported no ${choice} fee rate`);
  }
  return Math.min(rate, MAX_PREPARE_FEE_RATE);
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
  // Always explicit, so the device bounds the fee by the same class the server uses.
  const choice = params.feeRate ?? 'normal';
  if (choice !== 'fast' && choice !== 'normal' && choice !== 'slow') {
    throw new WalletError('invalid-fee-rate', `Invalid fee rate choice: ${String(choice)}`);
  }
  return { ...base, feeRate: choice };
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
