import type { WalletApi, WalletBitcoinPrepare } from '@dfx.swiss/core';
import { Transaction } from '@scure/btc-signer';
import { base64 } from '@scure/base';
import { KeyRing } from '../derivation/keyring';
import { BitcoinSend, verifyBitcoinPrepare } from '../session/bitcoin-send';
import { bitcoinOutputScript, btcSignerNetwork, signBitcoinPsbt } from '../signing/bitcoin-psbt';
import { WalletError } from '../util/errors';

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const RECEIVE0 = 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk';
const RECEIVE1 = 'bcrt1qd7spv5q28348xl4myc8zmh983w5jx32cs707jh';
const CHANGE0 = 'bcrt1q9u62588spffmq4dzjxsr5l297znf3z6jkgnhsw';
const DESTINATION = 'bcrt1p8wpt9v4frpf3tkn0srd97pksgsxc5hs52lafxwru9kgeephvs7rqjeprhg';
const TXID_A = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const TXID_B = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

function ring(): KeyRing {
  return KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'stg' });
}

interface ServerPrepareOptions {
  /** Where the PSBT really sends the change. */
  changeTo?: string;
  changeValue?: number;
}

/** A prepare answer the way wallet-api builds it: PSBT v0, tx v2, witnessUtxo, no BIP-32 paths. */
function serverPrepare(options: ServerPrepareOptions = {}): WalletBitcoinPrepare {
  const network = btcSignerNetwork('regtest');
  const changeValue = options.changeValue ?? 14_000;
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
  tx.addOutputAddress(DESTINATION, 50_000n, network);
  tx.addOutputAddress(options.changeTo ?? CHANGE0, BigInt(changeValue), network);
  const psbt = base64.encode(tx.toPSBT(0));
  return {
    prepareId: '44444444-4444-4444-8444-444444444444',
    expiresAt: '2026-11-28T00:10:00.000Z',
    blockchain: 'BitcoinRegtest',
    psbt,
    txid: signBitcoinPsbt(ring(), psbt).txid,
    destination: DESTINATION,
    amount: 50_000,
    fee: 65_000 - 50_000 - changeValue,
    feeRate: 2,
    change: 14_000,
    changeAddress: CHANGE0,
    changeAddedToFee: 0,
    vsize: 200,
    rbf: true,
    totalInput: 65_000,
    uneconomicalUtxos: 0,
    inputs: [
      { txid: TXID_A, vout: 1, value: 40_000, address: RECEIVE0 },
      { txid: TXID_B, vout: 0, value: 25_000, address: RECEIVE1 },
    ],
    outputs: [
      { address: DESTINATION, value: 50_000, kind: 'destination' },
      { address: CHANGE0, value: 14_000, kind: 'change' },
    ],
  };
}

function fakeApi(prepare: WalletBitcoinPrepare) {
  return {
    bitcoinPrepare: jest.fn(async () => prepare),
    bitcoinSubmit: jest.fn(async () => ({ txid: prepare.txid, prepareId: prepare.prepareId, alreadySubmitted: false })),
    bitcoinAccount: jest.fn(async () => ({})),
    bitcoinFees: jest.fn(async () => ({})),
  };
}

const PARAMS = {
  addresses: [RECEIVE0, RECEIVE1],
  changeAddress: CHANGE0,
  destination: DESTINATION,
  amount: 50_000,
  feeRate: 'normal' as const,
};

function expected(overrides: Partial<Parameters<typeof verifyBitcoinPrepare>[2]> = {}) {
  return {
    blockchain: 'BitcoinRegtest' as const,
    addresses: [RECEIVE0, RECEIVE1],
    changeAddress: CHANGE0,
    destination: DESTINATION,
    amount: 50_000n as bigint | 'max',
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
    expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ prepare }));
    expect(result.prepared.summary.fee).toBe(1_000n);
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
  });

  it('sends max and explicit fee rates as wallet-api expects', async () => {
    const api = fakeApi(serverPrepare());
    const send = new BitcoinSend({ api: api as unknown as WalletApi, keys: ring() });
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
  });

  it('refuses an invalid explicit fee rate before calling the server', async () => {
    const api = fakeApi(serverPrepare());
    const send = new BitcoinSend({ api: api as unknown as WalletApi, keys: ring() });
    await expect(send.prepare({ ...PARAMS, feeRateSatPerVb: 0.5 })).rejects.toMatchObject({ code: 'invalid-fee-rate' });
    expect(api.bitcoinPrepare).not.toHaveBeenCalled();
  });

  it('does not sign or submit when the user declines', async () => {
    const api = fakeApi(serverPrepare());
    const send = new BitcoinSend({ api: api as unknown as WalletApi, keys: ring() });
    await expect(send.send(PARAMS, () => false)).rejects.toMatchObject({ code: 'send-cancelled' });
    expect(api.bitcoinSubmit).not.toHaveBeenCalled();
  });

  it('refuses to submit a transaction whose txid differs from the prepared one', async () => {
    const api = fakeApi({ ...serverPrepare(), txid: 'ff'.repeat(32) });
    const send = new BitcoinSend({ api: api as unknown as WalletApi, keys: ring() });
    await expect(send.send(PARAMS)).rejects.toMatchObject({ code: 'txid-mismatch' });
    expect(api.bitcoinSubmit).not.toHaveBeenCalled();
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
    expect(summary.outputs.map((output) => output.amount)).toEqual([50_000n, 14_000n]);
  });

  it('refuses a PSBT that pays the change somewhere else than reported', () => {
    expectCode(
      () => verifyBitcoinPrepare(ring(), serverPrepare({ changeTo: RECEIVE1 }), expected()),
      'prepare-mismatch',
    );
  });

  it('refuses an honestly reported output to a foreign address', () => {
    const prepare = serverPrepare({ changeTo: DESTINATION });
    prepare.outputs[1] = { address: DESTINATION, value: 14_000, kind: 'change' };
    expectCode(() => verifyBitcoinPrepare(ring(), prepare, expected()), 'prepare-mismatch');
  });

  it('refuses another amount than requested', () => {
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ amount: 40_000n })), 'prepare-mismatch');
  });

  it('refuses a fee above the limit and a misreported fee', () => {
    expectCode(() => verifyBitcoinPrepare(ring(), serverPrepare(), expected({ maxFee: 999n })), 'prepare-mismatch');
    expectCode(() => verifyBitcoinPrepare(ring(), { ...serverPrepare(), fee: 500 }, expected()), 'prepare-mismatch');
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
