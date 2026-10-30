import fixture from './fixtures/derivation-v1.json';
import { SPARK_LOGIN_TAG, sparkLoginDigestV1, verifySparkLogin } from '../signing/spark-login';
import { bytesToHex, hexToBytes } from '../util/bytes';
import { LOGIN_TEMPLATES } from '../signing/login-messages';

// DFX API D31 test vectors (backend spec, private key 32 x 0x11), pinned independently of the generator.
const D31_ADDRESS = 'spark1pgssxne4t0wt0nq27u5w70xwh9s4myrgfw6m9jjlskdtpu9hqsr4sud2hrdv2s';
const D31_PRD_DIGEST = '5094316788151a3fd1dc1bab0f6a0c94d8038c1f04a1f55e7a233c3aff2bd246';
const D31_DEV_DIGEST = '51fffcc3ba49b1089330268a4c4c511af0661d4eaa308aed83a3358cb55f1056';

describe('D31 spark login digest', () => {
  it('matches the DFX API vectors', () => {
    expect(bytesToHex(sparkLoginDigestV1(`${LOGIN_TEMPLATES.general}${D31_ADDRESS}`))).toBe(D31_PRD_DIGEST);
    expect(bytesToHex(sparkLoginDigestV1(`[dev]_${LOGIN_TEMPLATES.general}${D31_ADDRESS}`))).toBe(D31_DEV_DIGEST);
  });

  it('matches every fixture vector', () => {
    for (const vector of fixture.vectors) {
      for (const env of ['prd', 'dev'] as const) {
        expect(bytesToHex(sparkLoginDigestV1(vector.login[env].spark.message))).toBe(vector.login[env].spark.digest);
      }
    }
  });

  it('uses the frozen tag construction', () => {
    expect(SPARK_LOGIN_TAG).toBe('dfx.swiss/spark-login/v1');
    expect(SPARK_LOGIN_TAG).toHaveLength(24);
  });
});

describe('D31 spark login verification', () => {
  it('verifies every fixture signature against the identity key', () => {
    for (const vector of fixture.vectors) {
      for (const env of ['prd', 'dev'] as const) {
        const { message, signature } = vector.login[env].spark;
        expect(verifySparkLogin(message, signature, hexToBytes(vector.spark.identityPublicKey))).toBe(true);
      }
    }
  });

  it('refuses tampered signatures, keys and messages', () => {
    const { message, signature } = fixture.vectors[0].login.prd.spark;
    const publicKey = hexToBytes(fixture.vectors[0].spark.identityPublicKey);

    const flipped = signature.slice(0, -2) + (signature.endsWith('00') ? '11' : '00');
    expect(flipped).not.toBe(signature);
    expect(verifySparkLogin(message, flipped, publicKey)).toBe(false);

    expect(verifySparkLogin(message + 'x', signature, publicKey)).toBe(false);
    expect(verifySparkLogin(message, signature, hexToBytes(fixture.vectors[1].spark.identityPublicKey))).toBe(false);
  });

  it('refuses malformed signatures', () => {
    const { message } = fixture.vectors[0].login.prd.spark;
    const publicKey = hexToBytes(fixture.vectors[0].spark.identityPublicKey);
    expect(verifySparkLogin(message, '', publicKey)).toBe(false);
    expect(verifySparkLogin(message, 'zz', publicKey)).toBe(false);
    expect(verifySparkLogin(message, 'ab'.repeat(63), publicKey)).toBe(false);
    expect(verifySparkLogin(message, 'AB'.repeat(64), publicKey)).toBe(false);
  });
});
