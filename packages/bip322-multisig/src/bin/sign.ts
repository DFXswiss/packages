#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { buildBip322Psbt } from '../psbt';

interface Args {
  descriptor: string;
  address: string;
  api: string;
  out: string;
  maxIndex: number;
}

function usage(): never {
  process.stderr.write(
    `Usage: bip322-sign --descriptor <descriptor> --address <bc1q...> [--api <baseUrl>] [--out <file>] [--max-index <N>]

Builds a BIP-322 to_sign PSBT for the given P2WSH multisig address.
Defaults: --api https://api.dfx.swiss --out bip322-tosign.psbt --max-index 200

After running, open the resulting PSBT in Sparrow, sign with the threshold
number of cosigners, save it, and run bip322-finalize.
`,
  );
  process.exit(2);
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = { api: 'https://api.dfx.swiss', out: 'bip322-tosign.psbt', maxIndex: 200 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--descriptor') {
      args.descriptor = v;
      i++;
    } else if (k === '--address') {
      args.address = v;
      i++;
    } else if (k === '--api') {
      args.api = v.replace(/\/$/, '');
      i++;
    } else if (k === '--out') {
      args.out = v;
      i++;
    } else if (k === '--max-index') {
      args.maxIndex = parseInt(v, 10);
      i++;
    } else {
      process.stderr.write(`Unknown arg: ${k}\n`);
      usage();
    }
  }
  if (!args.descriptor || !args.address) usage();
  return args as Args;
}

async function fetchChallenge(apiBase: string, address: string): Promise<{ message: string }> {
  const url = `${apiBase}/v1/auth/signMessage?address=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`signMessage failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as { message: string };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const { message } = await fetchChallenge(args.api, args.address);
  process.stdout.write(`✓ Challenge: ${message}\n`);

  const built = buildBip322Psbt({
    message,
    descriptor: args.descriptor,
    address: args.address,
    maxIndex: args.maxIndex,
  });
  process.stdout.write(`✓ Address derived at /${built.derived.branch}/${built.derived.index}\n`);
  process.stdout.write(`✓ to_spend.txid: ${built.toSpendTxid}\n`);

  fs.writeFileSync(args.out, built.psbtBase64);
  process.stdout.write(`✓ Written: ${path.resolve(args.out)}\n\n`);
  process.stdout.write(`Next steps:\n`);
  process.stdout.write(`  1. Open Sparrow → File → Open Transaction → ${args.out}\n`);
  process.stdout.write(`  2. Sign with the threshold number of cosigners (OP_RETURN warning is expected)\n`);
  process.stdout.write(`  3. Sparrow → File → Save Transaction → choose .psbt\n`);
  process.stdout.write(`  4. Run: bip322-finalize --psbt <signed.psbt> --address ${args.address}\n`);
}

main().catch((e) => {
  process.stderr.write(`ERROR: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
