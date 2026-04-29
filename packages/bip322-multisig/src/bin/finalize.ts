#!/usr/bin/env node
import * as fs from 'fs';
import { extractBip322Signature } from '../witness';

interface Args {
  psbt: string;
  address: string;
  api: string;
  submit: boolean;
}

function usage(): never {
  process.stderr.write(
    `Usage: bip322-finalize --psbt <file> --address <bc1q...> [--api <baseUrl>] [--no-submit]

Reads a signed BIP-322 PSBT (e.g. from Sparrow), extracts the witness as a
BIP-322 simple signature (Base64), and POSTs it to DFX /v1/auth.
Defaults: --api https://api.dfx.swiss
`,
  );
  process.exit(2);
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = { api: 'https://api.dfx.swiss', submit: true };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--psbt') {
      args.psbt = v;
      i++;
    } else if (k === '--address') {
      args.address = v;
      i++;
    } else if (k === '--api') {
      args.api = v.replace(/\/$/, '');
      i++;
    } else if (k === '--no-submit') {
      args.submit = false;
    } else {
      process.stderr.write(`Unknown arg: ${k}\n`);
      usage();
    }
  }
  if (!args.psbt || !args.address) usage();
  return args as Args;
}

function loadPsbtBase64(file: string): string {
  const raw = fs.readFileSync(file);
  const txt = raw.toString('utf8').trim();
  if (txt.startsWith('cHNidP') || /^[A-Za-z0-9+/=]+$/.test(txt)) return txt;
  return raw.toString('base64');
}

async function postAuth(apiBase: string, address: string, signature: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${apiBase}/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, signature }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`auth failed: ${res.status} ${text}`);
  return JSON.parse(text);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const psbtB64 = loadPsbtBase64(args.psbt);
  const sigB64 = extractBip322Signature(psbtB64);
  process.stdout.write(`✓ BIP-322 simple signature (${sigB64.length} chars):\n${sigB64}\n`);

  if (!args.submit) {
    process.stdout.write(`\n--no-submit set: skipping POST\n`);
    return;
  }

  process.stdout.write(`\n→ POST ${args.api}/v1/auth ...\n`);
  const r = await postAuth(args.api, args.address, sigB64);
  process.stdout.write(`✓ Authenticated. accessToken:\n${r.accessToken}\n`);
}

main().catch((e) => {
  process.stderr.write(`ERROR: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
