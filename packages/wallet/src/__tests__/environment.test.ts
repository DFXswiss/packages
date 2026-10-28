import {
  isWalletEnv,
  RP_IDS,
  SIGN_MESSAGE_PREFIX,
  WALLET_ENVS,
  WALLET_NETWORKS,
  WalletEnv,
} from '../config/environment';

describe('environment', () => {
  it('lists exactly the DFX environments', () => {
    expect([...WALLET_ENVS]).toEqual(['prd', 'dev', 'loc']);
    expect(WALLET_ENVS.every(isWalletEnv)).toBe(true);
    for (const value of ['PRD', 'stg', '', undefined, null, 1]) expect(isWalletEnv(value)).toBe(false);
  });

  it('pins the RP IDs', () => {
    expect(RP_IDS).toEqual({ prd: 'app.dfx.swiss', dev: 'dev-app.dfx.swiss', loc: 'localhost' });
  });

  it('keeps every non-production RP ID outside the production RP scope', () => {
    for (const env of ['dev', 'loc'] as WalletEnv[]) {
      expect(RP_IDS[env]).not.toBe(RP_IDS.prd);
      expect(RP_IDS[env].endsWith(`.${RP_IDS.prd}`)).toBe(false);
    }
  });

  it('uses the login message prefix of the DFX API', () => {
    // Same expression as the API: environment === PRD ? '' : `[${environment}]_` (src/config/config.ts:410).
    for (const env of WALLET_ENVS) {
      expect(SIGN_MESSAGE_PREFIX[env]).toBe(env === 'prd' ? '' : `[${env}]_`);
    }
    expect(SIGN_MESSAGE_PREFIX).toEqual({ prd: '', dev: '[dev]_', loc: '[loc]_' });
  });

  it('uses mainnets on PRD, test networks on DEV and LOC, and Spark mainnet everywhere', () => {
    expect(WALLET_NETWORKS).toEqual({
      prd: { bitcoin: 'mainnet', spark: 'mainnet', evm: 'mainnet' },
      dev: { bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' },
      loc: { bitcoin: 'testnet4', spark: 'mainnet', evm: 'testnet' },
    });
  });

  it('cannot be changed at runtime', () => {
    expect(Object.isFrozen(WALLET_ENVS)).toBe(true);
    expect(Object.isFrozen(RP_IDS)).toBe(true);
    expect(Object.isFrozen(SIGN_MESSAGE_PREFIX)).toBe(true);
    expect(Object.isFrozen(WALLET_NETWORKS)).toBe(true);
    for (const env of WALLET_ENVS) expect(Object.isFrozen(WALLET_NETWORKS[env])).toBe(true);

    expect(() => {
      (RP_IDS as Record<WalletEnv, string>).prd = 'dfx.swiss';
    }).toThrow(TypeError);
    expect(RP_IDS.prd).toBe('app.dfx.swiss');
  });
});
