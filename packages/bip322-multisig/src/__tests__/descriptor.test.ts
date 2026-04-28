import { parseDescriptor, deriveAddress, findAddress, p2wshAddress, buildSortedMultisigScript } from '../descriptor';

const testDescriptor =
  'wsh(sortedmulti(2,' +
  '[1bb8690c/48h/0h/0h/2h]xpub6EBLyXgtnSWSBU1w4LoKDVd9HCgLSLzeQLdBVFCyAMyj9zJkmYETsbg8AiYG3Jbva5oYDSWBfkBeptREEqmAqMu2skRR37F9mG2sAExacDt/<0;1>/*,' +
  '[4c6ad2dd/48h/0h/0h/2h]xpub6EZmQU6eoRTP6Pg8qQUtmtxJ1PSSWMkvm3TSWMwK77rMcAujGVx1YAtcrRNjgTpDkeYGyxskUuJxTy4bVCkK4E62WGhggQmZ8CWBSa8bnP7/<0;1>/*,' +
  '[593e1579/48h/0h/0h/2h]xpub6EfMCm6rZteRoEiEfnSevj5Cd2M1mVi1m4Ua3utM7zHV7HJTQVv7hFrvms2qCzZRAPgVUsvP2Mdr9mYnEdeowXhausk97j7PbBkQG6yGL2E/<0;1>/*' +
  '))#2q0ffjjc';

const testAddress = 'bc1qsy93ywfzzp4e8aczvzn4452jmlwvyp2fklnm2qevnyzlmyd672pqrl3cep';

describe('parseDescriptor', () => {
  it('parses valid wsh(sortedmulti) descriptor with checksum', () => {
    const d = parseDescriptor(testDescriptor);
    expect(d.threshold).toBe(2);
    expect(d.keys).toHaveLength(3);
    expect(d.keys[0].fingerprint).toBe('1bb8690c');
    expect(d.keys[0].originPath).toBe('48h/0h/0h/2h');
    expect(d.keys[0].xpub.startsWith('xpub')).toBe(true);
    expect(d.receiveBranch).toBe(0);
    expect(d.changeBranch).toBe(1);
  });

  it('parses descriptor without checksum', () => {
    const noCheck = testDescriptor.replace(/#[a-z0-9]+$/, '');
    const d = parseDescriptor(noCheck);
    expect(d.threshold).toBe(2);
  });

  it('rejects non-wsh descriptors', () => {
    expect(() => parseDescriptor('sh(multi(2,03abcd...,03dcba...))')).toThrow();
  });

  it('rejects malformed descriptors', () => {
    expect(() => parseDescriptor('wsh(sortedmulti(2,plain-pubkey))')).toThrow();
  });

  it('accepts apostrophe-style hardened paths (Bitcoin Core / Coldcard format)', () => {
    const apo = testDescriptor.replace(/h(?=[/\]])/g, "'");
    const d = parseDescriptor(apo);
    expect(d.threshold).toBe(2);
    expect(d.keys[0].originPath).toBe('48h/0h/0h/2h');
  });

  it('accepts descriptors with whitespace and newlines', () => {
    const withSpaces = testDescriptor
      .replace('wsh(sortedmulti(2,', 'wsh(sortedmulti(2,\n  ')
      .replace(/,\[/g, ',\n  [')
      .replace('))#', '\n))#');
    const d = parseDescriptor(withSpaces);
    expect(d.threshold).toBe(2);
    expect(d.keys).toHaveLength(3);
  });

  it('rejects descriptors with inconsistent receive/change branches', () => {
    const inconsistent = testDescriptor.replace('<0;1>/*,', '<2;3>/*,');
    expect(() => parseDescriptor(inconsistent)).toThrow(/Inconsistent/);
  });
});

describe('deriveAddress', () => {
  it('derives the expected receive address at /0/7', () => {
    const desc = parseDescriptor(testDescriptor);
    const derived = deriveAddress(desc, 0, 7);
    expect(derived.address).toBe(testAddress);
    expect(derived.pubkeys).toHaveLength(3);
    expect(derived.witnessScript[0]).toBe(0x52);
    expect(derived.witnessScript[derived.witnessScript.length - 1]).toBe(0xae);
  });

  it('derives different addresses for different indices', () => {
    const desc = parseDescriptor(testDescriptor);
    const a = deriveAddress(desc, 0, 0).address;
    const b = deriveAddress(desc, 0, 1).address;
    expect(a).not.toBe(b);
  });
});

describe('findAddress', () => {
  it('finds the matching child index', () => {
    const desc = parseDescriptor(testDescriptor);
    const found = findAddress(desc, testAddress);
    expect(found).not.toBeNull();
    expect(found!.branch).toBe(0);
    expect(found!.index).toBe(7);
  });

  it('returns null for unknown address', () => {
    const desc = parseDescriptor(testDescriptor);
    const found = findAddress(desc, 'bc1qjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunkjunk0qrl3cep', 5);
    expect(found).toBeNull();
  });
});

describe('p2wshAddress + buildSortedMultisigScript', () => {
  it('produces P2WSH address from witness script', () => {
    const pk1 = Buffer.from('022cd3d962e7ddc2576d0e27b5ed329b8dc7fc10abcf62e23a238c54c19a0c43be', 'hex');
    const pk2 = Buffer.from('0282801a608167af7687e65ced842c2bd8b679a57f5afb1de20aa800c79f759d4d', 'hex');
    const pk3 = Buffer.from('037d0bdd7d012df409484aa82caab2f879cc6b83754f95b9fc54b299aa500f31eb', 'hex');
    const ws = buildSortedMultisigScript([pk1, pk2, pk3], 2);
    expect(p2wshAddress(ws)).toBe(testAddress);
  });

  it('rejects out-of-range threshold', () => {
    expect(() => buildSortedMultisigScript([Buffer.from('02' + '00'.repeat(32), 'hex')], 0)).toThrow();
    expect(() => buildSortedMultisigScript([Buffer.from('02' + '00'.repeat(32), 'hex')], 17)).toThrow();
  });

  it('rejects pubkeys that are not 33 bytes (compressed)', () => {
    const uncompressed = Buffer.alloc(65);
    uncompressed[0] = 0x04;
    expect(() => buildSortedMultisigScript([uncompressed], 1)).toThrow(/33 bytes/);
  });

  it('rejects pubkeys with wrong leading byte', () => {
    const bad = Buffer.alloc(33);
    bad[0] = 0x05;
    expect(() => buildSortedMultisigScript([bad], 1)).toThrow(/0x02 or 0x03/);
  });
});
