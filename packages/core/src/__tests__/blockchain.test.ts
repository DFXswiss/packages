import { Blockchain } from '../definitions/blockchain';

describe('Blockchain', () => {
  it('names the Bitcoin networks as the DFX API does', () => {
    expect(Blockchain.BITCOIN).toBe('Bitcoin');
    expect(Blockchain.BITCOIN_TESTNET4).toBe('BitcoinTestnet4');
    expect(Blockchain.BITCOIN_REGTEST).toBe('BitcoinRegtest');
  });

  it('has unique values', () => {
    const values = Object.values(Blockchain);
    expect(new Set(values).size).toBe(values.length);
  });
});
