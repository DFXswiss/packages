import { base64 } from '@scure/base';
import { KeyRing } from '../derivation/keyring';
import { bip322MessageHash, signBitcoinMessageBip322, verifyBip322Simple } from '../signing/bip322';
import { buildLoginMessage } from '../signing/login-messages';
import { bytesToHex } from '../util/bytes';
import { WalletError } from '../util/errors';

const ABANDON = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const RECEIVE0 = 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk';

/** BIP-322 simple signatures of the regtest receive 0 address, computed with bip322-js 2.0.0 (RFC 6979). */
const BIP322_JS: Record<string, string> = {
  '': 'AkgwRQIhAIIbRLZOo2Z3My+yH7hKqqMFU7jTkHcZujBZ0J/eETJ9AiAXs9wDAvbBHigvETaKjr0Gftq9//8nmKIHshAZUtt85AEhAuerJTe11J6XAwmq4G6eSfNs4cn+u9ROyODRzKC0+cMZ',
  'Hello World':
    'AkgwRQIhAL+mddSrhcldy5zpzS01E0mioqQBl5ssQfsyGERmSqFHAiBfLcBBBaehTvbWf3oRy76egcmrzxbI87uvOIea0BK9AQEhAuerJTe11J6XAwmq4G6eSfNs4cn+u9ROyODRzKC0+cMZ',
  'regtest ✓':
    'AkcwRAIgEcf5xFJGuvK0O+VPDCRxvQFPMzyuIUxUeU2Z4QsziD0CICpxpt4fYs/qd539S4FtVt3+1CNhTbQ/R8iAcZUm6Y4CASEC56slN7XUnpcDCargbp5J82zhyf671E7I4NHMoLT5wxk=',
};

/** The test vectors of BIP-322 itself (mainnet P2WPKH). */
const OFFICIAL = {
  address: 'bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l',
  empty:
    'AkcwRAIgM2gBAQqvZX15ZiysmKmQpDrG83avLIT492QBzLnQIxYCIBaTpOaD20qRlEylyxFSeEA2ba9YOixpX8z46TSDtS40ASECx/EgAxlkQpQ9hYjgGu6EBCPMVPwVIVJqO4XCsMvViHI=',
  helloWorld:
    'AkcwRAIgZRfIY3p7/DoVTty6YZbWS71bc5Vct9p9Fia83eRmw2QCICK/ENGfwLtptFluMGs2KsqoNSk89pO7F29zJLUx9a/sASECx/EgAxlkQpQ9hYjgGu6EBCPMVPwVIVJqO4XCsMvViHI=',
};

function regtestRing(): KeyRing {
  return KeyRing.fromMnemonic(ABANDON, { bitcoinNetwork: 'regtest', env: 'dev' });
}

describe('BIP-322 message hash', () => {
  it('matches the BIP-322 vectors', () => {
    expect(bytesToHex(bip322MessageHash(''))).toBe('c90c269c4f8fcbe6880f72a721ddfbf1914268a794cbb21cfafee13770ae19f1');
    expect(bytesToHex(bip322MessageHash('Hello World'))).toBe(
      'f0eb03b1a75ac6d9847f55c624a99169b5dccba2a31f5b23bea77ba270de0a7a',
    );
  });
});

describe('BIP-322 simple verification', () => {
  it('accepts the official BIP-322 signatures', () => {
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, '', OFFICIAL.empty)).toBe(true);
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, 'Hello World', OFFICIAL.helloWorld)).toBe(true);
  });

  it('rejects swapped messages, other networks and malformed input', () => {
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, 'Hello World', OFFICIAL.empty)).toBe(false);
    expect(verifyBip322Simple('regtest', OFFICIAL.address, '', OFFICIAL.empty)).toBe(false);
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, '', 'not base64!')).toBe(false);
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, '', base64.encode(new Uint8Array([0x00])))).toBe(false);
    const bytes = base64.decode(OFFICIAL.empty);
    expect(
      verifyBip322Simple('mainnet', OFFICIAL.address, '', base64.encode(bytes.subarray(0, bytes.length - 1))),
    ).toBe(false);
    const otherSighash = bytes.slice();
    otherSighash[1 + 1 + 0x47 - 1] = 0x81; // last byte of the signature item: SIGHASH_ALL|ANYONECANPAY
    expect(verifyBip322Simple('mainnet', OFFICIAL.address, '', base64.encode(otherSighash))).toBe(false);
  });
});

describe('BIP-322 signing of bcrt1 addresses', () => {
  it('produces the bip322-js signatures', () => {
    const ring = regtestRing();
    for (const [message, expected] of Object.entries(BIP322_JS)) {
      expect(signBitcoinMessageBip322(ring, RECEIVE0, message)).toBe(expected);
      expect(verifyBip322Simple('regtest', RECEIVE0, message, expected)).toBe(true);
    }
  });

  it('signs with change addresses and verifies only for the signing address', () => {
    const ring = regtestRing();
    const change = ring.bitcoinAddress(1, 3).address;
    const signature = signBitcoinMessageBip322(ring, change, 'proof');
    expect(verifyBip322Simple('regtest', change, 'proof', signature)).toBe(true);
    expect(verifyBip322Simple('regtest', RECEIVE0, 'proof', signature)).toBe(false);
  });

  it('refuses DFX login texts and foreign addresses', () => {
    const ring = regtestRing();
    expect(() => signBitcoinMessageBip322(ring, RECEIVE0, buildLoginMessage('dev', RECEIVE0))).toThrow(WalletError);
    expect(() => signBitcoinMessageBip322(ring, OFFICIAL.address, 'x')).toThrow(/not a Bitcoin address of this wallet/);
    expect(() => signBitcoinMessageBip322(ring, 'tb1q6rz28mcfaxtmd6v789l9rrlrusdprr9pqcpvkl', 'x')).toThrow(
      WalletError,
    );
  });
});
