import { DEFAULT_REGTEST_ENVS, isRegtestAllowed, WALLET_NETWORKS } from '../config/environment';
import { BITCOIN_COIN_TYPE, BITCOIN_HRP, p2wpkhKeyHash } from '../derivation/bitcoin-keys';
import { findBitcoinKey, KeyRing } from '../derivation/keyring';
import { seedPublicData } from '../derivation/public-data';
import { ChainRegistry } from '../providers/chain-registry';
import { bytesToHex } from '../util/bytes';
import { WalletError } from '../util/errors';
import fixture from './fixtures/derivation-v1.json';

/**
 * Regtest vectors of the BIP-84 test mnemonic, computed with bitcoinjs-lib 6.1.7 + bip32 4.0.0 +
 * tiny-secp256k1 2.2.3 (`networks.regtest`), independent of the wallet code.
 */
const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const REGTEST = {
  fingerprint: '73c5da0a',
  accountPath: "m/84'/1'/0'",
  xpub: 'tpubDC8msFGeGuwnKG9Upg7DM2b4DaRqg3CUZa5g8v2SRQ6K4NSkxUgd7HsL2XVWbVm39yBA4LAxysQAm397zwQSQoQgewGiYZqrA9DsP4zbQ1M',
  receive0: {
    path: "m/84'/1'/0'/0/0",
    publicKey: '02e7ab2537b5d49e970309aae06e9e49f36ce1c9febbd44ec8e0d1cca0b4f9c319',
    address: 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk',
  },
  receive1: { path: "m/84'/1'/0'/0/1", address: 'bcrt1qd7spv5q28348xl4myc8zmh983w5jx32cs707jh' },
  change0: { path: "m/84'/1'/0'/1/0", address: 'bcrt1q9u62588spffmq4dzjxsr5l297znf3z6jkgnhsw' },
  change1: { path: "m/84'/1'/0'/1/1", address: 'bcrt1qkwgskuzmmwwvqajnyr7yp9hgvh5y45kg984qvy' },
};

const DEV = { env: 'dev' as const };

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

describe('Bitcoin regtest network constants', () => {
  it('uses HRP bcrt and coin type 1', () => {
    expect(BITCOIN_HRP.regtest).toBe('bcrt');
    expect(BITCOIN_COIN_TYPE.regtest).toBe(1);
  });

  it('is selected by no environment', () => {
    for (const networks of Object.values(WALLET_NETWORKS)) expect(networks.bitcoin).not.toBe('regtest');
  });
});

describe('regtest gate (D28)', () => {
  it('enables DEV, STG and LOC by default and never PRD', () => {
    expect(DEFAULT_REGTEST_ENVS).toEqual(['dev', 'stg', 'loc']);
    expect(isRegtestAllowed('dev')).toBe(true);
    expect(isRegtestAllowed('stg')).toBe(true);
    expect(isRegtestAllowed('loc')).toBe(true);
    expect(isRegtestAllowed('stg', ['dev'])).toBe(false);
    expect(isRegtestAllowed('prd')).toBe(false);
    expect(isRegtestAllowed('prd', ['prd', 'dev', 'stg', 'loc'])).toBe(false);
    expect(isRegtestAllowed(undefined)).toBe(false);
    expect(isRegtestAllowed('dev', [])).toBe(false);
  });

  it('refuses a regtest ring without an enabled non-PRD environment', () => {
    expectWalletError(() => KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest' }), 'network-not-allowed');
    expectWalletError(
      () => KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'prd', regtestEnvs: ['prd'] }),
      'network-not-allowed',
    );
    expectWalletError(
      () => KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'stg', regtestEnvs: ['dev'] }),
      'network-not-allowed',
    );
    const testnet = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'testnet4' });
    expectWalletError(() => testnet.forBitcoinNetwork('regtest'), 'network-not-allowed');
    expectWalletError(() => testnet.forBitcoinNetwork('regtest', { env: 'prd' }), 'network-not-allowed');
    expect(testnet.forBitcoinNetwork('regtest', { env: 'stg' }).bitcoinNetwork).toBe('regtest');
  });

  it('does not gate mainnet and testnet4', () => {
    expect(KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'mainnet' }).bitcoinNetwork).toBe('mainnet');
    expect(KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'testnet4', env: 'prd' }).bitcoinNetwork).toBe('testnet4');
  });
});

describe('regtest derivation', () => {
  it("derives m/84'/1'/0' with bcrt1q addresses (independent vectors)", () => {
    const ring = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', ...DEV });
    expect(ring.bitcoinAccount()).toEqual({
      path: REGTEST.accountPath,
      xpub: REGTEST.xpub,
      fingerprint: REGTEST.fingerprint,
    });
    const receive0 = ring.bitcoinAddress(0, 0);
    expect(receive0.path).toBe(REGTEST.receive0.path);
    expect(receive0.address).toBe(REGTEST.receive0.address);
    expect(bytesToHex(receive0.publicKey)).toBe(REGTEST.receive0.publicKey);
    expect(ring.bitcoinAddress(0, 1)).toMatchObject(REGTEST.receive1);
    expect(ring.bitcoinAddress(1, 0)).toMatchObject(REGTEST.change0);
    expect(ring.bitcoinAddress(1, 1)).toMatchObject(REGTEST.change1);
  });

  it('shares keys and the tpub with testnet4, only the HRP differs', () => {
    for (const vector of fixture.vectors) {
      const regtest = KeyRing.fromMnemonic(vector.mnemonic, { bitcoinNetwork: 'regtest', ...DEV });
      expect(regtest.bitcoinAccount().xpub).toBe(vector.bitcoin.testnet4.xpub);
      for (const [chain, list] of [
        [0, vector.bitcoin.testnet4.receive],
        [1, vector.bitcoin.testnet4.change],
      ] as const) {
        for (const expected of list) {
          const actual = regtest.bitcoinAddress(chain, expected.index);
          expect(actual.path).toBe(expected.path);
          expect(bytesToHex(actual.publicKey)).toBe(expected.publicKey);
          expect(actual.address.startsWith('bcrt1q')).toBe(true);
          expect(p2wpkhKeyHash(actual.address, 'regtest')).toEqual(p2wpkhKeyHash(expected.address, 'testnet4'));
        }
      }
    }
  });

  it('derives the regtest ring from an unlocked ring and wipes independently', () => {
    const testnet = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'testnet4' });
    const regtest = testnet.forBitcoinNetwork('regtest', DEV);
    expect(regtest.bitcoinAddress(0, 0).address).toBe(REGTEST.receive0.address);
    expect(regtest.evm(0).address).toBe(testnet.evm(0).address);
    regtest.wipe();
    expect(regtest.wiped).toBe(true);
    expect(testnet.bitcoinAddress(0, 0).address.startsWith('tb1q')).toBe(true);
    expect(testnet.forBitcoinNetwork('regtest', DEV).bitcoinAddress(0, 0).address).toBe(REGTEST.receive0.address);
  });

  it('keeps the public data network', () => {
    const ring = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', ...DEV });
    expect(seedPublicData(ring).bitcoin).toMatchObject({ network: 'regtest', receive0: REGTEST.receive0.address });
  });

  it('finds own addresses on the regtest ring only', () => {
    const ring = KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', ...DEV });
    expect(findBitcoinKey(ring, REGTEST.change1.address)).toMatchObject({ chain: 1, index: 1 });
    expect(findBitcoinKey(ring, REGTEST.receive0.address.toUpperCase())).toMatchObject({ chain: 0, index: 0 });
    expect(findBitcoinKey(ring, 'tb1q6rz28mcfaxtmd6v789l9rrlrusdprr9pqcpvkl')).toBeUndefined();
    expect(findBitcoinKey(ring, 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu')).toBeUndefined();
    expect(findBitcoinKey(ring, REGTEST.receive1.address, 1)).toBeUndefined();
  });

  it('decodes only P2WPKH addresses of the given network', () => {
    expect(p2wpkhKeyHash(REGTEST.receive0.address, 'regtest')).toHaveLength(20);
    expect(p2wpkhKeyHash(REGTEST.receive0.address, 'testnet4')).toBeUndefined();
    expect(p2wpkhKeyHash('bcrt1Q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk', 'regtest')).toBeUndefined();
    expect(p2wpkhKeyHash('bcrt1qnotanaddress', 'regtest')).toBeUndefined();
  });
});

describe('ChainRegistry regtest', () => {
  it('maps regtest to BitcoinRegtest', () => {
    const chain = (blockchain: string) =>
      ({ blockchain, family: 'Bitcoin', isTestnet: true, walletSupported: true }) as never;
    const registry = ChainRegistry.fromApi([chain('BitcoinTestnet4'), chain('BitcoinRegtest')]);
    expect(registry.bitcoin('dev').blockchain).toBe('BitcoinTestnet4');
    expect(registry.bitcoin('dev', 'regtest').blockchain).toBe('BitcoinRegtest');
    expectWalletError(
      () => ChainRegistry.fromApi([chain('BitcoinTestnet4')]).bitcoin('dev', 'regtest'),
      'chain-unavailable',
    );
  });

  it('refuses regtest on PRD and disabled environments even when the chain list has it', () => {
    const chain = (blockchain: string) =>
      ({ blockchain, family: 'Bitcoin', isTestnet: true, walletSupported: true }) as never;
    const registry = ChainRegistry.fromApi([chain('Bitcoin'), chain('BitcoinRegtest')]);
    expectWalletError(() => registry.bitcoin('prd', 'regtest'), 'network-not-allowed');
    expectWalletError(() => registry.bitcoin('prd', 'regtest', ['prd']), 'network-not-allowed');
    expectWalletError(() => registry.bitcoin('stg', 'regtest', ['dev']), 'network-not-allowed');
    expect(registry.bitcoin('stg', 'regtest').blockchain).toBe('BitcoinRegtest');
    expect(registry.bitcoin('prd').blockchain).toBe('Bitcoin');
  });
});
