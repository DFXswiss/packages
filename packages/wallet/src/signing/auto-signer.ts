import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import type { WalletEnv } from '../config/environment';
import { KeyRing, withPrivateKey } from '../derivation/keyring';
import { bytesToHex, concatBytes, utf8ToBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import { buildLoginMessage } from './login-messages';
import { signBitcoinMessageBip137 } from './bitcoin-message';
import { signSparkLogin } from './spark-login';

/** The server message did not exactly match the DFX login text of this address — never signed. */
export class LoginMessageMismatchError extends WalletError {
  constructor(detail: string) {
    super('login-message-mismatch', `Refusing to sign: ${detail}`);
  }
}

/** How many EVM accounts are scanned when matching a login address (the wallet uses index 0 by default). */
const EVM_ADDRESS_SCAN = 20;

const EIP_191_PREFIX = 'Ethereum Signed Message:\n';

/** EIP-191 personal_sign hash of the message. */
export function eip191MessageHash(message: string): Uint8Array {
  const content = utf8ToBytes(message);
  return keccak_256(concatBytes(utf8ToBytes(`\x19${EIP_191_PREFIX}${content.length}`), content));
}

/** EIP-191 signature as the DFX API expects it: 0x-prefixed lowercase hex r‖s‖v, v = 27 + recovery id. */
function signEip191(message: string, privateKey: Uint8Array): string {
  const signature = secp256k1.sign(eip191MessageHash(message), privateKey);
  return `0x${bytesToHex(concatBytes(signature.toBytes('compact'), new Uint8Array([27 + signature.recovery])))}`;
}

/**
 * The only silent signer of the wallet (§8.5): signs exactly the DFX login text of one of the wallet's own
 * addresses — EVM EIP-191, Bitcoin BIP-137 P2WPKH, Spark D31 — and refuses every other message byte-for-byte,
 * so a malicious server text can never be signed under the login pretext.
 */
export class LoginAutoSigner {
  constructor(
    private readonly keys: KeyRing,
    private readonly env: WalletEnv,
  ) {}

  sign(family: 'evm' | 'bitcoin' | 'spark', address: string, serverMessage: string): string {
    const expected = buildLoginMessage(this.env, address);
    if (serverMessage !== expected) {
      throw new LoginMessageMismatchError(
        `the server message is not the ${this.env} login text of ${address} (expected ${JSON.stringify(expected)})`,
      );
    }

    switch (family) {
      case 'evm':
        return this.signEvm(address, serverMessage);
      case 'bitcoin':
        return this.signBitcoin(address, serverMessage);
      case 'spark':
        return this.signSpark(address, serverMessage);
      default:
        throw new LoginMessageMismatchError(`unknown login family ${String(family)}`);
    }
  }

  private signEvm(address: string, message: string): string {
    for (let index = 0; index < EVM_ADDRESS_SCAN; index++) {
      if (this.keys.evm(index).address.toLowerCase() === address.toLowerCase()) {
        return withPrivateKey(this.keys, { family: 'evm', index }, (privateKey) => signEip191(message, privateKey));
      }
    }
    throw new LoginMessageMismatchError(`${address} is not an EVM address of this wallet`);
  }

  private signBitcoin(address: string, message: string): string {
    // The Bitcoin login address is receive chain 0, index 0 of the wallet's network.
    if (this.keys.bitcoinAddress(0, 0).address !== address) {
      throw new LoginMessageMismatchError(`${address} is not the Bitcoin login address of this wallet`);
    }
    return withPrivateKey(this.keys, { family: 'bitcoin', chain: 0, index: 0 }, (privateKey) =>
      signBitcoinMessageBip137(message, privateKey),
    );
  }

  private signSpark(address: string, message: string): string {
    if (this.keys.sparkIdentity().address !== address) {
      throw new LoginMessageMismatchError(`${address} is not the Spark address of this wallet`);
    }
    return withPrivateKey(this.keys, { family: 'spark' }, (privateKey) => signSparkLogin(message, privateKey));
  }
}
