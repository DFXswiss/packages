import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha2';
import fixture from './fixtures/derivation-v1.json';
import {
  DERIVATION_V1,
  PRF_OUTPUT_BYTES,
  entropyFromPrfV1,
  mnemonicFromPrfV1,
  normalizeMnemonicV1,
  prfInputV1,
  seedFromMnemonic,
} from '../derivation/v1';
import { KeyRing } from '../derivation/keyring';
import { seedPublicData } from '../derivation/public-data';
import { bytesToHex, hexToBytes, utf8ToBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/**
 * SHA-256 of the canonical fixture (sorted keys, no whitespace), as printed by `scripts/kat/generate.mjs`.
 * Pinned on purpose: changing the fixture requires regenerating it AND updating this constant.
 */
const FIXTURE_SHA256 = '7f96779e31100861e1c2b325089ebf120182a3106ae5150a07cc82fa3f0ecd80';

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

type Vector = (typeof fixture.vectors)[number];
type BitcoinVectors = Vector['bitcoin']['mainnet'];

/** Asserts the call throws a WalletError with exactly this machine-readable code. */
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

/** Same canonical form the KAT generator hashes: sorted keys, no whitespace. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function expectBitcoinAccount(ring: KeyRing, expected: BitcoinVectors, fingerprint: string): void {
  expect(ring.bitcoinAccount()).toEqual({ path: expected.accountPath, xpub: expected.xpub, fingerprint });
}

function expectBitcoinAddresses(ring: KeyRing, expected: BitcoinVectors): void {
  const receive0 = ring.bitcoinAddress(0, 0);
  expect(receive0.address).toBe(expected.receive[0].address);
  expect(receive0.path).toBe(expected.receive[0].path);
  expect(bytesToHex(receive0.publicKey)).toBe(expected.receive[0].publicKey);

  expect(ring.bitcoinAddress(0, 1).address).toBe(expected.receive[1].address);
  expect(ring.bitcoinAddress(1, 0).address).toBe(expected.change[0].address);
  expect(ring.bitcoinAddress(1, 0).path).toBe(expected.change[0].path);
  expect(ring.bitcoinAddress(1, 1).address).toBe(expected.change[1].address);
}

describe('derivation v1 constants', () => {
  it('pins the frozen derivation parameters', () => {
    expect(fixture.derivation.version).toBe(DERIVATION_V1.version);
    expect(fixture.derivation.prfInputLabel).toBe(DERIVATION_V1.prfInputLabel);
    expect(fixture.derivation.hkdfSalt).toBe(DERIVATION_V1.hkdfSalt);
    expect(fixture.derivation.hkdfInfo).toBe(DERIVATION_V1.hkdfInfo);
    expect(fixture.derivation.entropyBytes).toBe(DERIVATION_V1.entropyBytes);
    expect(fixture.derivation.passphrase).toBe(DERIVATION_V1.passphrase);
    expect(DERIVATION_V1.entropyBytes).toBe(16);
    expect(PRF_OUTPUT_BYTES).toBe(32);
  });

  it('derives the PRF input from the frozen label', () => {
    const prfInput = prfInputV1();
    expect(prfInput).toHaveLength(32);
    expect(bytesToHex(prfInput)).toBe(fixture.derivation.prfInput);
  });

  it('rejects PRF outputs that are not 32 bytes', () => {
    expectWalletError(() => entropyFromPrfV1(hexToBytes('00'.repeat(31))), 'invalid-prf-output');
    expectWalletError(() => entropyFromPrfV1(hexToBytes('00'.repeat(33))), 'invalid-prf-output');
  });
});

describe('derivation v1 known-answer vectors', () => {
  for (const vector of fixture.vectors) {
    describe(vector.name, () => {
      it('derives entropy and mnemonic from the PRF output', () => {
        const prfOutput = hexToBytes(vector.prfOutput);
        expect(bytesToHex(entropyFromPrfV1(prfOutput))).toBe(vector.entropy);
        expect(mnemonicFromPrfV1(prfOutput)).toBe(vector.mnemonic);
        expect(vector.mnemonic.split(' ')).toHaveLength(12);
      });

      it('derives the BIP-39 seed with the empty passphrase', () => {
        const seed = seedFromMnemonic(vector.mnemonic);
        expect(seed).toHaveLength(64);
        expect(bytesToHex(seed)).toBe(vector.seed);
      });

      it('derives the EVM accounts', () => {
        const ring = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'mainnet' });
        for (const expected of vector.evm) {
          const account = ring.evm(expected.index);
          expect(account.path).toBe(expected.path);
          expect(account.address).toBe(expected.address);
        }
      });

      it('derives the Bitcoin accounts and addresses on mainnet and testnet4', () => {
        const mainnet = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'mainnet' });
        expectBitcoinAccount(mainnet, vector.bitcoin.mainnet, vector.masterFingerprint);
        expectBitcoinAddresses(mainnet, vector.bitcoin.mainnet);
        expect(mainnet.bitcoinAccount().xpub.startsWith('xpub')).toBe(true);

        const testnet4 = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'testnet4' });
        expectBitcoinAccount(testnet4, vector.bitcoin.testnet4, vector.masterFingerprint);
        expectBitcoinAddresses(testnet4, vector.bitcoin.testnet4);
        expect(testnet4.bitcoinAccount().xpub.startsWith('tpub')).toBe(true);
      });

      it('derives the Spark identity and its address', () => {
        const ring = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'mainnet' });
        const spark = ring.sparkIdentity();
        expect(spark.path).toBe(vector.spark.path);
        expect(bytesToHex(spark.publicKey)).toBe(vector.spark.identityPublicKey);
        expect(spark.address).toBe(vector.spark.address);
        expect(vector.spark.payload).toBe(`0a21${vector.spark.identityPublicKey}`);
      });

      it('collects the public data of the seed without secrets', () => {
        const ring = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'mainnet' });
        const data = seedPublicData(ring, [0, 1]);
        expect(data.seedCheckAddress).toBe(vector.evm[0].address);
        expect(data.evm).toEqual(vector.evm.map((e) => ({ index: e.index, address: e.address })));
        expect(data.bitcoin).toEqual({
          network: 'mainnet',
          xpub: vector.bitcoin.mainnet.xpub,
          fingerprint: vector.masterFingerprint,
          receive0: vector.bitcoin.mainnet.receive[0].address,
        });
        expect(data.spark).toEqual({
          identityPubkey: vector.spark.identityPublicKey,
          address: vector.spark.address,
        });
      });
    });
  }
});

describe('derivation v1 against official vectors', () => {
  it('matches the BIP-84 test vectors for the "abandon … about" mnemonic', () => {
    const ring = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'mainnet' });
    expect(ring.bitcoinAddress(0, 0).address).toBe('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
    expect(ring.bitcoinAddress(0, 0).path).toBe("m/84'/0'/0'/0/0");
    expect(ring.bitcoinAddress(0, 1).address).toBe('bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g');
    expect(bytesToHex(ring.bitcoinAddress(0, 0).publicKey)).toBe(
      '0330d54fd0dd420a6e5f8d3624f5f3482cae350f79d5f0753bf5beef9c2d91af3c',
    );
    expect(ring.bitcoinAddress(1, 0).address).toBe('bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el');
    expect(bytesToHex(ring.bitcoinAddress(1, 0).publicKey)).toBe(
      '03025324888e429ab8e3dbaf1f7802648b9cd01e9b418485c5fa4c1b9b5700e1a6',
    );
  });

  it('matches the MetaMask EVM index 0 address for "abandon … about"', () => {
    const ring = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'mainnet' });
    expect(ring.evm(0).address).toBe('0x9858EfFD232B4033E47d90003D41EC34EcaEda94');
    expect(ring.evm(0).path).toBe("m/44'/60'/0'/0/0");
  });

  it('matches RFC 5869 test case 1 with the HKDF primitive', () => {
    const okm = hkdf(
      sha256,
      new Uint8Array(22).fill(0x0b),
      hexToBytes('000102030405060708090a0b0c'),
      hexToBytes('f0f1f2f3f4f5f6f7f8f9'),
      42,
    );
    expect(bytesToHex(okm)).toBe(
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865',
    );
  });
});

describe('mnemonic handling', () => {
  const vector = fixture.vectors[0];

  it('normalizes whitespace of a valid mnemonic', () => {
    expect(normalizeMnemonicV1(`  ${vector.mnemonic.split(' ').join('  \t')} `)).toBe(vector.mnemonic);
  });

  it('accepts only 12-word English BIP-39 mnemonics', () => {
    const words = vector.mnemonic.split(' ');
    expectWalletError(() => normalizeMnemonicV1(words.slice(0, 11).join(' ')), 'invalid-mnemonic');
    expectWalletError(() => normalizeMnemonicV1([...words.slice(0, 11), 'zoo', 'wrong'].join(' ')), 'invalid-mnemonic');
    expectWalletError(() => normalizeMnemonicV1('not english words at all here now'), 'invalid-mnemonic');
  });

  it('refuses unknown Bitcoin networks', () => {
    expectWalletError(
      () => KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'regtest' as 'mainnet' }),
      'invalid-network',
    );
  });

  it('refuses invalid BIP-84 chains and indexes', () => {
    const ring = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'mainnet' });
    expectWalletError(() => ring.bitcoinAddress(2 as 0, 0), 'invalid-derivation-path');
    expectWalletError(() => ring.bitcoinAddress(0, -1), 'invalid-derivation-path');
    expectWalletError(() => ring.bitcoinAddress(0, 0x80000000), 'invalid-derivation-path');
    expectWalletError(() => ring.evm(-1), 'invalid-derivation-path');
  });
});

describe('fixture integrity', () => {
  it('matches the pinned canonical SHA-256', () => {
    expect(bytesToHex(sha256(utf8ToBytes(canonical(fixture))))).toBe(FIXTURE_SHA256);
  });

  it('covers three distinct PRF inputs', () => {
    expect(fixture.vectors).toHaveLength(3);
    expect(new Set(fixture.vectors.map((v) => v.prfOutput)).size).toBe(3);
  });
});
