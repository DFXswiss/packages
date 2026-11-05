import fixture from './fixtures/derivation-v1.json';
import { WALLET_ENVS, SIGN_MESSAGE_PREFIX } from '../config/environment';
import { LOGIN_TEMPLATES, buildLoginMessage } from '../signing/login-messages';

describe('login templates', () => {
  it('are byte-for-byte the DFX API login texts', () => {
    // DFX API src/config/config.ts:440-445; the fixture generator pinned the general text independently.
    expect(LOGIN_TEMPLATES.general).toBe(
      'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_Blockchain_address._Your_ID:_',
    );
    expect(LOGIN_TEMPLATES.fallback).toBe(
      'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_DeFiChain_address_and_are_in_possession_of_its_private_key._Your_ID:_',
    );
    expect(LOGIN_TEMPLATES.general).toBe(fixture.login.general);
  });

  it('builds the login message for every environment', () => {
    const address = '0x9858EfFD232B4033E47d90003D41EC34EcaEda94';
    for (const env of WALLET_ENVS) {
      expect(buildLoginMessage(env, address)).toBe(SIGN_MESSAGE_PREFIX[env] + LOGIN_TEMPLATES.general + address);
    }
    expect(buildLoginMessage('dev', address)).toBe(`[dev]_${LOGIN_TEMPLATES.general}${address}`);
  });

  it('builds the fallback text only on request', () => {
    const address = 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu';
    expect(buildLoginMessage('prd', address, 'fallback')).toBe(`${LOGIN_TEMPLATES.fallback}${address}`);
  });

  it('matches the fixture login messages', () => {
    const vector = fixture.vectors[0];
    for (const env of ['prd', 'dev'] as const) {
      expect(vector.login[env].evm.message).toBe(buildLoginMessage(env, vector.evm[0].address));
      expect(vector.login[env].bitcoin.message).toBe(
        buildLoginMessage(env, vector.bitcoin[env === 'prd' ? 'mainnet' : 'testnet4'].receive[0].address),
      );
      expect(vector.login[env].spark.message).toBe(buildLoginMessage(env, vector.spark.address));
    }
  });
});
