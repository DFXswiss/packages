// Known-answer vectors for @dfx.swiss/wallet derivation v1.
//
// Every value is computed with libraries the wallet does not use (Node crypto for SHA-256/HKDF/PBKDF2, bip39,
// bip32 + tiny-secp256k1, bitcoinjs-lib, bitcoinjs-message, ethers, Breez SDK Spark, Spark SDK, bech32), so the
// wallet tests compare two independent implementations. Before writing, the generator checks its own libraries
// against official vectors (RFC 5869, BIP-39, BIP-84, BIP-380, MetaMask) and the DFX API's D31 Spark login vector.
//
// Usage (Node >= 22), not part of the workspace or CI:
//   cd packages/wallet/scripts/kat
//   npm run setup      # npm install --no-package-lock --ignore-scripts (exact pins in package.json)
//   npm run generate   # writes ../../src/__tests__/fixtures/derivation-v1.json, prints its canonical SHA-256
//   cd ../.. && npx prettier --write src/__tests__/fixtures/derivation-v1.json
// A changed fixture also needs a deliberate update of FIXTURE_SHA256 in src/__tests__/derivation-v1.test.ts.

import { defaultExternalSigners } from '@breeztech/breez-sdk-spark';
import { decodeSparkAddress, encodeSparkAddress } from '@buildonspark/spark-sdk';
import { bech32m } from 'bech32';
import { BIP32Factory } from 'bip32';
import bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import bitcoinMessage from 'bitcoinjs-message';
import { HDNodeWallet, keccak256, verifyMessage } from 'ethers';
import { createHash, hkdfSync, pbkdf2Sync } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ecc from 'tiny-secp256k1';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(HERE, '../../src/__tests__/fixtures/derivation-v1.json');

const bip32 = BIP32Factory(ecc);

// ---------------------------------------------------------------------------------------------------------------
// Frozen inputs

const V1 = {
  version: 'v1',
  prfInputLabel: 'dfx.swiss/passkey-seed/prf/v1',
  hkdfSalt: 'dfx.swiss/passkey-seed/hkdf/v1',
  hkdfInfo: 'bip39-entropy-128',
  entropyBytes: 16,
  passphrase: '',
};

const PRF_OUTPUTS = [
  { name: 'prf-00-1f', prfOutput: Buffer.from(Array.from({ length: 32 }, (_, i) => i)).toString('hex') },
  { name: 'prf-ff', prfOutput: 'ff'.repeat(32) },
  { name: 'prf-fixed-random', prfOutput: '192f030491db293bdcf870ea5ea772d2a6f777262eac674cdd804dfedade0c11' },
];

// DFX API login text: Config.auth.signMessageGeneral + address, prefix '' on PRD and `[<env>]_` elsewhere.
const LOGIN_GENERAL =
  'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_Blockchain_address._Your_ID:_';
const LOGIN_PREFIXES = { prd: '', dev: '[dev]_' };

// D31 Spark login: Keccak-256(0x18 ‖ UTF-8 tag ‖ UTF-8 login text), compact low-S r‖s.
const D31_TAG = 'dfx.swiss/spark-login/v1';

const NETWORKS = {
  mainnet: {
    coinType: 0,
    network: bitcoin.networks.bitcoin,
    slip132: { public: 0x04b24746, private: 0x04b2430c }, // zpub / zprv
  },
  testnet4: {
    coinType: 1,
    network: bitcoin.networks.testnet, // testnet4 shares the testnet HRP `tb` and the tpub versions
    slip132: { public: 0x045f1cf6, private: 0x045f18bc }, // vpub / vprv
  },
};

const SPARK_IDENTITY_PATH = "m/8797555'/1'/0'";
const SPARK_ACCOUNT = 1;

// ---------------------------------------------------------------------------------------------------------------
// Primitives (independent of the wallet code)

const hex = (bytes) => Buffer.from(bytes).toString('hex');
const sha256 = (data) => createHash('sha256').update(data).digest();

function prfInput() {
  return sha256(Buffer.from(V1.prfInputLabel, 'utf8'));
}

function entropyFromPrf(prfOutput) {
  return Buffer.from(hkdfSync('sha256', prfOutput, V1.hkdfSalt, V1.hkdfInfo, V1.entropyBytes));
}

function seedFromMnemonic(mnemonic, passphrase) {
  const seed = pbkdf2Sync(mnemonic.normalize('NFKD'), `mnemonic${passphrase}`.normalize('NFKD'), 2048, 64, 'sha512');
  assertEqual(hex(bip39.mnemonicToSeedSync(mnemonic, passphrase)), hex(seed), 'bip39 seed vs PBKDF2');
  return seed;
}

function withVersions(network, versions) {
  return { ...network, bip32: versions };
}

// BIP-380 descriptor checksum, transcribed from the reference code in the BIP.
const INPUT_CHARSET =
  '0123456789()[],\'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#"\\ ';
const CHECKSUM_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0xf5dee51989n, 0xa9fdca3312n, 0x1bab10e32dn, 0x3706b1677an, 0x644d626ffdn];

function descsumPolymod(symbols) {
  let chk = 1n;
  for (const value of symbols) {
    const top = chk >> 35n;
    chk = ((chk & 0x7ffffffffn) << 5n) ^ BigInt(value);
    for (let i = 0; i < 5; i++) if ((top >> BigInt(i)) & 1n) chk ^= GENERATOR[i];
  }
  return chk;
}

function descsumExpand(text) {
  const symbols = [];
  let groups = [];
  for (const c of text) {
    const v = INPUT_CHARSET.indexOf(c);
    if (v < 0) throw new Error(`Invalid descriptor character: ${c}`);
    symbols.push(v & 31);
    groups.push(v >> 5);
    if (groups.length === 3) {
      symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2]);
      groups = [];
    }
  }
  if (groups.length === 1) symbols.push(groups[0]);
  else if (groups.length === 2) symbols.push(groups[0] * 3 + groups[1]);
  return symbols;
}

function withChecksum(descriptor) {
  const checksum = descsumPolymod([...descsumExpand(descriptor), 0, 0, 0, 0, 0, 0, 0, 0]) ^ 1n;
  let suffix = '';
  for (let i = 0; i < 8; i++) suffix += CHECKSUM_CHARSET[Number((checksum >> BigInt(5 * (7 - i))) & 31n)];
  return `${descriptor}#${suffix}`;
}

function sparkAddressViaBech32(publicKey) {
  return bech32m.encode('spark', bech32m.toWords(Buffer.concat([Buffer.from([0x0a, 0x21]), publicKey])), 1024);
}

function d31Digest(message) {
  const tag = Buffer.from(D31_TAG, 'utf8');
  const preimage = Buffer.concat([Buffer.from([tag.length]), tag, Buffer.from(message, 'utf8')]);
  return Buffer.from(keccak256(preimage).slice(2), 'hex');
}

function d31Sign(message, privateKey, publicKey) {
  const digest = d31Digest(message);
  const signature = Buffer.from(ecc.sign(digest, privateKey));
  assert(ecc.verify(digest, publicKey, signature, true), 'D31 signature verifies (strict low-S)');
  return { digest: hex(digest), signature: hex(signature) };
}

function bip137Sign(message, privateKey, address) {
  const signature = bitcoinMessage.sign(message, Buffer.from(privateKey), true, { segwitType: 'p2wpkh' });
  assert(signature[0] >= 39 && signature[0] <= 42, 'BIP-137 P2WPKH header 39..42');
  // Same check as the DFX API (bitcoinjs-message verify with Electrum-style segwit handling).
  assert(bitcoinMessage.verify(message, address, signature, null, true), 'BIP-137 signature verifies');

  // Cross-check: recoverable RFC 6979 signature from libsecp256k1 over the Bitcoin message hash.
  const recoverable = ecc.signRecoverable(bitcoinMessage.magicHash(message), privateKey);
  const header = Buffer.from([39 + recoverable.recoveryId]);
  assertEqual(
    Buffer.concat([header, Buffer.from(recoverable.signature)]).toString('base64'),
    signature.toString('base64'),
    'BIP-137 via tiny-secp256k1',
  );
  return signature.toString('base64');
}

// ---------------------------------------------------------------------------------------------------------------
// Vector computation

async function sparkIdentityFromBreez(mnemonic) {
  const signers = defaultExternalSigners(mnemonic, null, 'mainnet', SPARK_ACCOUNT);
  try {
    return Buffer.from((await signers.sparkSigner.getIdentityPublicKey()).bytes);
  } finally {
    signers.free();
  }
}

function bitcoinVectors(seed, networkName, fingerprint) {
  const { coinType, network, slip132 } = NETWORKS[networkName];
  const root = bip32.fromSeed(seed, network);
  const slipRoot = bip32.fromSeed(seed, withVersions(network, slip132));
  const accountPath = `m/84'/${coinType}'/0'`;
  const xpub = root.derivePath(accountPath).neutered().toBase58();
  const origin = `[${fingerprint}/84h/${coinType}h/0h]${xpub}`;

  const address = (chain, index) => {
    const path = `${accountPath}/${chain}/${index}`;
    const node = root.derivePath(path); // from the master, never relative
    const { address: p2wpkh } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(node.publicKey), network });
    return { index, path, publicKey: hex(node.publicKey), address: p2wpkh };
  };

  return {
    accountPath,
    xpub,
    slip132: slipRoot.derivePath(accountPath).neutered().toBase58(),
    descriptor: withChecksum(`wpkh(${origin}/<0;1>/*)`),
    receiveDescriptor: withChecksum(`wpkh(${origin}/0/*)`),
    changeDescriptor: withChecksum(`wpkh(${origin}/1/*)`),
    receive: [address(0, 0), address(0, 1)],
    change: [address(1, 0), address(1, 1)],
  };
}

async function vector({ name, prfOutput }) {
  const entropy = entropyFromPrf(Buffer.from(prfOutput, 'hex'));
  const mnemonic = bip39.entropyToMnemonic(entropy);
  assertEqual(bip39.mnemonicToEntropy(mnemonic), hex(entropy), 'mnemonic round trip');
  assertEqual(mnemonic.split(' ').length, 12, 'twelve words');

  const seed = seedFromMnemonic(mnemonic, V1.passphrase);
  const root = bip32.fromSeed(seed);
  const fingerprint = hex(root.fingerprint);

  const evm = [0, 1].map((index) => {
    const path = `m/44'/60'/0'/0/${index}`;
    return { index, path, address: HDNodeWallet.fromPhrase(mnemonic, V1.passphrase, path).address };
  });

  const bitcoinData = {
    mainnet: bitcoinVectors(seed, 'mainnet', fingerprint),
    testnet4: bitcoinVectors(seed, 'testnet4', fingerprint),
  };

  const sparkNode = root.derivePath(SPARK_IDENTITY_PATH);
  const identity = Buffer.from(sparkNode.publicKey);
  assertEqual(hex(await sparkIdentityFromBreez(mnemonic)), hex(identity), `${name}: Breez account 1 identity`);
  const sparkAddress = encodeSparkAddress({ identityPublicKey: hex(identity), network: 'MAINNET' });
  assertEqual(sparkAddressViaBech32(identity), sparkAddress, `${name}: spark1 via bech32`);
  assertEqual(decodeSparkAddress(sparkAddress, 'MAINNET').identityPublicKey, hex(identity), `${name}: spark1 decode`);

  const login = {};
  for (const [env, prefix] of Object.entries(LOGIN_PREFIXES)) {
    const btcNetwork = env === 'prd' ? 'mainnet' : 'testnet4';
    const btc = bitcoinData[btcNetwork].receive[0];
    const btcKey = bip32.fromSeed(seed, NETWORKS[btcNetwork].network).derivePath(btc.path).privateKey;

    const evmWallet = HDNodeWallet.fromPhrase(mnemonic, V1.passphrase, evm[0].path);
    const evmMessage = prefix + LOGIN_GENERAL + evm[0].address;
    const evmSignature = evmWallet.signMessageSync(evmMessage);
    assertEqual(verifyMessage(evmMessage, evmSignature), evm[0].address, `${name}/${env}: EIP-191 recovers`);

    const btcMessage = prefix + LOGIN_GENERAL + btc.address;
    const sparkMessage = prefix + LOGIN_GENERAL + sparkAddress;

    login[env] = {
      evm: { address: evm[0].address, message: evmMessage, signature: evmSignature },
      bitcoin: { address: btc.address, message: btcMessage, signature: bip137Sign(btcMessage, btcKey, btc.address) },
      spark: { address: sparkAddress, message: sparkMessage, ...d31Sign(sparkMessage, sparkNode.privateKey, identity) },
    };
  }

  return {
    name,
    prfOutput,
    entropy: hex(entropy),
    mnemonic,
    seed: hex(seed),
    masterFingerprint: fingerprint,
    evm,
    bitcoin: bitcoinData,
    spark: {
      path: SPARK_IDENTITY_PATH,
      identityPublicKey: hex(identity),
      payload: `0a21${hex(identity)}`,
      address: sparkAddress,
    },
    login,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Self-checks against official vectors

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

async function selfCheck() {
  // RFC 5869, test case 1
  const okm = hkdfSync(
    'sha256',
    Buffer.alloc(22, 0x0b),
    Buffer.from('000102030405060708090a0b0c', 'hex'),
    Buffer.from('f0f1f2f3f4f5f6f7f8f9', 'hex'),
    42,
  );
  assertEqual(
    hex(okm),
    '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865',
    'RFC 5869 case 1',
  );

  // BIP-39 (trezor/python-mnemonic vectors.json, passphrase "TREZOR")
  const bip39Vectors = [
    [
      '00000000000000000000000000000000',
      ABANDON,
      'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04',
      'xprv9s21ZrQH143K3h3fDYiay8mocZ3afhfULfb5GX8kCBdno77K4HiA15Tg23wpbeF1pLfs1c5SPmYHrEpTuuRhxMwvKDwqdKiGJS9XFKzUsAF',
    ],
    [
      'ffffffffffffffffffffffffffffffff',
      'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
      'ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069',
      'xprv9s21ZrQH143K2V4oox4M8Zmhi2Fjx5XK4Lf7GKRvPSgydU3mjZuKGCTg7UPiBUD7ydVPvSLtg9hjp7MQTYsW67rZHAXeccqYqrsx8LcXnyd',
    ],
    [
      '9e885d952ad362caeb4efe34a8e91bd2',
      'ozone drill grab fiber curtain grace pudding thank cruise elder eight picnic',
      '274ddc525802f7c828d8ef7ddbcdc5304e87ac3535913611fbbfa986d0c9e5476c91689f9c8a54fd55bd38606aa6a8595ad213d4c9c9f9aca3fb217069a41028',
      'xprv9s21ZrQH143K2oZ9stBYpoaZ2ktHj7jLz7iMqpgg1En8kKFTXJHsjxry1JbKH19YrDTicVwKPehFKTbmaxgVEc5TpHdS1aYhB2s9aFJBeJH',
    ],
  ];
  for (const [entropy, mnemonic, seed, xprv] of bip39Vectors) {
    assertEqual(bip39.entropyToMnemonic(entropy), mnemonic, `BIP-39 mnemonic ${entropy}`);
    const derived = seedFromMnemonic(mnemonic, 'TREZOR');
    assertEqual(hex(derived), seed, `BIP-39 seed ${entropy}`);
    assertEqual(bip32.fromSeed(derived).toBase58(), xprv, `BIP-39 xprv ${entropy}`);
  }

  // BIP-84 test vectors
  const abandonSeed = seedFromMnemonic(ABANDON, '');
  const zRoot = bip32.fromSeed(abandonSeed, withVersions(bitcoin.networks.bitcoin, NETWORKS.mainnet.slip132));
  assertEqual(
    zRoot.neutered().toBase58(),
    'zpub6jftahH18ngZxLmXaKw3GSZzZsszmt9WqedkyZdezFtWRFBZqsQH5hyUmb4pCEeZGmVfQuP5bedXTB8is6fTv19U1GQRyQUKQGUTzyHACMF',
    'BIP-84 rootpub',
  );
  const abandon = bitcoinVectors(abandonSeed, 'mainnet', hex(bip32.fromSeed(abandonSeed).fingerprint));
  assertEqual(
    abandon.slip132,
    'zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs',
    'BIP-84 account zpub',
  );
  assertEqual(
    abandon.receive[0].publicKey,
    '0330d54fd0dd420a6e5f8d3624f5f3482cae350f79d5f0753bf5beef9c2d91af3c',
    'BIP-84 receive 0 pubkey',
  );
  assertEqual(abandon.receive[0].address, 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu', 'BIP-84 receive 0');
  assertEqual(abandon.receive[1].address, 'bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g', 'BIP-84 receive 1');
  assertEqual(
    abandon.change[0].publicKey,
    '03025324888e429ab8e3dbaf1f7802648b9cd01e9b418485c5fa4c1b9b5700e1a6',
    'BIP-84 change 0 pubkey',
  );
  assertEqual(abandon.change[0].address, 'bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el', 'BIP-84 change 0');

  // BIP-380 checksum
  assertEqual(withChecksum('raw(deadbeef)'), 'raw(deadbeef)#89f8spxm', 'BIP-380 checksum');

  // MetaMask (MetaMask/accounts keyring-eth-hd tests) and the "abandon … about" account 1
  const metamask = 'finish oppose decorate face calm tragic certain desk hour urge dinosaur mango';
  assertEqual(
    HDNodeWallet.fromPhrase(metamask, '', "m/44'/60'/0'/0/0").address.toLowerCase(),
    '0x1c96099350f13d558464ec79b9be4445aa0ef579',
    'MetaMask account 1',
  );
  assertEqual(
    HDNodeWallet.fromPhrase(metamask, '', "m/44'/60'/0'/0/1").address.toLowerCase(),
    '0x1b00aed43a693f3a957f9feb5cc08afa031e37a0',
    'MetaMask account 2',
  );
  assertEqual(
    HDNodeWallet.fromPhrase(ABANDON, '', "m/44'/60'/0'/0/0").address,
    '0x9858EfFD232B4033E47d90003D41EC34EcaEda94',
    'abandon EVM 0',
  );

  // Spark: Breez account 1 = BIP-32 m/8797555'/1'/0'; account 0 differs
  const abandonIdentity = Buffer.from(bip32.fromSeed(abandonSeed).derivePath(SPARK_IDENTITY_PATH).publicKey);
  assertEqual(hex(await sparkIdentityFromBreez(ABANDON)), hex(abandonIdentity), 'Breez account 1 identity');
  const account0 = defaultExternalSigners(ABANDON, null, 'mainnet', 0);
  const account0Key = Buffer.from((await account0.sparkSigner.getIdentityPublicKey()).bytes);
  account0.free();
  assertEqual(
    hex(account0Key),
    hex(bip32.fromSeed(abandonSeed).derivePath("m/8797555'/0'/0'").publicKey),
    'Breez account 0',
  );
  assert(hex(account0Key) !== hex(abandonIdentity), 'account 0 and 1 differ');

  // D31 vector of the DFX API (private key 32 × 0x11)
  const d31Key = Buffer.alloc(32, 0x11);
  const d31Pub = Buffer.from(ecc.pointFromScalar(d31Key, true));
  const d31Address = encodeSparkAddress({ identityPublicKey: hex(d31Pub), network: 'MAINNET' });
  assertEqual(hex(d31Pub), '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa', 'D31 pubkey');
  assertEqual(d31Address, 'spark1pgssxne4t0wt0nq27u5w70xwh9s4myrgfw6m9jjlskdtpu9hqsr4sud2hrdv2s', 'D31 address');
  assertEqual(sparkAddressViaBech32(d31Pub), d31Address, 'D31 address via bech32');
  const prd = d31Sign(LOGIN_GENERAL + d31Address, d31Key, d31Pub);
  assertEqual(prd.digest, '5094316788151a3fd1dc1bab0f6a0c94d8038c1f04a1f55e7a233c3aff2bd246', 'D31 PRD digest');
  assertEqual(
    prd.signature,
    '8707fc3b36b044ce56c2287888be231c08668d8cf6caed5269af463fac9808ce65ce6bbfea0ada3c92e9cbc5a5c709857a34effa456efc326706cb60e7eae3e7',
    'D31 PRD signature',
  );
  const dev = d31Sign('[dev]_' + LOGIN_GENERAL + d31Address, d31Key, d31Pub);
  assertEqual(dev.digest, '51fffcc3ba49b1089330268a4c4c511af0661d4eaa308aed83a3358cb55f1056', 'D31 DEV digest');
  assertEqual(
    dev.signature,
    '2f9d1eb5b5a1d59a365d379d4c97f55c7999ab83a5cda8057274cbd43be224af2aa2740ea7eacb76c4b0b4483e25fcd2d2c74b96174bedad3389bea72c4c9aeb',
    'D31 DEV signature',
  );
}

// ---------------------------------------------------------------------------------------------------------------

function assert(condition, label) {
  if (!condition) throw new Error(`Self-check failed: ${label}`);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`Self-check failed: ${label}\n  expected ${expected}\n  actual   ${actual}`);
}

function version(name) {
  return JSON.parse(readFileSync(join(HERE, 'node_modules', name, 'package.json'), 'utf8')).version;
}

/** Sorted keys, no whitespace: the form the wallet test hashes. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

await selfCheck();

const libraries = {};
for (const name of Object.keys(JSON.parse(readFileSync(join(HERE, 'package.json'), 'utf8')).dependencies)) {
  libraries[name] = version(name);
}

const fixture = {
  description:
    'Known-answer vectors of the @dfx.swiss/wallet derivation v1, generated by scripts/kat/generate.mjs with libraries independent of the wallet code. Do not edit by hand.',
  derivation: { ...V1, prfInput: hex(prfInput()) },
  login: {
    general: LOGIN_GENERAL,
    prefixes: LOGIN_PREFIXES,
    evm: 'EIP-191 personal_sign, 0x-prefixed lowercase hex r‖s‖v',
    bitcoin: 'BIP-137 compact, P2WPKH header 39..42, base64',
    spark: `D31: Keccak-256(0x18 ‖ UTF-8 "${D31_TAG}" ‖ UTF-8 message), secp256k1 RFC 6979 low-S, compact r‖s lowercase hex`,
  },
  provenance: {
    generator: 'packages/wallet/scripts/kat/generate.mjs',
    libraries,
    methods: {
      prfInput: 'node:crypto SHA-256',
      entropy: 'node:crypto hkdfSync',
      mnemonic: 'bip39',
      seed: 'node:crypto pbkdf2Sync, cross-checked with bip39',
      bitcoin: 'bip32 + tiny-secp256k1, bitcoinjs-lib payments.p2wpkh, BIP-380 checksum',
      evm: 'ethers HDNodeWallet',
      spark:
        "Breez SDK Spark defaultExternalSigners(mnemonic, null, \"mainnet\", 1) = bip32 m/8797555'/1'/0'; address by Spark SDK encodeSparkAddress, cross-checked with bech32",
      signatures: 'ethers signMessage (EVM), bitcoinjs-message (BIP-137), ethers keccak256 + tiny-secp256k1 sign (D31)',
    },
  },
  vectors: [],
};

for (const input of PRF_OUTPUTS) fixture.vectors.push(await vector(input));

writeFileSync(OUTPUT, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(`Wrote ${OUTPUT}`);
console.log(`Canonical SHA-256: ${createHash('sha256').update(canonical(fixture)).digest('hex')}`);
process.exit(0);
