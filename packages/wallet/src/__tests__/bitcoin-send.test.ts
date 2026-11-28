import type { WalletApi, WalletBitcoinPrepare } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import { Transaction } from '@scure/btc-signer';
import { base64 } from '@scure/base';
import { KeyRing } from '../derivation/keyring';
import { BitcoinSend, BitcoinSubmitError, estimateBitcoinVsize, verifyBitcoinPrepare } from '../session/bitcoin-send';
import { bitcoinOutputScript, btcSignerNetwork, signBitcoinPsbt } from '../signing/bitcoin-psbt';
import { WalletError } from '../util/errors';

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const RECEIVE0 = 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk';
const RECEIVE1 = 'bcrt1qd7spv5q28348xl4myc8zmh983w5jx32cs707jh';
const CHANGE0 = 'bcrt1q9u62588spffmq4dzjxsr5l297znf3z6jkgnhsw';
const DESTINATION = 'bcrt1p8wpt9v4frpf3tkn0srd97pksgsxc5hs52lafxwru9kgeephvs7rqjeprhg';
const TXID_A = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const TXID_B = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
const TOTAL_INPUT = 65_000;
/** Before the fixture's `expiresAt`. */
const NOW = () => Date.parse('2026-11-28T00:00:00.000Z');

function ring(): KeyRing {
  return KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'stg' });
}

interface ServerPrepareOptions {
  /** Where the PSBT really sends the change. */
  changeTo?: string;
  /** Fee in the PSBT and in the report; the change (or, for max, the amount) absorbs the difference. */
  fee?: number;
  feeRate?: number;
  vsize?: number;
  changeAddedToFee?: number;
  /** Everything to the destination, no change output. */
  max?: boolean;
}

/**
 * A prepare answer the way wallet-api builds it: PSBT v0, tx v2, witnessUtxo, no BIP-32 paths. The default is
 * honest: 2 P2WPKH inputs, a P2TR destination and a P2WPKH change, 221 vB at 2 sat/vB = 442 sat (max: 190 vB,
 * 380 sat). Every other option keeps the report internally consistent with the PSBT.
 */
function serverPrepare(options: ServerPrepareOptions = {}): WalletBitcoinPrepare {
  const network = btcSignerNetwork('regtest');
  const max = options.max ?? false;
  const fee = options.fee ?? (max ? 380 : 442);
  const amount = max ? TOTAL_INPUT - fee : 50_000;
  const change = max ? 0 : TOTAL_INPUT - amount - fee;
  const tx = new Transaction();
  tx.addInput({
    txid: TXID_A,
    index: 1,
    sequence: 0xfffffffd,
    witnessUtxo: { script: bitcoinOutputScript(RECEIVE0, 'regtest'), amount: 40_000n },
  });
  tx.addInput({
    txid: TXID_B,
    index: 0,
    sequence: 0xfffffffd,
    witnessUtxo: { script: bitcoinOutputScript(RECEIVE1, 'regtest'), amount: 25_000n },
  });
  tx.addOutputAddress(DESTINATION, BigInt(amount), network);
  if (!max) tx.addOutputAddress(options.changeTo ?? CHANGE0, BigInt(change), network);
  const psbt = base64.encode(tx.toPSBT(0));
  return {
    prepareId: '44444444-4444-4444-8444-444444444444',
    expiresAt: '2026-11-28T00:10:00.000Z',
    blockchain: 'BitcoinRegtest',
    psbt,
    txid: signBitcoinPsbt(ring(), psbt).txid,
    destination: DESTINATION,
    amount,
    fee,
    feeRate: options.feeRate ?? 2,
    change,
    changeAddress: max ? null : CHANGE0,
    changeAddedToFee: options.changeAddedToFee ?? 0,
    vsize: options.vsize ?? (max ? 190 : 221),
    rbf: true,
    totalInput: TOTAL_INPUT,
    uneconomicalUtxos: 0,
    inputs: [
      { txid: TXID_A, vout: 1, value: 40_000, address: RECEIVE0 },
      { txid: TXID_B, vout: 0, value: 25_000, address: RECEIVE1 },
    ],
    outputs: max
      ? [{ address: DESTINATION, value: amount, kind: 'destination' }]
      : [
          { address: DESTINATION, value: amount, kind: 'destination' },
          { address: CHANGE0, value: change, kind: 'change' },
        ],
  };
}

/**
 * A max payment with 1 P2WPKH input (RECEIVE0) and 1 P2WPKH output (RECEIVE1): weight 437..438 WU, so the vsize is
 * 110 vB for both signature lengths (ceil(437 / 4) = ceil(438 / 4) = 110).
 */
interface SinglePrepareOptions {
  fee: number;
  feeRate: number;
  vsize?: number;
  input?: number;
}

function singlePrepare(options: SinglePrepareOptions): WalletBitcoinPrepare {
  const network = btcSignerNetwork('regtest');
  const input = options.input ?? 40_000;
  const amount = input - options.fee;
  const tx = new Transaction();
  tx.addInput({
    txid: TXID_A,
    index: 1,
    sequence: 0xfffffffd,
    witnessUtxo: { script: bitcoinOutputScript(RECEIVE0, 'regtest'), amount: BigInt(input) },
  });
  tx.addOutputAddress(RECEIVE1, BigInt(amount), network);
  const psbt = base64.encode(tx.toPSBT(0));
  return {
    prepareId: '55555555-5555-4555-8555-555555555555',
    expiresAt: '2026-11-28T00:10:00.000Z',
    blockchain: 'BitcoinRegtest',
    psbt,
    txid: signBitcoinPsbt(ring(), psbt).txid,
    destination: RECEIVE1,
    amount,
    fee: options.fee,
    feeRate: options.feeRate,
    change: 0,
    changeAddress: null,
    changeAddedToFee: 0,
    vsize: options.vsize ?? 110,
    rbf: true,
    totalInput: input,
    uneconomicalUtxos: 0,
    inputs: [{ txid: TXID_A, vout: 1, value: input, address: RECEIVE0 }],
    outputs: [{ address: RECEIVE1, value: amount, kind: 'destination' }],
  };
}

const SINGLE_PARAMS = {
  addresses: [RECEIVE0],
  changeAddress: CHANGE0,
  destination: RECEIVE1,
  amount: 'max' as const,
  allowOwnDestination: true,
};

function fakeApi(prepare: WalletBitcoinPrepare) {
  return {
    bitcoinPrepare: jest.fn(async () => prepare),
    bitcoinSubmit: jest.fn(async () => ({ txid: prepare.txid, prepareId: prepare.prepareId, alreadySubmitted: false })),
    bitcoinAccount: jest.fn(async () => ({})),
    bitcoinFees: jest.fn(async () => ({
      blockchain: 'BitcoinRegtest',
      source: 'esplora',
      unit: 'sat/vB',
      rates: { fast: 5, normal: 2, slow: 1 },
    })),
  };
}

function sender(api: ReturnType<typeof fakeApi>, overrides: { submitAttempts?: number; now?: () => number } = {}) {
  return new BitcoinSend({
    api: api as unknown as WalletApi,
    keys: ring(),
    submitBackoffMs: () => 0,
    now: NOW,
    ...overrides,
  });
}

const PARAMS = {
  addresses: [RECEIVE0, RECEIVE1],
  changeAddress: CHANGE0,
  destination: DESTINATION,
  amount: 50_000,
  feeRate: 'normal' as const,
};

const CONFIRM = () => true;

function expected(overrides: Partial<Parameters<typeof verifyBitcoinPrepare>[2]> = {}) {
  return {
    blockchain: 'BitcoinRegtest' as const,
    addresses: [RECEIVE0, RECEIVE1],
    changeAddress: CHANGE0,
    destination: DESTINATION,
    amount: 50_000n as bigint | 'max',
    feeRate: { satPerVb: 2, exact: false },
    ...overrides,
  };
}

function expectCode(run: () => unknown, code: string): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(WalletError);
    expect((error as WalletError).code).toBe(code);
    return;
  }
  throw new Error(`expected a WalletError with code ${code}, but nothing was thrown`);
}

async function submitError(run: Promise<unknown>): Promise<BitcoinSubmitError> {
  try {
    await run;
  } catch (error) {
    expect(error).toBeInstanceOf(BitcoinSubmitError);
    return error as BitcoinSubmitError;
  }
  throw new Error('expected a BitcoinSubmitError, but nothing was thrown');
}

describe('BitcoinSend', () => {
  it('prepares on the server, verifies, signs on the device and submits the raw transaction', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    const send = new BitcoinSend({ api: api as unknown as WalletApi, keys: ring(), token: 'wallet-token' });
    const confirm = jest.fn(() => true);

    const result = await send.send(PARAMS, confirm);

    expect(send.blockchain).toBe('BitcoinRegtest');
    expect(api.bitcoinPrepare).toHaveBeenCalledWith(
      'BitcoinRegtest',
      {
        addresses: [RECEIVE0, RECEIVE1],
        changeAddress: CHANGE0,
        destination: DESTINATION,
        amount: '50000',
        feeRate: 'normal',
      },
      'wallet-token',
    );
    expect(api.bitcoinFees).toHaveBeenCalledWith('BitcoinRegtest', 'wallet-token');
    expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ prepare }));
    expect(result.prepared.summary.fee).toBe(442n);
    expect(result.prepared.feeRate).toEqual({ satPerVb: 2, exact: false });
    expect(result.prepared.vsize).toEqual({ min: 220, max: 221 });
    expect(result.prepared.summary.inputs.map((input) => input.path)).toEqual(["m/84'/1'/0'/0/0", "m/84'/1'/0'/0/1"]);
    expect(result.signed.txid).toBe(prepare.txid);
    expect(api.bitcoinSubmit).toHaveBeenCalledWith(
      'BitcoinRegtest',
      { prepareId: prepare.prepareId, transactionHex: result.signed.hex },
      'wallet-token',
    );
    expect(result.alreadySubmitted).toBe(false);

    const tx = Transaction.fromRaw(Buffer.from(result.signed.hex, 'hex'));
    expect(tx.version).toBe(2);
    expect(tx.getInput(0).finalScriptWitness).toHaveLength(2);
    expect(tx.getInput(1).finalScriptWitness).toHaveLength(2);
    // The device estimate brackets the real size of the signed transaction.
    expect(tx.vsize).toBeGreaterThanOrEqual(result.prepared.vsize.min);
    expect(tx.vsize).toBeLessThanOrEqual(result.prepared.vsize.max);
  });

  it('sends max and explicit fee rates as wallet-api expects', async () => {
    const api = fakeApi(serverPrepare());
    const send = sender(api);
    // The honest answer has change, which a max payment must not have.
    const prepared = send.prepare({ ...PARAMS, amount: 'max', feeRate: undefined, feeRateSatPerVb: 3 });
    await expect(prepared).rejects.toMatchObject({ code: 'prepare-mismatch' });
    expect(api.bitcoinPrepare).toHaveBeenCalledWith(
      'BitcoinRegtest',
      expect.objectContaining({ amount: 'max', feeRateSatPerVb: 3 }),
      undefined,
    );
    const request = (api.bitcoinPrepare.mock.calls[0] as unknown[])[1] as Record<string, unknown>;
    expect(request).not.toHaveProperty('feeRate');
    expect(api.bitcoinFees).not.toHaveBeenCalled();
  });

  it('asks for the normal fee rate explicitly when none is chosen', async () => {
    const api = fakeApi(serverPrepare());
    await sender(api).prepare({ ...PARAMS, feeRate: undefined });
    expect(api.bitcoinPrepare).toHaveBeenCalledWith(
      'BitcoinRegtest',
      expect.objectContaining({ feeRate: 'normal' }),
      undefined,
    );
  });

  it('refuses an invalid explicit fee rate before calling the server', async () => {
    const api = fakeApi(serverPrepare());
    const send = sender(api);
    await expect(send.prepare({ ...PARAMS, feeRateSatPerVb: 0.5 })).rejects.toMatchObject({ code: 'invalid-fee-rate' });
    expect(api.bitcoinPrepare).not.toHaveBeenCalled();
  });

  it('requires a confirm callback', async () => {
    const api = fakeApi(serverPrepare());
    const send = sender(api);
    await expect(send.send(PARAMS, undefined as unknown as Parameters<BitcoinSend['send']>[1])).rejects.toMatchObject({
      code: 'confirm-required',
    });
    expect(api.bitcoinPrepare).not.toHaveBeenCalled();
  });

  it('does not sign or submit when the user declines', async () => {
    const api = fakeApi(serverPrepare());
    const send = sender(api);
    await expect(send.send(PARAMS, () => false)).rejects.toMatchObject({ code: 'send-cancelled' });
    expect(api.bitcoinSubmit).not.toHaveBeenCalled();
  });

  it('refuses to submit a transaction whose txid differs from the prepared one', async () => {
    const api = fakeApi({ ...serverPrepare(), txid: 'ff'.repeat(32) });
    const send = sender(api);
    await expect(send.send(PARAMS, CONFIRM)).rejects.toMatchObject({ code: 'txid-mismatch' });
    expect(api.bitcoinSubmit).not.toHaveBeenCalled();
  });

  it('refuses an inflated fee with a matching lower change before asking the user', async () => {
    // 1000 sat instead of 442: change lowered by the same amount, everything reported consistently.
    const api = fakeApi(serverPrepare({ fee: 1_000 }));
    const send = sender(api);
    const confirm = jest.fn(() => true);
    await expect(send.send(PARAMS, confirm)).rejects.toMatchObject({ code: 'prepare-mismatch' });
    await expect(send.send({ ...PARAMS, feeRate: undefined, feeRateSatPerVb: 2 }, confirm)).rejects.toMatchObject({
      code: 'prepare-mismatch',
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(api.bitcoinSubmit).not.toHaveBeenCalled();
  });

  it('bounds the fee by the fees() rate of the chosen class', async () => {
    // 4 sat/vB × 221 vB = 884 sat: within `fast` (5 sat/vB), above `normal` (2 sat/vB).
    const api = fakeApi(serverPrepare({ fee: 884, feeRate: 4 }));
    const send = sender(api);
    const prepared = await send.prepare({ ...PARAMS, feeRate: 'fast' });
    expect(prepared.summary.fee).toBe(884n);
    expect(prepared.feeRate).toEqual({ satPerVb: 5, exact: false });
    await expect(send.prepare(PARAMS)).rejects.toMatchObject({ code: 'prepare-mismatch' });
  });

  it('refuses when fees() reports no rate for the chosen class', async () => {
    const api = fakeApi(serverPrepare());
    api.bitcoinFees.mockResolvedValueOnce({
      blockchain: 'BitcoinRegtest',
      source: 'esplora',
      unit: 'sat/vB',
      rates: {} as never,
    });
    await expect(sender(api).prepare(PARAMS)).rejects.toMatchObject({ code: 'invalid-fee-rate' });
  });

  it('accepts a fees() class rate above 1000 sat/vB and bounds the fee by it, not by 1000', async () => {
    // fast = 1200 sat/vB: 1200 × 110 vB = 132000 sat. Only the explicit feeRateSatPerVb is limited to 1..1000.
    const highFees = (api: ReturnType<typeof fakeApi>) =>
      api.bitcoinFees.mockResolvedValue({
        blockchain: 'BitcoinRegtest',
        source: 'esplora',
        unit: 'sat/vB',
        rates: { fast: 1200, normal: 2, slow: 1 },
      });

    const honest = fakeApi(singlePrepare({ fee: 132_000, feeRate: 1200, input: 1_000_000 }));
    highFees(honest);
    const prepared = await sender(honest).prepare({ ...SINGLE_PARAMS, feeRate: 'fast' });
    expect(prepared.feeRate).toEqual({ satPerVb: 1200, exact: false });
    expect(prepared.summary.fee).toBe(132_000n);

    // A rate above the fees() class is still refused.
    const above = fakeApi(singlePrepare({ fee: 132_110, feeRate: 1201, input: 1_000_000 }));
    highFees(above);
    await expect(sender(above).prepare({ ...SINGLE_PARAMS, feeRate: 'fast' })).rejects.toMatchObject({
      code: 'prepare-mismatch',
    });

    // The explicit request rate stays limited to 1..1000, before the server is called.
    const explicit = fakeApi(singlePrepare({ fee: 132_000, feeRate: 1200, input: 1_000_000 }));
    const tooHigh = sender(explicit).prepare({ ...SINGLE_PARAMS, feeRateSatPerVb: 1001 });
    await expect(tooHigh).rejects.toMatchObject({ code: 'invalid-fee-rate' });
    expect(explicit.bitcoinPrepare).not.toHaveBeenCalled();
  });

  it('refuses a fractional fees() class rate', async () => {
    const api = fakeApi(serverPrepare());
    api.bitcoinFees.mockResolvedValueOnce({
      blockchain: 'BitcoinRegtest',
      source: 'esplora',
      unit: 'sat/vB',
      rates: { fast: 5, normal: 2.5, slow: 1 },
    });
    await expect(sender(api).prepare(PARAMS)).rejects.toMatchObject({ code: 'invalid-fee-rate' });
  });

  it('retries a lost submit answer with the same prepareId and never prepares again', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    api.bitcoinSubmit
      .mockRejectedValueOnce(new ApiException(0, 'Network error'))
      .mockResolvedValueOnce({ txid: prepare.txid, prepareId: prepare.prepareId, alreadySubmitted: true });
    const send = sender(api);

    const result = await send.send(PARAMS, CONFIRM);

    expect(result.alreadySubmitted).toBe(true);
    expect(result.txid).toBe(prepare.txid);
    expect(api.bitcoinPrepare).toHaveBeenCalledTimes(1);
    expect(api.bitcoinSubmit).toHaveBeenCalledTimes(2);
    const [first, second] = api.bitcoinSubmit.mock.calls as unknown as unknown[][];
    expect(second[1]).toEqual(first[1]);
    expect(second[1]).toEqual({ prepareId: prepare.prepareId, transactionHex: result.signed.hex });
  });

  it('throws submit-unknown with prepared and signed when the outcome stays unknown, and submit() resumes', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    api.bitcoinSubmit.mockRejectedValue(new ApiException(502, 'Bad gateway'));
    const send = sender(api, { submitAttempts: 3 });

    const error = await submitError(send.send(PARAMS, CONFIRM));

    expect(error.code).toBe('submit-unknown');
    expect(error.prepared.prepare.prepareId).toBe(prepare.prepareId);
    expect(error.signed.txid).toBe(prepare.txid);
    expect(api.bitcoinSubmit).toHaveBeenCalledTimes(3);
    expect(api.bitcoinPrepare).toHaveBeenCalledTimes(1);

    api.bitcoinSubmit.mockReset();
    api.bitcoinSubmit.mockResolvedValue({ txid: prepare.txid, prepareId: prepare.prepareId, alreadySubmitted: true });
    const resumed = await send.submit(error.prepared, error.signed);
    expect(resumed.alreadySubmitted).toBe(true);
    expect(api.bitcoinSubmit).toHaveBeenCalledWith(
      'BitcoinRegtest',
      { prepareId: prepare.prepareId, transactionHex: error.signed.hex },
      undefined,
    );
    expect(api.bitcoinPrepare).toHaveBeenCalledTimes(1);
  });

  it('does not retry after the prepare expired', async () => {
    const api = fakeApi(serverPrepare());
    api.bitcoinSubmit.mockRejectedValue(new ApiException(0, 'Network error'));
    const send = sender(api, { now: () => Date.parse('2026-11-28T00:10:00.000Z') });
    const error = await submitError(send.send(PARAMS, CONFIRM));
    expect(error.code).toBe('submit-unknown');
    expect(api.bitcoinSubmit).toHaveBeenCalledTimes(1);
  });

  it('reports a first-attempt 4xx as refused and a 4xx after a lost answer as unknown', async () => {
    const refusedApi = fakeApi(serverPrepare());
    refusedApi.bitcoinSubmit.mockRejectedValueOnce(new ApiException(400, 'Rejected'));
    const refused = await submitError(sender(refusedApi).send(PARAMS, CONFIRM));
    expect(refused.code).toBe('submit-refused');
    expect(refused.signed.hex).toMatch(/^[0-9a-f]+$/);
    expect(refusedApi.bitcoinSubmit).toHaveBeenCalledTimes(1);

    const unknownApi = fakeApi(serverPrepare());
    unknownApi.bitcoinSubmit
      .mockRejectedValueOnce(new ApiException(0, 'Network error'))
      .mockRejectedValueOnce(new ApiException(400, 'Rejected'));
    const unknown = await submitError(sender(unknownApi).send(PARAMS, CONFIRM));
    expect(unknown.code).toBe('submit-unknown');
    expect(unknownApi.bitcoinSubmit).toHaveBeenCalledTimes(2);
  });

  it('reports a 4xx on a resume after submit-unknown as unknown, not refused', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    api.bitcoinSubmit.mockRejectedValue(new ApiException(502, 'Bad gateway'));
    const send = sender(api, { submitAttempts: 2 });
    const first = await submitError(send.send(PARAMS, CONFIRM));
    expect(first.code).toBe('submit-unknown');

    api.bitcoinSubmit.mockReset();
    api.bitcoinSubmit.mockRejectedValueOnce(new ApiException(410, 'Prepare expired', 'PrepareExpired'));
    const expired = await submitError(send.submit(first.prepared, first.signed));
    expect(expired.code).toBe('submit-unknown');
    expect(api.bitcoinSubmit).toHaveBeenCalledTimes(1);

    api.bitcoinSubmit.mockRejectedValueOnce(new ApiException(404, 'Prepare not found', 'PrepareNotFound'));
    const notFound = await submitError(send.submit(first.prepared, first.signed));
    expect(notFound.code).toBe('submit-unknown');
    expect(api.bitcoinPrepare).toHaveBeenCalledTimes(1);
  });

  it('reports a 4xx on a resume after another txid as unknown', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    api.bitcoinSubmit
      .mockResolvedValueOnce({ txid: 'ee'.repeat(32), prepareId: prepare.prepareId, alreadySubmitted: false })
      .mockRejectedValueOnce(new ApiException(410, 'Prepare expired', 'PrepareExpired'));
    const send = sender(api);
    const first = await submitError(send.send(PARAMS, CONFIRM));
    expect(first.code).toBe('submit-unknown');
    const resumed = await submitError(send.submit(first.prepared, first.signed));
    expect(resumed.code).toBe('submit-unknown');
  });

  it('reports a 4xx on a resume as unknown in a new instance when the caller marks the outcome unknown', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    api.bitcoinSubmit.mockRejectedValue(new ApiException(0, 'Network error'));
    const first = await submitError(sender(api, { submitAttempts: 1 }).send(PARAMS, CONFIRM));
    expect(first.code).toBe('submit-unknown');

    api.bitcoinSubmit.mockReset();
    api.bitcoinSubmit.mockRejectedValue(new ApiException(410, 'Prepare expired', 'PrepareExpired'));
    const fresh = sender(api);
    const marked = await submitError(fresh.submit(first.prepared, first.signed, { outcomeUnknown: true }));
    expect(marked.code).toBe('submit-unknown');

    // Without the mark a new instance knows of no lost answer: a plain 4xx stays a refusal.
    const unmarked = await submitError(sender(api).submit(first.prepared, first.signed));
    expect(unmarked.code).toBe('submit-refused');
  });

  it('keeps prepared and signed when the server answers the submit with another txid', async () => {
    const prepare = serverPrepare();
    const api = fakeApi(prepare);
    const other = { txid: 'ee'.repeat(32), prepareId: prepare.prepareId, alreadySubmitted: false };
    api.bitcoinSubmit.mockResolvedValueOnce(other);
    const error = await submitError(sender(api).send(PARAMS, CONFIRM));
    expect(error.code).toBe('submit-unknown');
    expect(error.response).toEqual(other);
    expect(error.signed.txid).toBe(prepare.txid);
    expect(api.bitcoinSubmit).toHaveBeenCalledTimes(1);
  });

  it('picks the wallet-api blockchain from the ring network', () => {
    const testnet = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'testnet4' });
    const send = new BitcoinSend({ api: {} as WalletApi, keys: testnet });
    expect(send.blockchain).toBe('BitcoinTestnet4');
  });
});

describe('verifyBitcoinPrepare', () => {
  it('accepts the honest answer', () => {
    const summary = verifyBitcoinPrepare(ring(), serverPrepare(), expected());
    expect(summary.outputs.map((output) => output.amount)).toEqual([50_000n, 14_558n]);
  });

  it('accepts an honest max answer', () => {
    const summary = verifyBitcoinPrepare(ring(), serverPrepare({ max: true }), expected({ amount: 'max' }));
    expect(summary.fee).toBe(380n);
    expect(summary.outputs.map((output) => output.amount)).toEqual([64_620n]);
  });

  it('refuses a PSBT that pays the change somewhere else than reported', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ changeTo: RECEIVE1 }), expected()),
      'prepare-mismatch',
    );
  });

  it('refuses an honestly reported output to a foreign address', () => {
    const prepare = serverPrepare({ changeTo: DESTINATION });
    prepare.outputs[1] = { address: DESTINATION, value: prepare.change, kind: 'change' };
    expectCode(() => verifyBitcoinPrepare(ring(), prepare, expected()), 'prepare-mismatch');
  });

  it('refuses another amount than requested', () => {
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ amount: 40_000n })), 'prepare-mismatch');
  });

  it('refuses a fee above the limit and a misreported fee', () => {
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ maxFee: 441n })), 'prepare-mismatch');
    expectCode(() => verifyBitcoinPrepare(ring(), { ...serverPrepare(), fee: 500 }, expected()), 'prepare-mismatch');
  });

  it('refuses an inflated fee with a matching lower change, also when rate or vsize are reported to match', () => {
    // Rate and vsize as requested: 1000 sat > 2 sat/vB × 221 vB.
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 1_000 }), expected()), 'prepare-mismatch');
    // Rate raised to fit the fee: above the requested or fees() rate.
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 1_000, feeRate: 5 }), expected()),
      'prepare-mismatch',
    );
    // vsize raised to fit the fee: does not fit the PSBT.
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 1_000, vsize: 500 }), expected()),
      'prepare-mismatch',
    );
    // Dust remainder claimed although there is a change output.
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 600, changeAddedToFee: 158 }), expected()),
      'prepare-mismatch',
    );
  });

  it('refuses an inflated max fee with a matching lower amount', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ max: true, fee: 1_380 }), expected({ amount: 'max' })),
      'prepare-mismatch',
    );
    expectCode(
      () =>
        verifyBitcoinPrepare(
          ring(),
          serverPrepare({ max: true, fee: 670, changeAddedToFee: 290 }),
          expected({ amount: 'max' }),
        ),
      'prepare-mismatch',
    );
  });

  it('refuses a fee below the rate × vsize, e.g. 0 sat at 1000 sat/vB', () => {
    const exact = (satPerVb: number) => expected({ feeRate: { satPerVb, exact: true } });
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 0, feeRate: 1_000 }), exact(1_000)),
      'prepare-mismatch',
    );
    // 2 sat/vB × 221 vB = 442 sat; 400 sat underpays even with the 1 vB tolerance.
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 400 }), expected()), 'prepare-mismatch');
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare({ fee: 400 }), exact(2)), 'prepare-mismatch');
    // Within the tolerance of 1 vB: floor(2 × (221 − 1)) = 440 sat.
    expect(verifyBitcoinPrepare(ring(), serverPrepare({ fee: 440 }), exact(2)).fee).toBe(440n);
  });

  it('refuses a reported changeAddedToFee that is not contained in the fee', () => {
    // A send without change (the dust was dropped): one P2TR output, 190 vB at 2 sat/vB = 380 sat.
    const dropped = (fee: number, changeAddedToFee: number, feeRate?: number) =>
      verifyBitcoinPrepare(
        ring(),
        serverPrepare({ max: true, fee, changeAddedToFee, feeRate }),
        expected({ amount: BigInt(TOTAL_INPUT - fee) }),
      );
    // 293 sat claimed, but the fee only pays the rate.
    expectCode(() => dropped(380, 293), 'prepare-mismatch');
    expectCode(() => dropped(500, 293), 'prepare-mismatch');
    // Honest: 380 + 293 = 673 sat.
    expect(dropped(673, 293).fee).toBe(673n);
  });

  it('refuses a low or fractional reported rate that would hide a remainder not contained in the fee', () => {
    // 380 sat = 2 sat/vB × 190 vB, with a false 293 sat remainder. A reported 0.46 sat/vB would make every bound
    // fit (floor(0.46 × 188) + 293 = 379); wallet-api rates are whole numbers, so it is refused outright.
    const dropped = (feeRate: number) =>
      verifyBitcoinPrepare(
        ring(),
        serverPrepare({ max: true, fee: 380, changeAddedToFee: 293, feeRate }),
        expected({ amount: BigInt(TOTAL_INPUT - 380) }),
      );
    expectCode(() => dropped(0.46), 'prepare-mismatch');
    expectCode(() => dropped(1.5), 'prepare-mismatch');
    expectCode(() => dropped(0), 'prepare-mismatch');
    // The lowest whole rate: floor(1 × 188) + 293 = 481 sat > 380 sat.
    expectCode(() => dropped(1), 'prepare-mismatch');
  });

  it('bounds the fee symmetrically around the reported vsize (estimate 220..221 vB, tolerance 1 vB)', () => {
    const exact = expected({ feeRate: { satPerVb: 2, exact: true } });
    const at = (vsize: number, fee: number) => verifyBitcoinPrepare(ring(), serverPrepare({ vsize, fee }), exact);
    // Lower edge, reported 219 vB: 2 × 218 = 436 .. 2 × 220 = 440, and at least 2 × 219 = 438 from the estimate.
    expect(at(219, 440).fee).toBe(440n);
    expect(at(219, 438).fee).toBe(438n);
    expectCode(() => at(219, 442), 'prepare-mismatch');
    expectCode(() => at(219, 436), 'prepare-mismatch');
    // Upper edge, reported 222 vB: at least 2 × 221 = 442, at most 2 × 221 = 442 from the estimate.
    expect(at(222, 442).fee).toBe(442n);
    expectCode(() => at(222, 444), 'prepare-mismatch');
    expectCode(() => at(222, 440), 'prepare-mismatch');
  });

  it('bounds the fee by ceil(weight / 4) when the weight is not divisible by 4 (1 input, 1 output, 110 vB)', () => {
    const single = (fee: number, vsize = 110) =>
      verifyBitcoinPrepare(
        ring(),
        singlePrepare({ fee, feeRate: 2, vsize }),
        expected({
          addresses: [RECEIVE0],
          destination: RECEIVE1,
          amount: 'max',
          feeRate: { satPerVb: 2, exact: true },
        }),
      );
    // Lower bound 2 × (110 − 1) = 218 sat; with floor(437 / 4) = 109 it would have been 2 × 108 = 216.
    expect(single(218).fee).toBe(218n);
    expect(single(220).fee).toBe(220n);
    expectCode(() => single(217), 'prepare-mismatch');
    expectCode(() => single(216), 'prepare-mismatch');
    // The reported vsize may deviate by 1 vB from 110, not by 2.
    expect(single(218, 109).fee).toBe(218n);
    expectCode(() => single(218, 108), 'prepare-mismatch');
  });

  it('accepts a reported rate above 1000 sat/vB when the fees() class allows it', () => {
    const high = (feeRate: number, bound: number) =>
      verifyBitcoinPrepare(
        ring(),
        singlePrepare({ fee: feeRate * 110, feeRate, input: 1_000_000 }),
        expected({
          addresses: [RECEIVE0],
          destination: RECEIVE1,
          amount: 'max',
          feeRate: { satPerVb: bound, exact: false },
        }),
      );
    expect(high(1200, 1200).fee).toBe(132_000n);
    expect(high(1100, 1200).fee).toBe(121_000n);
    expectCode(() => high(1200, 1100), 'prepare-mismatch');
  });

  it('refuses another rate than the explicitly requested one', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ feeRate: { satPerVb: 3, exact: true } })),
      'prepare-mismatch',
    );
    expect(() =>
      verifyBitcoinPrepare(ring(), serverPrepare(), expected({ feeRate: { satPerVb: 2, exact: true } })),
    ).not.toThrow();
  });

  it('refuses a changeAddedToFee of 294 sat or more', () => {
    expect(() => verifyBitcoinPrepare(ring(), { ...serverPrepare(), changeAddedToFee: 294 }, expected())).toThrow(
      WalletError,
    );
    expectCode(
      () => verifyBitcoinPrepare(ring(), { ...serverPrepare(), changeAddedToFee: 294 }, expected()),
      'prepare-mismatch',
    );
  });

  it('refuses a reported vsize that does not fit the PSBT', () => {
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare({ vsize: 200 }), expected()), 'prepare-mismatch');
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare({ vsize: 223 }), expected()), 'prepare-mismatch');
  });

  it('refuses an input reported under another own address than its key', () => {
    const prepare = serverPrepare();
    prepare.inputs = [
      { ...prepare.inputs[0], address: RECEIVE1 },
      { ...prepare.inputs[1], address: RECEIVE0 },
    ];
    expectCode(() => verifyBitcoinPrepare(ring(), prepare, expected()), 'prepare-mismatch');
  });

  it('refuses inputs of addresses that were not offered', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ addresses: [RECEIVE0] })),
      'prepare-mismatch',
    );
  });

  it('refuses another blockchain and another destination', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ blockchain: 'BitcoinTestnet4' })),
      'prepare-mismatch',
    );
    expectCode(
      () => verifyBitcoinPrepare(ring(), { ...serverPrepare(), destination: RECEIVE1 }, expected()),
      'prepare-mismatch',
    );
  });

  it('refuses a PSBT of another wallet', () => {
    const other = KeyRing.fromMnemonic('zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong', {
      bitcoinNetwork: 'regtest',
      env: 'stg',
    });
    expectCode(() => verifyBitcoinPrepare(other, serverPrepare(), expected()), 'prepare-mismatch');
  });
});

describe('estimateBitcoinVsize', () => {
  it('counts P2WPKH inputs and outputs from their scripts', () => {
    const p2wpkh = { script: `0014${'00'.repeat(20)}` };
    const p2tr = { script: `5120${'00'.repeat(32)}` };
    const input = { txid: TXID_A, vout: 0, amount: 1n, path: '' };
    // 437 WU (71-byte signature) and 438 WU (72-byte): vsize = ceil(weight / 4) = 110 for both, never 109.
    expect(estimateBitcoinVsize({ inputs: [input], outputs: [p2wpkh] as never })).toEqual({ min: 110, max: 110 });
    // P2TR output: 485 / 486 WU, ceil → 122 for both.
    expect(estimateBitcoinVsize({ inputs: [input], outputs: [p2tr] as never })).toEqual({ min: 122, max: 122 });
    // 10.5 + 2 × 68 + 43 + 31 = 220.5 vB.
    expect(estimateBitcoinVsize({ inputs: [input, input], outputs: [p2tr, p2wpkh] as never })).toEqual({
      min: 220,
      max: 221,
    });
  });
});
