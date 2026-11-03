import { readdirSync, readFileSync } from 'fs';
import { join, relative, sep } from 'path';
import * as ts from 'typescript';

// The Breez and WalletConnect SDKs are large (WASM, relay client) and must stay out of the eager bundle: no file
// may import them at runtime except through a dynamic import() in its loader module. Type-only imports are free.
const LAZY_SDKS: { pattern: RegExp; loader: string }[] = [
  { pattern: /^@breeztech\//, loader: 'spark/loader.ts' },
  { pattern: /^@(reown|walletconnect)\//, loader: 'walletconnect/loader.ts' },
];

const SRC = join(__dirname, '..');

function findViolations(file: string, text: string): string[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const violations: string[] = [];

  const check = (node: ts.Node, specifier: ts.Expression | undefined, kind: 'static' | 'dynamic') => {
    if (!specifier || !ts.isStringLiteralLike(specifier)) {
      if (kind === 'dynamic') violations.push(`${file}: non-literal dynamic import`);
      return;
    }
    const sdk = LAZY_SDKS.find(({ pattern }) => pattern.test(specifier.text));
    if (!sdk) return;
    if (kind === 'dynamic' && file === sdk.loader) return;
    const { line } = source.getLineAndCharacterOfPosition(node.getStart());
    violations.push(`${file}:${line + 1}: ${kind} import of ${specifier.text}`);
  };

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      if (!node.importClause?.isTypeOnly) check(node, node.moduleSpecifier, 'static');
    } else if (ts.isExportDeclaration(node)) {
      if (!node.isTypeOnly) check(node, node.moduleSpecifier, 'static');
    } else if (ts.isImportEqualsDeclaration(node)) {
      if (!node.isTypeOnly && ts.isExternalModuleReference(node.moduleReference)) {
        check(node, node.moduleReference.expression, 'static');
      }
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) check(node, node.arguments[0], 'dynamic');
      else if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
        check(node, node.arguments[0], 'static');
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return violations;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return entry.name.endsWith('.ts') ? [path] : [];
  });
}

describe('lazy SDK imports', () => {
  it('detects runtime imports of the lazy SDKs', () => {
    const offending = [
      `import { connect } from '@breeztech/breez-sdk-spark/web';`,
      `import { type Payment } from '@breeztech/breez-sdk-spark';`,
      `import '@walletconnect/core';`,
      `export { WalletKit } from '@reown/walletkit';`,
      `export * from '@walletconnect/utils';`,
      `import sdk = require('@breeztech/breez-sdk-spark');`,
      `const sdk = require('@reown/walletkit');`,
      `const load = () => import('@breeztech/breez-sdk-spark/web');`,
      `const load = (name: string) => import(name);`,
    ];
    for (const text of offending) expect(findViolations('session/wallet.ts', text)).toHaveLength(1);
  });

  it('allows type-only imports anywhere and dynamic imports in the loader', () => {
    const allowed = [
      `import type { Payment } from '@breeztech/breez-sdk-spark';`,
      `export type { Payment } from '@breeztech/breez-sdk-spark';`,
      `type Sdk = typeof import('@breeztech/breez-sdk-spark');`,
      `import { secp256k1 } from '@noble/curves/secp256k1';`,
    ];
    for (const text of allowed) expect(findViolations('session/wallet.ts', text)).toEqual([]);

    const load = `export const load = () => import('@breeztech/breez-sdk-spark/web');`;
    expect(findViolations('spark/loader.ts', load)).toEqual([]);
    expect(findViolations('walletconnect/loader.ts', load)).toHaveLength(1);
    expect(findViolations('walletconnect/loader.ts', `export const load = () => import('@reown/walletkit');`)).toEqual(
      [],
    );
  });

  it('finds no runtime import of a lazy SDK in the package source', () => {
    const files = sourceFiles(SRC);
    expect(files.length).toBeGreaterThan(0);

    const violations = files.flatMap((path) =>
      findViolations(relative(SRC, path).split(sep).join('/'), readFileSync(path, 'utf8')),
    );
    expect(violations).toEqual([]);
  });
});
