import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha2';
import fixture from './fixtures/derivation-v1.json';
import { KeyRing, withPrivateKey } from '../derivation/keyring';
import { utf8ToBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

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

const MNEMONIC = fixture.vectors[0].mnemonic;

function unlocked(): KeyRing {
  return KeyRing.fromMnemonic(MNEMONIC, { bitcoinNetwork: 'mainnet' });
}

describe('keyring wipe', () => {
  it('exposes addresses before the wipe', () => {
    const ring = unlocked();
    expect(ring.wiped).toBe(false);
    expect(ring.evm(0).address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(ring.bitcoinAddress(0, 0).address).toMatch(/^bc1q/);
    expect(ring.sparkIdentity().address).toMatch(/^spark1/);
    expect(ring.mnemonic()).toBe(MNEMONIC);
  });

  it('throws keyring-wiped from every accessor after wipe()', () => {
    const ring = unlocked();
    ring.wipe();
    expect(ring.wiped).toBe(true);

    expectWalletError(() => ring.evm(0), 'keyring-wiped');
    expectWalletError(() => ring.bitcoinAccount(), 'keyring-wiped');
    expectWalletError(() => ring.bitcoinAddress(0, 0), 'keyring-wiped');
    expectWalletError(() => ring.sparkIdentity(), 'keyring-wiped');
    expectWalletError(() => ring.mnemonic(), 'keyring-wiped');
    expectWalletError(() => withPrivateKey(ring, { family: 'spark' }, () => 0), 'keyring-wiped');
  });

  it('tolerates a second wipe', () => {
    const ring = unlocked();
    ring.wipe();
    expect(() => ring.wipe()).not.toThrow();
  });
});

describe('withPrivateKey', () => {
  it('signs with the Spark identity key and the signature verifies', () => {
    const ring = unlocked();
    const digest = sha256(utf8ToBytes('dfx wallet test message'));
    const signature = withPrivateKey(ring, { family: 'spark' }, (privateKey) =>
      secp256k1.sign(digest, privateKey).toBytes('compact'),
    );

    expect(signature).toHaveLength(64);
    expect(secp256k1.verify(signature, digest, ring.sparkIdentity().publicKey)).toBe(true);
  });

  it('signs with a Bitcoin address key', () => {
    const ring = unlocked();
    const digest = sha256(utf8ToBytes('another message'));
    const signature = withPrivateKey(ring, { family: 'bitcoin', chain: 0, index: 0 }, (privateKey) =>
      secp256k1.sign(digest, privateKey),
    );
    expect(secp256k1.verify(signature, digest, ring.bitcoinAddress(0, 0).publicKey)).toBe(true);
  });

  it('refuses unknown key families', () => {
    const ring = unlocked();
    expectWalletError(() => withPrivateKey(ring, { family: 'solana' } as never, () => 0), 'invalid-derivation-path');
  });

  it('refuses asynchronous key use', () => {
    const ring = unlocked();
    expectWalletError(
      () =>
        withPrivateKey(ring, { family: 'spark' }, async () => {
          await Promise.resolve();
          return 0;
        }),
      'async-key-use',
    );
  });

  it('keeps an independent ring instance fully usable after another instance was wiped', () => {
    const wiped = unlocked();
    const evm0 = wiped.evm(0).address;
    const sparkAddress = wiped.sparkIdentity().address;
    wiped.wipe();

    const ring = unlocked();
    expect(ring.wiped).toBe(false);
    expect(ring.evm(0).address).toBe(evm0);
    expect(ring.sparkIdentity().address).toBe(sparkAddress);
    expect(ring.mnemonic()).toBe(MNEMONIC);
  });
});
