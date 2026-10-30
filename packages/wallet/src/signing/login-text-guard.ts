import { bytesToUtf8 } from '../util/bytes';

/**
 * Shape of every DFX login text: optional lower-case environment prefix `[<env>]_`, then one of the two
 * login templates. Used to refuse exactly these texts in every signing path that is not the login auto-signer
 * (§9.3): message signing, dApp requests and the Spark signer proxy must never produce a DFX login proof.
 */
const DFX_LOGIN_TEXT =
  /^(\[[a-z]{1,16}\]_)?By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_(Blockchain|DeFiChain)_address/;

/** Whether the text (or its UTF-8 bytes) is a DFX login text, whatever the prefix and address. */
export function isDfxLoginText(text: string | Uint8Array): boolean {
  const value = typeof text === 'string' ? text : bytesToUtf8(text);
  return DFX_LOGIN_TEXT.test(value);
}
