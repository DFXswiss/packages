import {
  BIP322_FULL_PREFIX,
  BIP322_POF_PREFIX,
  BIP322_SIMPLE_PREFIX,
  encodeBip322SimpleSignature,
  parseBip322SignatureEncoding,
} from '../core';
import { verifyBip322P2wshSignature } from '../verify';
import fixture from './fixtures/bip-0322-p2wsh-3of3.json';

const official = fixture.official;
const officialSignature = official.bip322_signatures[0];
const officialPayload = officialSignature.slice(BIP322_SIMPLE_PREFIX.length);

describe('parseBip322SignatureEncoding', () => {
  it('strips the smp prefix', () => {
    expect(parseBip322SignatureEncoding('smpABC')).toEqual({ variant: 'simple', payload: 'ABC' });
  });

  it('strips the ful prefix', () => {
    expect(parseBip322SignatureEncoding('fulXYZ')).toEqual({ variant: 'full', payload: 'XYZ' });
  });

  it('strips the pof prefix', () => {
    expect(parseBip322SignatureEncoding('pofZZ')).toEqual({ variant: 'pof', payload: 'ZZ' });
  });

  it('treats an unprefixed string as the full payload', () => {
    const unprefixed = 'AUCJexampleUnprefixedSignature';
    expect(parseBip322SignatureEncoding(unprefixed)).toEqual({ variant: 'unprefixed', payload: unprefixed });
  });
});

describe('encodeBip322SimpleSignature', () => {
  it('prefixes base64(witness) with smp and does not insert a colon', () => {
    const encoded = encodeBip322SimpleSignature(Buffer.from('hi'));
    expect(encoded).toBe('smp' + Buffer.from('hi').toString('base64'));
    expect(encoded.includes(':')).toBe(false);
  });
});

describe('BIP-322 Complete official P2WSH 3-of-3 vector', () => {
  it('verifies the official smp-prefixed signature', () => {
    expect(verifyBip322P2wshSignature(official.message, official.address, officialSignature)).toBe(true);
  });

  it('rejects the official signature for the wrong message', () => {
    expect(
      verifyBip322P2wshSignature(fixture.wrong_message.message, fixture.wrong_message.address, officialSignature),
    ).toBe(false);
  });

  it('still verifies the official payload without the smp prefix', () => {
    expect(verifyBip322P2wshSignature(official.message, official.address, officialPayload)).toBe(true);
  });

  it('returns false for ful and pof encodings of the official payload', () => {
    expect(
      verifyBip322P2wshSignature(official.message, official.address, BIP322_FULL_PREFIX + officialPayload),
    ).toBe(false);
    expect(
      verifyBip322P2wshSignature(official.message, official.address, BIP322_POF_PREFIX + officialPayload),
    ).toBe(false);
  });
});
