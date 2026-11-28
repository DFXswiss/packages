import { Transaction } from '@scure/btc-signer';
import { base64 } from '@scure/base';
import { KeyRing } from '../derivation/keyring';
import {
  bitcoinOutputScript,
  buildBitcoinSendPsbt,
  describeBitcoinPsbt,
  signBitcoinPsbt,
} from '../signing/bitcoin-psbt';
import { bytesToHex } from '../util/bytes';
import { WalletError } from '../util/errors';

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const RECEIVE0 = 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk';
const RECEIVE1 = 'bcrt1qd7spv5q28348xl4myc8zmh983w5jx32cs707jh';
const CHANGE0 = 'bcrt1q9u62588spffmq4dzjxsr5l297znf3z6jkgnhsw';

/**
 * Built, signed and finalized with bitcoinjs-lib 6.1.7 (regtest): inputs 1111…:0 (50 000 sat, receive 0) and
 * 2222…:3 (30 000 sat, receive 1), outputs 60 000 sat to a P2TR address and 19 000 sat to change 0.
 */
const BITCOINJS = {
  destination: 'bcrt1p8wpt9v4frpf3tkn0srd97pksgsxc5hs52lafxwru9kgeephvs7rqjeprhg',
  unsigned:
    'cHNidP8BAKYCAAAAAhERERERERERERERERERERERERERERERERERERERERERAAAAAAD9////IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIDAAAAAP3///8CYOoAAAAAAAAiUSA7grKyqRhTFdpvgNpfBtBEDYpeFFf6kzh8LZGchuyHhjhKAAAAAAAAFgAULzSqHPAKU7BVopGgOn1F8KaYi1IAAAAAAAEBH1DDAAAAAAAAFgAU0MSj7wnpl7bpnjl+UY/j5BoRjKEiBgLnqyU3tdSelwMJquBunknzbOHJ/rvUTsjg0cygtPnDGRhzxdoKVAAAgAEAAIAAAACAAAAAAAAAAAAAAQEfMHUAAAAAAAAWABRvoBZQCjxqc367Jg4t3KeLqSNFWCIGA+7tIFppAi/tSmKgJFfzaZsZwGv3S/gBrMbZroS8FqnhGHPF2gpUAACAAQAAgAAAAIAAAAAAAQAAAAAAAA==',
  signedHex:
    '0200000000010211111111111111111111111111111111111111111111111111111111111111110000000000fdffffff22222222222222222222222222222222222222222222222222222222222222220300000000fdffffff0260ea0000000000002251203b82b2b2a9185315da6f80da5f06d0440d8a5e1457fa93387c2d919c86ec8786384a0000000000001600142f34aa1cf00a53b055a291a03a7d45f0a6988b520247304402204d5587d25a0fb4121512a57f35c90e40ce96d56f3a83b2495c65db41b1eda01a022011d504b0df5d4ff8a1a2f250b167d60ce8608548b363e409543a894c56f9df44012102e7ab2537b5d49e970309aae06e9e49f36ce1c9febbd44ec8e0d1cca0b4f9c3190247304402207722033ba16e1a67d02a0a7dc09aa727fc1decb3970ead9f6e6df30747541cdf02204bb3e9b80a683c5b1549d04771a35dba4e687ac37f27f50e2c101296b5f50447012103eeed205a69022fed4a62a02457f3699b19c06bf74bf801acc6d9ae84bc16a9e100000000',
  txid: 'bcc94b98ca658d7a6165af037893fecd9943a05e2f2f999b06d068e0ab41dd80',
};

const TXID_A = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const TXID_B = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

function regtestRing(): KeyRing {
  return KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'dev' });
}

function expectWalletError(run: () => unknown, code: string): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(WalletError);
    expect((error as WalletError).code).toBe(code);
    return;
  }
  throw new Error(`expected a WalletError with code ${code}, but nothing was thrown`);
}

describe('signBitcoinPsbt', () => {
  it('signs a bitcoinjs-lib PSBT to the identical transaction', () => {
    const signed = signBitcoinPsbt(regtestRing(), BITCOINJS.unsigned);
    expect(signed.hex).toBe(BITCOINJS.signedHex);
    expect(signed.txid).toBe(BITCOINJS.txid);
    expect(signed.fee).toBe(1000n);
    expect(signed.outputs).toEqual([
      expect.objectContaining({ address: BITCOINJS.destination, amount: 60_000n, change: false }),
      expect.objectContaining({ address: CHANGE0, amount: 19_000n, change: true }),
    ]);
    expect(signed.inputs.map((input) => input.path)).toEqual(["m/84'/1'/0'/0/0", "m/84'/1'/0'/0/1"]);
  });

  it('describes before signing', () => {
    const summary = describeBitcoinPsbt(regtestRing(), base64.decode(BITCOINJS.unsigned));
    expect(summary.network).toBe('regtest');
    expect(summary.fee).toBe(1000n);
    expect(summary.inputs.map((input) => input.amount)).toEqual([50_000n, 30_000n]);
  });

  it('refuses a PSBT of another wallet', () => {
    const other = KeyRing.fromMnemonic('zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong', {
      bitcoinNetwork: 'regtest',
      env: 'dev',
    });
    expectWalletError(() => signBitcoinPsbt(other, BITCOINJS.unsigned), 'foreign-input');
  });

  it('refuses sighash types other than ALL', () => {
    const tx = Transaction.fromPSBT(base64.decode(BITCOINJS.unsigned));
    tx.updateInput(0, { sighashType: 0x83 });
    expectWalletError(() => signBitcoinPsbt(regtestRing(), tx.toPSBT(0)), 'unsupported-sighash');
  });

  it('refuses garbage', () => {
    expectWalletError(() => signBitcoinPsbt(regtestRing(), 'bm90IGEgcHNidA=='), 'invalid-psbt');
  });
});

describe('buildBitcoinSendPsbt', () => {
  const utxos = [
    { txid: TXID_A, vout: 1, value: 40_000, address: RECEIVE0 },
    { txid: TXID_B, vout: 0, value: 25_000, address: RECEIVE1 },
  ];

  it('builds, signs and finalizes a regtest payment with change', () => {
    const ring = regtestRing();
    const built = buildBitcoinSendPsbt(ring, {
      to: BITCOINJS.destination,
      amount: 50_000,
      feeRate: 2,
      utxos,
      changeIndex: 0,
    });

    const payment = built.outputs.find((output) => !output.change);
    const change = built.outputs.find((output) => output.change);
    expect(payment).toMatchObject({ address: BITCOINJS.destination, amount: 50_000n });
    expect(change?.address).toBe(CHANGE0);
    expect(built.inputs).toHaveLength(2);
    expect(built.fee).toBe(65_000n - 50_000n - (change?.amount ?? 0n));

    const signed = signBitcoinPsbt(ring, built.psbt);
    const tx = Transaction.fromRaw(Buffer.from(signed.hex, 'hex'));
    expect(tx.version).toBe(2);
    expect(tx.getInput(0).sequence).toBe(0xfffffffd);
    // txids are given in display order and serialized little-endian
    expect(signed.hex).toContain(Buffer.from(TXID_A, 'hex').reverse().toString('hex'));
    expect(signed.inputs.map((input) => input.txid).sort()).toEqual([TXID_A, TXID_B].sort());
    expect(signed.fee).toBeGreaterThanOrEqual(BigInt(Math.ceil(tx.vsize * 2)));
    expect(signed.fee).toBeLessThan(BigInt(tx.vsize * 3));
  });

  it('drops dust change into the fee', () => {
    const built = buildBitcoinSendPsbt(regtestRing(), {
      to: BITCOINJS.destination,
      amount: 39_700,
      feeRate: 1,
      utxos: [utxos[0]],
      changeIndex: 0,
    });
    expect(built.outputs).toHaveLength(1);
    expect(built.fee).toBe(300n);
  });

  it('refuses addresses of other networks, unknown inputs and bad parameters', () => {
    const ring = regtestRing();
    const base = { amount: 10_000, feeRate: 1, utxos, changeIndex: 0 };
    expectWalletError(
      () => buildBitcoinSendPsbt(ring, { ...base, to: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu' }),
      'invalid-address',
    );
    expectWalletError(
      () => buildBitcoinSendPsbt(ring, { ...base, to: 'tb1q6rz28mcfaxtmd6v789l9rrlrusdprr9pqcpvkl' }),
      'invalid-address',
    );
    expectWalletError(() => buildBitcoinSendPsbt(ring, { ...base, to: RECEIVE1, utxos: [] }), 'insufficient-funds');
    expectWalletError(() => buildBitcoinSendPsbt(ring, { ...base, to: CHANGE0 }), 'invalid-address');
    const farChange = ring.bitcoinAddress(1, 150).address;
    expectWalletError(
      () => buildBitcoinSendPsbt(ring, { ...base, to: farChange, changeIndex: 150 }),
      'invalid-address',
    );
    expectWalletError(
      () =>
        buildBitcoinSendPsbt(ring, {
          ...base,
          to: RECEIVE1,
          utxos: [utxos[0], { ...utxos[0], txid: TXID_A.toUpperCase() }],
        }),
      'invalid-utxo',
    );
    expectWalletError(() => buildBitcoinSendPsbt(ring, { ...base, to: RECEIVE1, amount: 100 }), 'amount-below-dust');
    expectWalletError(
      () => buildBitcoinSendPsbt(ring, { ...base, to: RECEIVE1, amount: 1_000_000 }),
      'insufficient-funds',
    );
    expectWalletError(() => buildBitcoinSendPsbt(ring, { ...base, to: RECEIVE1, feeRate: 0 }), 'invalid-fee-rate');
    expectWalletError(() => buildBitcoinSendPsbt(ring, { ...base, to: RECEIVE1, amount: 1.5 }), 'invalid-amount');
    expectWalletError(
      () =>
        buildBitcoinSendPsbt(ring, {
          ...base,
          to: RECEIVE1,
          utxos: [{ ...utxos[0], address: 'bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080' }],
        }),
      'unknown-address',
    );
  });

  it('encodes every standard output type of the network', () => {
    expect(bytesToHex(bitcoinOutputScript(RECEIVE0, 'regtest')).startsWith('0014')).toBe(true);
    expect(bytesToHex(bitcoinOutputScript(BITCOINJS.destination, 'regtest')).startsWith('5120')).toBe(true);
    expect(bytesToHex(bitcoinOutputScript('mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', 'regtest')).startsWith('76a914')).toBe(
      true,
    );
    expectWalletError(() => bitcoinOutputScript('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 'regtest'), 'invalid-address');
  });
});
