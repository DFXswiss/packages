import * as bitcoin from 'bitcoinjs-lib';
import './ecc-init';

export function extractBip322Signature(signedPsbtBase64: string): string {
  const psbt = bitcoin.Psbt.fromBase64(signedPsbtBase64);
  const input = psbt.data.inputs[0];
  if (!input) throw new Error('PSBT has no inputs');

  if (input.finalScriptWitness) {
    return input.finalScriptWitness.toString('base64');
  }

  psbt.finalizeInput(0);
  const finalized = psbt.data.inputs[0].finalScriptWitness;
  if (!finalized) throw new Error('Could not finalize PSBT input — missing or insufficient signatures');
  return finalized.toString('base64');
}
