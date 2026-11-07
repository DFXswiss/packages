# Contributing

This repository is a [Lerna](https://lerna.js.org/) monorepo that publishes several
packages to npm:

- `@dfx.swiss/core`
- `@dfx.swiss/react`
- `@dfx.swiss/react-components`
- `@dfx.swiss/bip322-multisig`
- `@dfx.swiss/wallet`

The packages are consumed as pinned npm dependencies by other DFX.swiss apps (e.g.
`DFXswiss/app`), so breaking changes ripple downstream through those version
pins. Keep public APIs stable where possible and flag breaking changes explicitly.

## Setup

```bash
npm install
```

Dependencies across the workspace are managed with npm workspaces + Lerna. PR CI and
publishing run on Node 24.x (see `.github/workflows/pr.yaml` and `publish.yaml`); use
Node 24 locally as well (Lerna 9 requires Node `^20.19 || ^22.12 || >=24`).
`@dfx.swiss/bip322-multisig` additionally declares `engines.node >= 18`.

## Build & Test

Commands run across all packages via Lerna (the same tasks CI uses; locally they always cover every package):

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
npm run test           # jest (all packages except react-components)
npm run clean          # remove dist/ and build info
```

The same Lerna tasks used by CI can be run across all packages locally. In CI,
develop PRs run those tasks only for packages changed since the merge base
(`--since`). Apply the `ci:full` label to force a full run; adding or removing
any label retriggers the workflow. PRs into `main`, `workflow_dispatch`, paths
containing characters outside `A-Za-z0-9._/-`, infrastructure
(`lerna.json`, root `package.json` / `package-lock.json`, root `tsconfig*.json`,
`.eslintrc.json`, `.prettierrc`, `.github/workflows/`), and any deleted file
under `packages/` also trigger a full run.

## Code style

- **TypeScript** everywhere; each package builds with `tsc -b ./tsconfig.build.json`.
- **Prettier** (`.prettierrc`): single quotes, trailing commas (`all`), print width 120.
- **ESLint** (`.eslintrc.json`): the project-specific rules are set to error — e.g.
  `no-console` (outside tests/stories) and unused vars (prefix intentionally unused
  ones with `_`). Rules inherited at warn level from the shared configs do not fail
  lint or CI — still, do not introduce new ESLint warnings.
- Format and lint before committing: `npm run format` and `npm run lint:fix`.
- `@dfx.swiss/wallet` builds with its own TypeScript 5 from its `devDependencies` (the
  workspace root has TypeScript 4.9) and may load the Breez and WalletConnect SDKs only
  through a dynamic `import()` in `src/spark/loader.ts` and `src/walletconnect/loader.ts`
  (enforced by its `.eslintrc.json` and `no-static-sdk-import.test.ts`).

## Tests

Tests use **Jest** with **ts-jest**. Test files live under `src/__tests__/` and match
`*.test.ts` (see `packages/core/src/__tests__/`). Every package except
`@dfx.swiss/react-components` defines a `test` script; add or extend tests when you change
or add functionality in those packages. `@dfx.swiss/wallet` tests only transpile
(`isolatedModules`); its `npm run build` does the type checking.

## A38

This repository requires A38 according to the canonical A38 standard in
[DFXswiss/agent](https://github.com/DFXswiss/agent/blob/5a9c1be2c03a85e3844a48e0da57df6118915d35/docs/a38.md)
at commit `5a9c1be2c03a85e3844a48e0da57df6118915d35`. Repo job selection:
`.github/a38.json`. Target-branch applicability and fork workflow approval:
`.github/pr-guard.json`. `workflow_approval.workflows` stays a required field
there but no longer filters: after a fresh enforce pass the guard approves
every initial held fork `pull_request` run. `dfx pr guard` is
[wired in](https://github.com/DFXswiss/agent/blob/5a9c1be2c03a85e3844a48e0da57df6118915d35/docs/a38-guard.md#how-fork-github-actions-are-meant-to-work).

This is a **public** repository. GitHub-hosted runners still execute PR CI
(check name `Lint, build and test`). A38 does not replace that GitHub check.
The author report runs the same four Lerna tasks that job runs at full scope,
on Node 24, the major in `.github/workflows/pr.yaml`: `npx lerna run lint`,
`npx lerna run format:check`, `npx lerna run build`, and `npx lerna run test`. Publish, Storybook deploy, the release bot, and the
main-branch ancestry check are excluded.

Draft pull requests run the GitHub PR CI job. GitHub holds fork runs from
external contributors as `action_required`. Ready does not start CI. After a
fresh A38 enforce pass on the current head, `dfx pr guard` approves those
waiting initial runs, then sets Ready when the review rule below is met,
required GitHub jobs are green, and the PR is mergeable.

Two reviews are required before Ready. One review is enough only when the
pull request opener is listed in one_review_authors in the trusted
.github/pr-guard.json on the default branch. A missing file, a missing key,
or an empty list keeps two reviews required. An entry that exists only on
the pull request head does not count.

The newest well-formed second review comment that covers the current head
returns a Ready pull request to draft when its `blocks_merge` is true and it
counts at least one defect; a newer well-formed second review with
`blocks_merge` false clears that. The merger does not click Approve and run
workflows. Do not ask a maintainer to approve workflow runs. Post the A38
report on the current head.

## Git & pull requests

- Branch off **`develop`**; open pull requests against **`develop`**. The `main`
  branch is the released state, updated only through automatic `develop -> main`
  release PRs.
- CI rejects a pull request into `main` unless its head is this repository's
  `develop` (check name `Main only from develop`).
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

### When a release does not publish

GitHub skips every push- and pull-request-triggered workflow when the head commit
message contains `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]` or
`[actions skip]` anywhere, body included. The `develop -> main` merge commit lists the
messages of all commits the release PR brings in, so a single marker in one of them
skips `Publish packages` on `main`: no stable publish and no sync back to `develop`
(this happened with #250).

- Do not put a skip marker in a commit message that lands on `develop`.
- The release sync commit's subject is `chore: sync main into develop after release`.
  It has no skip marker. `Publish packages` and `Auto Release PR` skip their work when a
  push's first line is that subject, so the sync itself does not publish or open
  another release PR. A later release merge that only quotes the subject further down
  still publishes.
- Before merging a release PR, check the merge commit message for skip markers and
  delete those lines.
- If a release did not publish, run `Publish packages` on `main` via
  `workflow_dispatch`; `lerna publish from-package` publishes whatever is missing.
