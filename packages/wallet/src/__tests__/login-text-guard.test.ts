import { LOGIN_TEMPLATES } from '../signing/login-messages';
import { isDfxLoginText } from '../signing/login-text-guard';
import { utf8ToBytes } from '../util/bytes';

const ADDRESS = '0x9858EfFD232B4033E47d90003D41EC34EcaEda94';

describe('isDfxLoginText', () => {
  it('accepts the login text with any environment prefix and any address', () => {
    for (const prefix of ['', '[dev]_', '[loc]_', '[prd]_', '[staging]_']) {
      expect(isDfxLoginText(`${prefix}${LOGIN_TEMPLATES.general}${ADDRESS}`)).toBe(true);
      expect(isDfxLoginText(`${prefix}${LOGIN_TEMPLATES.fallback}${ADDRESS}`)).toBe(true);
    }
  });

  it('accepts the UTF-8 bytes of a login text', () => {
    expect(isDfxLoginText(utf8ToBytes(`${LOGIN_TEMPLATES.general}${ADDRESS}`))).toBe(true);
  });

  it('refuses everything else', () => {
    expect(isDfxLoginText('hello world')).toBe(false);
    expect(isDfxLoginText('')).toBe(false);
    // Template typo.
    expect(
      isDfxLoginText(
        'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_Blockchain_addres',
      ),
    ).toBe(false);
    // Prefix format violated.
    expect(isDfxLoginText(`[DEV]_${LOGIN_TEMPLATES.general}${ADDRESS}`)).toBe(false);
    expect(isDfxLoginText(`prefix_${LOGIN_TEMPLATES.general}${ADDRESS}`)).toBe(false);
    // Message the signer proxy must not refuse (random Spark protocol traffic).
    expect(isDfxLoginText('spark protocol message')).toBe(false);
  });
});
