import { base64UrlDecode, base64UrlEncode, bytesToHex, equalBytes, utf8ToBytes, wipeBytes } from '../util/bytes';
import { Emitter } from '../util/emitter';
import { isWalletError, WalletError } from '../util/errors';
import { decodeJwtPayload } from '../util/jwt';
import { randomBytes } from '../util/random';

describe('bytes', () => {
  it('encodes base64url without padding and decodes with or without padding', () => {
    const bytes = new Uint8Array([0xfb, 0xff, 0xfe, 0x00, 0x01]);
    expect(base64UrlEncode(bytes)).toBe('-__-AAE');
    expect(base64UrlDecode('-__-AAE')).toEqual(bytes);
    expect(base64UrlDecode('-__-AAE=')).toEqual(bytes);
    expect(base64UrlEncode(new Uint8Array())).toBe('');
  });

  it('refuses standard base64 characters', () => {
    expect(() => base64UrlDecode('+//+AAE')).toThrow();
  });

  it('compares byte arrays', () => {
    expect(equalBytes(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(equalBytes(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(equalBytes(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
    expect(equalBytes(new Uint8Array(), new Uint8Array())).toBe(true);
  });

  it('wipes buffers in place', () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = utf8ToBytes('secret');
    wipeBytes(a, undefined, b);
    expect(bytesToHex(a)).toBe('000000');
    expect(b.every((byte) => byte === 0)).toBe(true);
  });
});

describe('randomBytes', () => {
  it('returns the requested number of random bytes', () => {
    expect(randomBytes(0)).toHaveLength(0);
    const a = randomBytes(32);
    const b = randomBytes(32);
    expect(a).toHaveLength(32);
    expect(equalBytes(a, b)).toBe(false);
  });

  it('fills buffers beyond the per-call limit of getRandomValues', () => {
    const bytes = randomBytes(65536 * 2 + 10);
    expect(bytes).toHaveLength(131082);
    expect(bytes.subarray(131072).some((byte) => byte !== 0)).toBe(true);
  });

  it('refuses invalid lengths', () => {
    expect(() => randomBytes(-1)).toThrow(RangeError);
    expect(() => randomBytes(1.5)).toThrow(RangeError);
  });
});

describe('decodeJwtPayload', () => {
  const jwt = (payload: string) => `eyJhbGciOiJIUzI1NiJ9.${base64UrlEncode(utf8ToBytes(payload))}.c2ln`;

  it('decodes the payload claims', () => {
    const token = jwt('{"account":42,"role":"Account","passkeyCredential":7,"exp":1767225600,"name":"Zürich"}');
    expect(decodeJwtPayload(token)).toEqual({
      account: 42,
      role: 'Account',
      passkeyCredential: 7,
      exp: 1767225600,
      name: 'Zürich',
    });
  });

  it.each([
    ['too few parts', 'a.b'],
    ['too many parts', 'a.b.c.d'],
    ['empty payload', 'a..c'],
    ['invalid base64url', 'a.!!!.c'],
    ['invalid JSON', jwt('{')],
    ['array payload', jwt('[1]')],
    ['string payload', jwt('"x"')],
    ['null payload', jwt('null')],
  ])('refuses a token with %s', (_case, token) => {
    const error = (() => {
      try {
        decodeJwtPayload(token);
      } catch (e) {
        return e;
      }
    })();
    expect(isWalletError(error, 'invalid-jwt')).toBe(true);
  });
});

describe('Emitter', () => {
  type Events = { locked: { reason: string }; synced: number };

  it('delivers events to the listeners of that event until they are removed', () => {
    const emitter = new Emitter<Events>();
    const locked = jest.fn();
    const synced = jest.fn();
    const off = emitter.on('locked', locked);
    emitter.on('synced', synced);

    emitter.emit('locked', { reason: 'idle' });
    expect(locked).toHaveBeenCalledWith({ reason: 'idle' });
    expect(synced).not.toHaveBeenCalled();

    off();
    emitter.emit('locked', { reason: 'manual' });
    expect(locked).toHaveBeenCalledTimes(1);
    expect(emitter.listenerCount('locked')).toBe(0);
    expect(emitter.listenerCount('synced')).toBe(1);

    emitter.removeAllListeners();
    expect(emitter.listenerCount('synced')).toBe(0);
  });

  it('isolates a throwing listener', () => {
    const errors: unknown[] = [];
    const emitter = new Emitter<Events>((error) => errors.push(error));
    const failure = new Error('listener failed');
    const after = jest.fn();
    emitter.on('synced', () => {
      throw failure;
    });
    emitter.on('synced', after);

    expect(() => emitter.emit('synced', 1)).not.toThrow();
    expect(after).toHaveBeenCalledWith(1);
    expect(errors).toEqual([failure]);
  });

  it('does not call a listener added while emitting in the same emission', () => {
    const emitter = new Emitter<Events>();
    const late = jest.fn();
    emitter.on('synced', () => emitter.on('synced', late));
    emitter.emit('synced', 1);
    expect(late).not.toHaveBeenCalled();
  });
});

describe('WalletError', () => {
  it('carries a code, its class name and an optional cause', () => {
    class ExampleError extends WalletError {}
    const cause = new Error('inner');
    const error = new ExampleError('example-code', 'Example message', { cause });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(WalletError);
    expect(error.name).toBe('ExampleError');
    expect(error.message).toBe('Example message');
    expect(error.cause).toBe(cause);
    expect(isWalletError(error)).toBe(true);
    expect(isWalletError(error, 'example-code')).toBe(true);
    expect(isWalletError(error, 'other')).toBe(false);
    expect(isWalletError(new Error('x'))).toBe(false);
    expect(new WalletError('only-code').message).toBe('only-code');
  });
});
