# Changelog

All notable changes to `@concavetrillion/pd-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0-alpha] — 2026-05-17

Phase 1 release of the shared pd-* frontend library. Covers all milestones
M0 through M9, plus M10 (publish scaffolding).

### Added

**M0 — Repo scaffold**
- TypeScript 5 strict (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Vite 5 library mode with 9 ESM entry points
- Vitest 1 + jsdom test environment
- ESLint flat config with react-hooks, jsx-a11y, no-CVA, no-hex-literals rules
- Makefile with `install`, `lint`, `typecheck`, `test`, `build`, `ci` targets

**M1 — Design-system theme**
- `theme/tokens.css` — CSS custom property tokens (dark default, light override)
- `theme/primitives.css` — structural layout primitives
- `./theme/tokens.css` and `./theme/primitives.css` subpath exports
- `scripts/sync-design-system.mjs` — bidirectional sync with workspace `docs/design-system/`
- `make theme-check` CI gate (fails on drift)

**M2 — Primitive components**
- `src/primitives/` — `cn()` helper, pure HTML primitives (Button, Input, Label, Badge,
  Checkbox, TextArea, Select, Separator, Slot), Radix UI wrappers (Dialog, AlertDialog,
  Popover, Tooltip, DropdownMenu, Tabs, ToggleGroup)
- `@concavetrillion/pd-ui/primitives` subpath export
- No CVA — variants are CSS class modifiers

**M3 — Icons**
- `src/icons/` — curated lucide-react re-exports (25 icons) + 11 bespoke OCR-domain SVG icons
- `@concavetrillion/pd-ui/icons` subpath export
- ESLint rule blocks direct `lucide-react` imports outside `src/icons/`

**M4 — Codegen pipeline**
- `scripts/codegen-fetch.mjs` — fetches pinned `pd-book-tools` + `pd-ocr-ops` wheels
- `scripts/codegen-emit.mjs` — invokes `schemas.emit`, writes JSON Schema to `.codegen/`
- `scripts/codegen-tsgen.mjs` — wraps JSON Schema in OpenAPI stub, generates TS via
  `openapi-typescript`, writes to `src/types/generated/` (committed)
- `codegen.versions.json` — pinned wheel versions
- `make codegen-check` CI gate
- `@concavetrillion/pd-ui/types` subpath with `*Like` type reductions

**M5 — PageImageCanvas**
- `src/canvas/PageImageCanvas.tsx` — slot-based Konva stage for OCR page display
- `PageBBox` bounding box type + `bboxToRect()` utility
- `useCanvasSelection` hook — multi-select, keyboard modifiers
- `@concavetrillion/pd-ui/canvas` subpath export

**M6 — WordList**
- `src/worklist/WordList.tsx` — react-virtuoso virtualized word list
- `VirtualizedList` generic virtualization shell
- `LineCard`, `LineList`, `PageList` adapter components
- `useWorklistSort` + `useWorklistFilter` hooks
- `ConfidenceBar` + `MatchStatusChip` status row primitives
- `@concavetrillion/pd-ui/worklist` subpath export

**M7+M8 — AppShell + Zustand store factories**
- `src/shell/AppShell.tsx` — CSS grid shell with `deployMode` prop and UIPrefs context
- `LauncherSlot`, `LeftPanelSlot`, `RightPanelSlot`, `StatusBarSlot` render-prop slots
- `createUIPrefsStore()`, `createSuiteStore()`, `createJobStore()` factory functions
  (never singletons — apps instantiate per AppShell)
- `useSuiteSiblings()`, `useLongJob()` hooks
- `@concavetrillion/pd-ui/shell` and `@concavetrillion/pd-ui/stores` subpath exports

**M9 — Storybook**
- Storybook 8 with React + Vite builder
- Stories for all public components (AppShell, canvas, worklist, primitives, icons)
- `tests/storybook/` story-presence CI gate — fails if a component lacks a story

**M10 — Publish scaffolding**
- Version set to `0.1.0-alpha`
- `publishConfig.registry` pointing to self-hosted `pd-index-npm`
- `tests/build.contract.test.ts` — asserts all 9 dist entry JS + `.d.ts` files exist
- `tests/pack.contract.test.ts` — runs `pnpm pack --json`, asserts tarball completeness
- `tests/package.contract.test.ts` — version, exports, files, no-CVA contract assertions

### Not included in 0.1.0-alpha

- Actual publish to `pd-index-npm` registry (#177) — blocked on registry setup
- Hosted-mode backend adapters — Phase 2 work in each consuming app

[0.1.0-alpha]: https://github.com/ConcaveTrillion/pd-ui/releases/tag/v0.1.0-alpha
