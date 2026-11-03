import { bech32, bech32m } from '@scure/base';
import fixture from './fixtures/derivation-v1.json';
import { decodeSparkAddress, encodeSparkAddress } from '../derivation/spark-keys';
import { bytesToHex, concatBytes, hexToBytes } from '../util/bytes';
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

// DFX API D31 test vector: private key 32 x 0x11 (backend bech32m.service.ts spec).
const D31_PUBKEY = '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa';
const D31_ADDRESS = 'spark1pgssxne4t0wt0nq27u5w70xwh9s4myrgfw6m9jjlskdtpu9hqsr4sud2hrdv2s';

const PAYLOAD_PREFIX = new Uint8Array([0x0a, 0x21]);

describe('spark address', () => {
  it('encodes the DFX API D31 vector', () => {
    expect(encodeSparkAddress(hexToBytes(D31_PUBKEY))).toBe(D31_ADDRESS);
  });

  it('round-trips every fixture identity', () => {
    for (const vector of fixture.vectors) {
      const publicKey = hexToBytes(vector.spark.identityPublicKey);
      expect(encodeSparkAddress(publicKey)).toBe(vector.spark.address);
      expect(bytesToHex(decodeSparkAddress(vector.spark.address))).toBe(vector.spark.identityPublicKey);
    }
  });

  it('decodes the D31 vector back to the identity key', () => {
    expect(bytesToHex(decodeSparkAddress(D31_ADDRESS))).toBe(D31_PUBKEY);
  });

  it('refuses uppercase addresses', () => {
    expectWalletError(() => decodeSparkAddress(D31_ADDRESS.toUpperCase()), 'invalid-spark-address');
  });

  it('refuses bech32 (not bech32m) encodings of a valid payload', () => {
    const words = bech32m.toWords(concatBytes(PAYLOAD_PREFIX, hexToBytes(D31_PUBKEY)));
    const wrong = bech32.encode('spark', words, 1024);
    expect(wrong).not.toBe(D31_ADDRESS);
    expectWalletError(() => decodeSparkAddress(wrong), 'invalid-spark-address');
  });

  it('refuses other prefixes than spark', () => {
    const words = bech32m.toWords(concatBytes(PAYLOAD_PREFIX, hexToBytes(D31_PUBKEY)));
    expectWalletError(() => decodeSparkAddress(bech32m.encode('sn', words, 1024)), 'invalid-spark-address');
    expectWalletError(() => decodeSparkAddress(bech32m.encode('tspark', words, 1024)), 'invalid-spark-address');
  });

  it('refuses payloads that are not exactly 0x0a 0x21 plus a compressed key', () => {
    const key = hexToBytes(D31_PUBKEY);

    // Invoice-style payload: identity field followed by another field byte.
    const withInvoice = concatBytes(PAYLOAD_PREFIX, key, new Uint8Array([0x12, 0x02, 0x00, 0x00]));
    expectWalletError(
      () => decodeSparkAddress(bech32m.encode('spark', bech32m.toWords(withInvoice), 1024)),
      'invalid-spark-address',
    );

    // Raw key without the protobuf prefix.
    expectWalletError(
      () => decodeSparkAddress(bech32m.encode('spark', bech32m.toWords(key), 1024)),
      'invalid-spark-address',
    );

    // Wrong protobuf length for the 33-byte key.
    const wrongLength = concatBytes(new Uint8Array([0x0a, 0x20]), key);
    expectWalletError(
      () => decodeSparkAddress(bech32m.encode('spark', bech32m.toWords(wrongLength), 1024)),
      'invalid-spark-address',
    );
  });

  it('refuses payloads that are not secp256k1 points', () => {
    const notAPoint = concatBytes(new Uint8Array([0x02]), new Uint8Array(32).fill(0xff));
    const address = bech32m.encode('spark', bech32m.toWords(concatBytes(PAYLOAD_PREFIX, notAPoint)), 1024);
    expectWalletError(() => decodeSparkAddress(address), 'invalid-spark-address');
  });

  it('refuses malformed input entirely', () => {
    expectWalletError(() => decodeSparkAddress(''), 'invalid-spark-address');
    expectWalletError(() => decodeSparkAddress('spark1'), 'invalid-spark-address');
    expectWalletError(() => decodeSparkAddress('not-an-address'), 'invalid-spark-address');
    expectWalletError(() => decodeSparkAddress(undefined as unknown as string), 'invalid-spark-address');
  });

  it('refuses to encode keys that are not 33-byte compressed points', () => {
    expectWalletError(() => encodeSparkAddress(new Uint8Array(32)), 'invalid-spark-address');
    expectWalletError(() => encodeSparkAddress(new Uint8Array(33)), 'invalid-spark-address');
    expectWalletError(
      () => encodeSparkAddress(concatBytes(new Uint8Array([0x04]), new Uint8Array(64))),
      'invalid-spark-address',
    );
  });
});
