import type { WalletEnv } from '../config/environment';
import { SIGN_MESSAGE_PREFIX } from '../config/environment';

/**
 * The two login texts of the DFX API, byte-for-byte. `general` is the wallet login text for every blockchain
 * (`Config.auth.signMessageGeneral`, config.ts:443-445); `fallback` is the historical DeFiChain text
 * (`Config.auth.signMessage`). The API puts the environment prefix in front of both (config.ts:410), the
 * address behind. Changing any byte invalidates every future login signature.
 */
export const LOGIN_TEMPLATES = Object.freeze({
  general:
    'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_Blockchain_address._Your_ID:_',
  fallback:
    'By_signing_this_message,_you_confirm_that_you_are_the_sole_owner_of_the_provided_DeFiChain_address_and_are_in_possession_of_its_private_key._Your_ID:_',
} as const);

export type LoginTemplate = keyof typeof LOGIN_TEMPLATES;

/** The exact text the DFX API asks a wallet address to sign: prefix + template + address. */
export function buildLoginMessage(env: WalletEnv, address: string, template: LoginTemplate = 'general'): string {
  return SIGN_MESSAGE_PREFIX[env] + LOGIN_TEMPLATES[template] + address;
}
