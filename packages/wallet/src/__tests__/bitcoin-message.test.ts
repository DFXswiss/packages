import { base64 } from '@scure/base';
import fixture from './fixtures/derivation-v1.json';
import type { BitcoinNetwork } from '../config/environment';
import { verifyBitcoinMessage } from '../signing/bitcoin-message';

describe('BIP-137 verification against the fixture', () => {
  for (const vector of fixture.vectors) {
    for (const env of ['prd', 'dev'] as const) {
      it(`verifies the ${env} Bitcoin login signature of ${vector.name}`, () => {
        const network: BitcoinNetwork = env === 'prd' ? 'mainnet' : 'testnet4';
        const { address, message, signature } = vector.login[env].bitcoin;
        expect(verifyBitcoinMessage(network, address, message, signature)).toBe(true);
      });
    }
  }
});

describe('BIP-137 verification refusal', () => {
  const vector = fixture.vectors[0];
  const { address, message, signature } = vector.login.prd.bitcoin;

  it('refuses another address or message', () => {
    expect(verifyBitcoinMessage('mainnet', vector.bitcoin.mainnet.receive[1].address, message, signature)).toBe(false);
    expect(verifyBitcoinMessage('mainnet', address, `${message}x`, signature)).toBe(false);
    expect(verifyBitcoinMessage('testnet4', address, message, signature)).toBe(false);
  });

  it('refuses other headers than P2WPKH 39..42', () => {
    const decoded = base64.decode(signature);
    for (const header of [27, 31, 35, 38, 43]) {
      const mutated = base64.encode(new Uint8Array([header, ...decoded.subarray(1)]));
      expect(verifyBitcoinMessage('mainnet', address, message, mutated)).toBe(false);
    }
  });

  it('refuses malformed signatures', () => {
    expect(verifyBitcoinMessage('mainnet', address, message, '')).toBe(false);
    expect(verifyBitcoinMessage('mainnet', address, message, 'not base64 !!!')).toBe(false);
    expect(verifyBitcoinMessage('mainnet', address, message, base64.encode(new Uint8Array(64)))).toBe(false);
    expect(verifyBitcoinMessage('mainnet', address, message, base64.encode(new Uint8Array(66)))).toBe(false);
  });
});
