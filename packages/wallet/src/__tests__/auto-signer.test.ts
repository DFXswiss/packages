import fixture from './fixtures/derivation-v1.json';
import type { BitcoinNetwork, WalletEnv } from '../config/environment';
import { KeyRing } from '../derivation/keyring';
import { LoginAutoSigner } from '../signing/auto-signer';
import { LOGIN_TEMPLATES } from '../signing/login-messages';
import { WalletError } from '../util/errors';

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

type LoginEnv = 'prd' | 'dev';

function ringOf(mnemonic: string, env: LoginEnv): KeyRing {
  const bitcoinNetwork: BitcoinNetwork = env === 'prd' ? 'mainnet' : 'testnet4';
  return KeyRing.fromMnemonic(mnemonic, { bitcoinNetwork });
}

describe('LoginAutoSigner known-answer vectors', () => {
  for (const vector of fixture.vectors) {
    for (const env of ['prd', 'dev'] as LoginEnv[]) {
      it(`signs the ${env} login of ${vector.name} exactly like the independent implementations`, () => {
        const signer = new LoginAutoSigner(ringOf(vector.mnemonic, env), env satisfies WalletEnv);
        const login = vector.login[env];

        expect(signer.sign('evm', login.evm.address, login.evm.message)).toBe(login.evm.signature);
        expect(signer.sign('bitcoin', login.bitcoin.address, login.bitcoin.message)).toBe(login.bitcoin.signature);
        expect(signer.sign('spark', login.spark.address, login.spark.message)).toBe(login.spark.signature);
      });
    }
  }
});

describe('LoginAutoSigner refusal', () => {
  const vector = fixture.vectors[0];
  const ring = ringOf(vector.mnemonic, 'prd');
  const signer = new LoginAutoSigner(ring, 'prd');
  const evm0 = vector.evm[0].address;

  it('refuses a message that deviates by a single byte', () => {
    expectWalletError(
      () => signer.sign('evm', evm0, `${LOGIN_TEMPLATES.general}${evm0} `), // trailing space
      'login-message-mismatch',
    );
    expectWalletError(() => signer.sign('evm', evm0, `x${vector.login.prd.evm.message}`), 'login-message-mismatch');
  });

  it('refuses the fallback template and foreign prefixes', () => {
    expectWalletError(() => signer.sign('evm', evm0, `${LOGIN_TEMPLATES.fallback}${evm0}`), 'login-message-mismatch');
    expectWalletError(
      () => signer.sign('evm', evm0, `[dev]_${LOGIN_TEMPLATES.general}${evm0}`),
      'login-message-mismatch',
    );
  });

  it('refuses addresses that are not owned by the wallet', () => {
    const foreign = '0x0000000000000000000000000000000000000001';
    const foreignMessage = `${LOGIN_TEMPLATES.general}${foreign}`;
    expectWalletError(() => signer.sign('evm', foreign, foreignMessage), 'login-message-mismatch');
    expectWalletError(
      () => signer.sign('bitcoin', 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu', 'anything'),
      'login-message-mismatch',
    );
  });

  it('refuses the family/address combination mismatch', () => {
    const sparkMessage = vector.login.prd.spark.message;
    expectWalletError(() => signer.sign('evm', vector.spark.address, sparkMessage), 'login-message-mismatch');
    expectWalletError(
      () => signer.sign('spark', vector.login.prd.evm.address, vector.login.prd.evm.message),
      'login-message-mismatch',
    );
  });

  it('signs a non-zero EVM index address when it is an own address', () => {
    const devSigner = new LoginAutoSigner(ringOf(vector.mnemonic, 'dev'), 'dev');
    const address = vector.evm[1].address;
    const message = `[dev]_${LOGIN_TEMPLATES.general}${address}`;
    expect(devSigner.sign('evm', address, message)).toHaveLength(2 + 64 * 2 + 2);
  });
});
