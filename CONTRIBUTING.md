# Contributing

This repository is a [Lerna](https://lerna.js.org/) monorepo that publishes several
packages to npm:

- `@dfx.swiss/core`
- `@dfx.swiss/react`
- `@dfx.swiss/react-components`
- `@dfx.swiss/bip322-multisig`

The packages are consumed as pinned npm dependencies by other DFX.swiss apps (e.g.
`DFXswiss/services`), so breaking changes ripple downstream through those version
pins. Keep public APIs stable where possible and flag breaking changes explicitly.

## Setup

```bash
npm install
```

Dependencies across the workspace are managed with npm workspaces + Lerna. CI runs on
Node 16.x (see `.github/workflows/pr.yaml`); `@dfx.swiss/bip322-multisig` additionally
declares `engines.node >= 18`.

## Build & Test

Commands run across all packages via Lerna (as in CI):

```bash
npx lerna run lint          # ESLint
npx lerna run format:check  # Prettier (verify only)
npx lerna run build         # tsc -b per package
npx lerna run test          # Jest (packages that define a test script)
```

Per-package scripts are also available from within a package directory
(`packages/<name>`):

```bash
npm run build          # tsc -b ./tsconfig.build.json
npm run lint           # eslint src
npm run lint:fix       # eslint src --fix
npm run format         # prettier --write src
npm run format:check   # prettier --check src
npm run test           # jest (core and bip322-multisig only)
npm run clean          # remove dist/ and build info
```

The PR CI (`.github/workflows/pr.yaml`) runs lint, format check, build and test on
every pull request against `develop` or `main`. Run these locally before pushing.

## Code style

- **TypeScript** everywhere; each package builds with `tsc -b ./tsconfig.build.json`.
- **Prettier** (`.prettierrc`): single quotes, trailing commas (`all`), print width 120.
- **ESLint** (`.eslintrc.json`): `no-console` is an error outside tests/stories,
  unused vars are errors (prefix intentionally unused ones with `_`). Warnings are
  treated as errors — do not introduce new ESLint warnings.
- Format and lint before committing: `npm run format` and `npm run lint:fix`.

## Tests

Tests use **Jest** with **ts-jest**. Test files live under `src/__tests__/` and match
`*.test.ts` (see `packages/core/src/__tests__/`). Only `@dfx.swiss/core` and
`@dfx.swiss/bip322-multisig` currently define a `test` script; add or extend tests when
you change or add functionality in those packages.

## Git & pull requests

- Branch off **`develop`**; open pull requests against **`develop`**. The `main`
  branch is the released state, updated only through automatic `develop -> main`
  release PRs.
- **Branch names** are prefixed by type, e.g. `feat/…`, `fix/…`, `chore/…`,
  `docs/…` (existing history also uses `feature/…`).
- **Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)**,
  imperative mood, optionally scoped by package or area, e.g.:
  - `feat(core): add Monitoring user role`
  - `fix(bip322-multisig): use @noble/curves v1 for CommonJS compatibility`
  - `chore: promote ESLint warnings to errors`

  This is not just convention: releases are produced with
  `lerna version --conventional-commits`, so the commit type (`feat`, `fix`, `BREAKING
  CHANGE`, …) directly determines the version bump. Use `feat!:` or a
  `BREAKING CHANGE:` footer for breaking changes.
- Keep PRs small and focused. Describe what changed and why; note any breaking change
  for downstream consumers.

## Versioning & releases — do not hand-bump

Versioning and publishing are fully automated by the publish workflow
(`.github/workflows/publish.yaml`) using Lerna, and packages are versioned
independently (`lerna.json`: `"version": "independent"`).

**Feature PRs must touch source only.** Do **not** manually edit in a feature PR:

- `version` fields in any `package.json`
- `CHANGELOG.md` files
- `package-lock.json` version pins

When changes land on `develop`, a separate `Publish` commit (authored by the release
workflow) bumps the affected package versions, updates the per-package `CHANGELOG.md`
and syncs `package-lock.json`, then publishes beta versions to npm. Pushing to `main`
graduates them to stable. (Reference: PR #181 changed only `src/` files; the following
`Publish` commit performed all version and changelog updates.)
