# CLAUDE — pd-ui

TypeScript / React / Vite shared component library for the pd-* suite. Publishes
`@concavetrillion/pd-ui` to the self-hosted `pd-index-npm` registry.

Spec: [`docs/superpowers/specs/2026-05-16-cross-cut-design.md`](../docs/superpowers/specs/2026-05-16-cross-cut-design.md)
Plan: [`docs/superpowers/plans/2026-05-16-pd-ui-new-repo.md`](../docs/superpowers/plans/2026-05-16-pd-ui-new-repo.md)

## Commands

| target | does |
|---|---|
| `make install` | `pnpm install --frozen-lockfile` |
| `make lint` | ESLint flat config on `src/` + `tests/` |
| `make typecheck` | `tsc --noEmit` |
| `make test` | Vitest (jsdom) |
| `make build` | Vite library build → `dist/` |
| `make frontend-build` | alias for `build` |
| `make codegen` | fetch pinned wheels → emit JSON Schema → generate TS types |
| `make codegen-check` | runs codegen and fails if output differs |
| `make ci AI=1` | install + lint + typecheck + test + build |

`AI=1` captures verbose output to `.ci-ai.log`; stdout shows pass/fail summary.

## Hard constraints

- **No CVA** (`class-variance-authority` is banned via ESLint `no-restricted-imports`).
  Variants are CSS class modifiers on design-system primitives (`.btn.primary`, etc.).
- **No hex literals** in component styles. All colors are `var(--token)` references.
- **No direct `lucide-react` imports** outside `src/icons/`. Apps import icons only
  from `@concavetrillion/pd-ui/icons`. Rule enforced by ESLint.
- **Stores are factories**, not singletons. Every store is a `create<Name>Store()`
  function returning a fresh Zustand store; apps instantiate per-AppShell.
- **Strict TypeScript**: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- **Deploy-mode-agnostic**: pd-ui never branches on hosted-vs-local inside components.
  Only `<AppShell deployMode>` changes wording/visibility. All real mode logic lives
  in pd-ocr-ops adapters.
- **Port-not-copy**: when porting from labeler-spa, read the source once, design the
  slot-based API surface, then port. Do not verbatim-copy labeler-specific logic.

## Codegen

When bumping `pd-book-tools` or `pd-ocr-ops` in `codegen.versions.json`:
1. Run `pnpm codegen` (fetches wheels → emits JSON Schema → generates TS types).
2. Commit both `codegen.versions.json` and the regenerated `src/types/generated/` in the same PR.

## Rules

- Always run `make ci AI=1` before committing.
- Make targets first; fall back to direct `pnpm exec` only when no target exists.
- Specs are the source of truth. Code that disagrees with a spec is wrong — change the spec first.
- Radix UI is only used for the behavior-heavy primitives listed in spec §4.
- `theme/tokens.css` and `theme/primitives.css` are the runtime source-of-truth; edited here,
  synced back to `docs/design-system/` via `scripts/sync-design-system.mjs`.

## Sibling repos

- `../pd-book-tools/` — upstream dependency; its `schemas.emit` drives M4 codegen.
- `../pd-ocr-labeler-spa/` — primary source-of-truth for component ports (canvas, worklist, shell).
- `../pd-prep-for-pgdp/` — secondary consumer reference.
- `../pd-ocr-ops/` — GPU dispatch + suite-prefs routes (wired in Phase 2).

## GH issues

Cross-cut work tasks are tracked as GH issues in
**`ConcaveTrillion/ocr-container-meta`** (not in this repo's own tracker).
Plans under `docs/superpowers/plans/` in the workspace root are synced there
via `/decompose-spec --sync`. Milestone naming: `spec: <plan-basename> (#N)`.

When shipping a plan task:

- Before starting: `gh issue view <N> --repo ConcaveTrillion/ocr-container-meta`
- After completing: `gh issue close <N> --repo ConcaveTrillion/ocr-container-meta`
- List open tasks:
  `gh issue list --repo ConcaveTrillion/ocr-container-meta --milestone "spec: <name> (#N)" --state open`
