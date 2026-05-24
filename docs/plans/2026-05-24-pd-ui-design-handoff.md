---
repo: ConcaveTrillion/ocr-container-meta
spec: docs/specs/2026-05-24-pd-ui-design-handoff-design.md
milestone: "spec: pd-ui-design-handoff (#N)"
---

# pd-ui design-handoff port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the design-handoff bundle's atoms, cross-stage molecules, and layout templates into pd-ui as typed, slot-based, shared exports — gated by a Phase 1 audit document.

**Architecture:** Three phases, single milestone. Phase 1 produces a research doc (port-plan) that classifies every design identifier and gates Phases 2–3. Phase 2 adds atom-layer gaps to `src/primitives/` and `src/icons/`. Phase 3 adds layout templates to a new `src/templates/` folder plus cross-stage molecules promoted from the design's stage folders.

**Tech Stack:** React 18, TypeScript (strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`), Vite library build, Vitest + jsdom, Storybook (collocated `.stories.tsx`), pnpm, lucide-react.

**Spec:** [`docs/specs/2026-05-24-pd-ui-design-handoff-design.md`](../specs/2026-05-24-pd-ui-design-handoff-design.md)

**Design bundle:** `docs/templates/design_handoff_pd_ui/`

---

## How this plan is structured

The spec gates Phases 2 and 3 on CT review of Phase 1's port-plan, because the audit determines:

- Which atoms genuinely have gaps (vs. already in pd-ui).
- Which design identifiers are cross-stage molecules (port now) vs. stage-specific (defer to follow-on spec).
- The lucide-vs-bespoke mapping for every design icon.
- Whether `PageHeader`, `AppFrame`, `ServerFooter`, `ProjectListBackdrop` port at all.

Writing detailed TDD tasks for Phases 2 and 3 today would produce speculative steps that the port-plan would invalidate. Instead:

- **Phase 1** is fully task-decomposed below.
- **Phase 2 and Phase 3** are described as scoped issues with file paths and acceptance criteria. Detailed step-by-step tasks for each get appended to *this plan file* after CT approves the port-plan and `/decompose-spec --sync` creates the milestone issues.

This matches the spec's "issue list is provisional; Phase 1 finalizes it" gate.

---

## Phase 1 · Write the port-plan audit (gating issue)

**Issue title:** `Phase 1: write design-handoff port-plan.md`

**Outcome:** A markdown research doc at
`docs/research/2026-05-24-design-handoff-port-plan.md` containing the five
verdict tables defined in spec §4.1. CT review of this doc unblocks every
Phase 2 and Phase 3 issue.

### Task 1: Bootstrap the port-plan doc

**Files:**
- Create: `docs/research/2026-05-24-design-handoff-port-plan.md`

- [ ] **Step 1: Create the skeleton document**

Write the following exact content:

````markdown
# Design-handoff port-plan

**Status:** draft (Phase 1 deliverable, gates spec
[`2026-05-24-pd-ui-design-handoff-design.md`](../specs/2026-05-24-pd-ui-design-handoff-design.md)
Phases 2–3)
**Date:** 2026-05-24
**Source bundle:** `docs/templates/design_handoff_pd_ui/`
**Reviewer:** CT (must sign off before any Phase 2/3 issue is started)

## How to read this document

Five verdict tables. Each row classifies one design-bundle identifier
against pd-ui's current state and assigns a target outcome. CT review
may move rows between classifications.

## Table 1 · Atom verdict

For every identifier in
`docs/templates/design_handoff_pd_ui/design-system/ui-base.jsx`.

| identifier | usage count | already in pd-ui (path) | verdict | target path | notes |
|---|---|---|---|---|---|

## Table 2 · Token diff

For every `--*` custom property in
`docs/templates/design_handoff_pd_ui/design-system/tokens.css` vs
`src/theme/tokens.css`.

| token name | design value | pd-ui value | verdict |
|---|---|---|---|

## Table 3 · Icon mapping

Every name in the design's `Icon` switch-statement.

| design name | lucide name (if any) | verdict | bespoke component name (if bespoke) | notes |
|---|---|---|---|---|

## Table 4 · Cross-stage molecule inventory

Every identifier appearing in 3+ files of the design bundle.

| identifier | file count | files | classification | target path | depends on |
|---|---|---|---|---|---|

## Table 5 · Template inventory

For each layout template in `final/`.

| template | source file | slots (props) | depends on molecules | notes |
|---|---|---|---|---|

## Verdict glossary

- **`already-in-pd-ui`** — pd-ui already exports an equivalent at the
  listed path; no port needed. Note any API divergence in `notes`.
- **`port`** — port into pd-ui at the listed target path. Becomes a
  Phase 2 or Phase 3 issue.
- **`rename`** — port but rename to match pd-ui naming.
- **`co-locate`** — page-scoped helper; do not port; lives next to
  its consumer in the eventual consuming app.
- **`skip`** — prototype scaffolding (`DesignCanvas`, `DCSection`,
  `DCArtboard`, theme toggle, app-level `App()`); do not port.
- **`cross-stage molecule`** (Table 4) — appears in 3+ files; port
  into pd-ui under this spec's Phase 3.
- **`stage-specific`** (Table 4) — used only inside one stage's
  body; deferred to the follow-on `pd-ui-design-handoff-stages`
  spec.

## Open questions for CT

(append below as the audit progresses)

EOF
````

- [ ] **Step 2: Commit the skeleton**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): bootstrap design-handoff port-plan skeleton"
```

### Task 2: Fill Table 1 (atom verdict)

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

**Reference inputs:**
- `docs/templates/design_handoff_pd_ui/design-system/ui-base.jsx` — design atom exports.
- `docs/templates/design_handoff_pd_ui/COMPONENT_INDEX.md` — usage counts.
- `src/primitives/` — pd-ui's existing primitives.

- [ ] **Step 1: Enumerate every design atom**

Open `design-system/ui-base.jsx`. List every top-level `const X = …` and
every `Object.assign(window, { … })` entry. Expected list (from recon,
verify by reading the file): `Icon`, `Button`, `Badge`, `KeyCap`,
`Divider`, `Input`, `PageHeader`, `AppFrame`, `TopNav`, `ServerFooter`,
`StepDots`, `ProjectListBackdrop`. If you find more, add them.

- [ ] **Step 2: For each atom, locate the pd-ui equivalent (or note absence)**

Use Grep on `src/primitives/`, `src/shell/`, `src/icons/`. For each
design atom, find the existing pd-ui export with the same role and
record its full path (e.g. `src/primitives/Button.tsx`). Record `—` if
absent.

- [ ] **Step 3: Assign verdict per atom**

Apply this decision tree:

1. pd-ui has an equivalent + API matches → `already-in-pd-ui`.
2. pd-ui has an equivalent + API diverges → `already-in-pd-ui` and
   note the divergence in `notes` (do not propose API changes here —
   CT decides during review).
3. No equivalent + atom is generic UI → `port` with target path
   `src/primitives/<Name>.tsx`.
4. No equivalent + atom is suite-wide chrome (`AppFrame`,
   `ServerFooter`) → `port` with target path `src/shell/<Name>.tsx`
   *or* `skip` if `src/shell/AppShell.tsx` already covers it.
5. Atom is decorative-only (`ProjectListBackdrop`) → `skip` unless CT
   review overrides.

- [ ] **Step 4: Fill Table 1**

Edit the doc. Each atom is one row. Example:

```
| Button | 10 | src/primitives/Button.tsx | already-in-pd-ui | — | variants align: outline/primary/brand/ghost/danger — confirm tone names match |
| Segmented | (count) | — | port | src/primitives/Segmented.tsx | inset single-select; distinct from existing ToggleGroup |
```

- [ ] **Step 5: Commit**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan Table 1 — atom verdict"
```

### Task 3: Fill Table 2 (token diff)

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

**Reference inputs:**
- `docs/templates/design_handoff_pd_ui/design-system/tokens.css`
- `src/theme/tokens.css`

- [ ] **Step 1: List every `--*` in design's tokens.css with its value**

Read `design-system/tokens.css`. Extract every `--name: value;`
declaration under the design's scope selector (`.pgd { ... }` and any
`[data-theme="light"]` overrides). One row per token.

- [ ] **Step 2: Look up each in pd-ui's tokens.css**

For each design token, find its declaration in `src/theme/tokens.css`
under `:root` and `[data-theme="light"]`. Record the pd-ui value, or
`—` if absent.

- [ ] **Step 3: Assign verdict per token**

- Same name, same value → `identical`.
- Same name, different value → `value-mismatch` (flag for CT — do not
  change values without approval).
- Design name only → `missing` (target: add to `src/theme/tokens.css`
  in Phase 2e).

- [ ] **Step 4: Fill Table 2 and commit**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan Table 2 — token diff"
```

### Task 4: Fill Table 3 (icon mapping)

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

**Reference inputs:**
- `docs/templates/design_handoff_pd_ui/design-system/ui-base.jsx` —
  the `Icon` component's name → SVG-path switch.
- `src/icons/lucide.ts` — currently re-exported lucide icons.
- The lucide-react docs index for name lookup.

- [ ] **Step 1: Extract every design icon name**

Open `ui-base.jsx`. Find the `Icon` component. Enumerate every `case
"name":` branch in the switch. Expected ~50.

- [ ] **Step 2: Map each to lucide-react where possible**

For each design name, find the closest lucide-react component name.
Use the lucide docs (https://lucide.dev/icons/) for lookup. Examples:

- `arrow-left` → `ArrowLeft` (lucide)
- `chevron-down` → `ChevronDown` (lucide)
- `crop` → `Crop` (lucide)
- `merge` → `Merge` (lucide)
- `hyphen-join` → no lucide equivalent → `bespoke`
- `scanno-flag` → no lucide equivalent → `bespoke`

- [ ] **Step 3: Assign verdict per icon**

- Lucide equivalent exists → `lucide` with the lucide component name.
- No lucide equivalent (domain-specific glyph) → `bespoke` with a
  PascalCase component name for `src/icons/bespoke.tsx`.
- Visual is purely decorative and unused outside prototype canvas →
  `skip` (rare).

- [ ] **Step 4: Fill Table 3 and commit**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan Table 3 — icon mapping"
```

### Task 5: Fill Table 4 (cross-stage molecule inventory)

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

**Reference inputs:**
- `docs/templates/design_handoff_pd_ui/COMPONENT_INDEX.md` — usage
  counts and file lists per identifier.
- The `final/` and wireframe JSX files for context on each
  identifier's role.

- [ ] **Step 1: Enumerate every identifier with usage count ≥3**

Read `COMPONENT_INDEX.md`. Extract every identifier whose frequency
table count is ≥3. From recon, expected candidates include:
`StageContextStrip` (8), `ViewToggle` (5), `RunAllDirtyPanel` (5),
`BuildPackagePanel` (5), `DiskCostBanner` (5), plus the design
atoms (already covered in Table 1). Drop atoms — they're in Table 1.

- [ ] **Step 2: For each, classify cross-stage vs stage-specific**

Apply this decision tree per identifier:

1. Used in 2+ `final/<stage>/` folders OR in `final/<stage>/` and a
   wireframe folder → `cross-stage molecule`.
2. Used only in one `final/<stage>/` folder, regardless of usage
   count → `stage-specific`.
3. Used only in wireframes (no `final/` appearance) → `stage-specific`
   AND note the wireframe origin (so the wireframes follow-on spec
   picks it up).

- [ ] **Step 3: For `cross-stage molecule` rows, assign target path**

- Generic, reusable across non-pipeline contexts (e.g. `BulkBar`,
  `ViewToggle`) → `src/primitives/<Name>.tsx`.
- Pipeline-page-coupled (e.g. `StageContextStrip` only makes sense
  inside `PipelineTemplate`) → `src/templates/<Name>.tsx`.

- [ ] **Step 4: Fill Table 4 and commit**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan Table 4 — cross-stage molecules"
```

### Task 6: Fill Table 5 (template inventory)

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

**Reference inputs:**
- `docs/templates/design_handoff_pd_ui/final/pipeline/pipeline-template.jsx`
- `docs/templates/design_handoff_pd_ui/final/template/` (AppTemplate)
- `docs/templates/design_handoff_pd_ui/final/projects/projects.jsx`
- `docs/templates/design_handoff_pd_ui/final/pipeline/project-settings.jsx`

- [ ] **Step 1: For each of `PipelineTemplate`, `AppTemplate`, `ProjectsLandingTemplate`, `ProjectSettingsTemplate`, identify the slots the design carves out**

For each, open the JSX and identify the regions a consuming app would
fill: `header`, `stageStrip`, `tabs`, `body`, `bulkBar`,
`attributesPanel`, `coverGrid`, `pipelineMini`, `panels`, etc. Record
the exact slot list from the source.

- [ ] **Step 2: List molecule dependencies per template**

For each template, list which Table 4 cross-stage molecules it
composes (e.g. `PipelineTemplate` depends on `StageStrip` and
`TabsBand`).

- [ ] **Step 3: Fill Table 5 and commit**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan Table 5 — template inventory"
```

### Task 7: Mark port-plan ready for CT review

**Files:**
- Modify: `docs/research/2026-05-24-design-handoff-port-plan.md`

- [ ] **Step 1: Promote status to ready-for-review**

Change the front-of-doc status line from `draft` to `ready for CT review`.

- [ ] **Step 2: Surface open questions**

Append every ambiguity surfaced during Tasks 2–6 to the "Open questions
for CT" section. Examples to look out for: API divergence between a
design atom and pd-ui's existing equivalent; identifiers whose
classification was a judgment call; tokens with value mismatches.

- [ ] **Step 3: Commit, close issue, hand off**

```bash
git add docs/research/2026-05-24-design-handoff-port-plan.md
git commit -m "docs(research): port-plan ready for CT review"
gh issue close <Phase-1-issue-N> --repo ConcaveTrillion/ocr-container-meta \
  --comment "Port-plan ready for review: docs/research/2026-05-24-design-handoff-port-plan.md"
```

**Then halt and surface the port-plan to CT.** Do not start any Phase
2 or Phase 3 issue until CT signs off and this plan file is amended
(see "Phase 2 & 3 — Plan amendments after Phase 1" below).

---

## Phase 2 · Atom-layer gaps (provisional, gated by Phase 1)

Issues for Phase 2 are anticipated below; final list comes from the
Phase 1 port-plan. **Do not start any Phase 2 issue until this plan
file is amended with concrete TDD tasks after CT approves Phase 1.**

### Anticipated Phase 2 issues

| # | Title | Outcome | Files |
|---|---|---|---|
| 2a | Port Icon: lucide additions + bespoke gaps | Every lucide-mapped design icon re-exported from `src/icons/lucide.ts`; every bespoke entry implemented in `src/icons/bespoke.tsx` with `.test.tsx` + Storybook entry in `Icons.stories.tsx` | `src/icons/lucide.ts`, `src/icons/bespoke.tsx`, `src/icons/Icons.stories.tsx`, `src/icons/bespoke.test.tsx` |
| 2b | Port Segmented atom | Typed `Segmented` primitive with single-select inset variant; `.tsx` + `.stories.tsx` + `.test.tsx` | `src/primitives/Segmented.tsx` (+ stories + test) |
| 2c | Port StepDots atom | Typed `StepDots` primitive | `src/primitives/StepDots.tsx` (+ stories + test) |
| 2d | Port PageHeader atom (if confirmed) | Typed `PageHeader` composite (title + breadcrumb) | `src/primitives/PageHeader.tsx` (+ stories + test) |
| 2e | Reconcile token-diff gaps | Any `missing` token from Table 2 added to `src/theme/tokens.css`; sync via `scripts/sync-design-system.mjs` | `src/theme/tokens.css`, `docs/design-system/tokens.css` |

### TDD pattern applied to each Phase 2 issue

When this plan is amended with concrete tasks per issue, each issue
will follow this pattern:

1. **Write the failing test.** Vitest + jsdom; covers prop variants
   and a11y for interactive atoms. Run, confirm failure.
2. **Write the typed `Props` interface and minimal implementation.**
   No `any`, no `Record<string, unknown>`. String-literal unions for
   variant props. Direct CSS class modifiers — no CVA.
3. **Run tests, confirm pass.**
4. **Write the `.stories.tsx`.** One story per `DCArtboard` in the
   source design file.
5. **Run `make ci AI=1`.** Confirm green.
6. **Commit.** One commit per atom.

### Phase 2 acceptance gate

- Every Phase 1 `port`-verdict atom has a typed export with
  collocated `.stories.tsx` + `.test.tsx`.
- `make ci AI=1` green on the worktree.
- No `lucide-react` imports outside `src/icons/`.
- No CVA imports. No hex literals in component styles. No
  `!important`.

---

## Phase 3 · Templates + cross-stage molecules (provisional, gated by Phase 1)

Issues for Phase 3 are anticipated below; final list comes from the
Phase 1 port-plan, especially Table 4. **Do not start any Phase 3
issue until this plan file is amended after CT approves Phase 1.**

### Anticipated Phase 3 issues

| # | Title | Outcome | Files |
|---|---|---|---|
| 3a | Port StageStrip molecule | Typed `StageStrip` with stage list + current marker | `src/templates/StageStrip.tsx` (+ stories + test) |
| 3b | Port TabsBand molecule | Typed `TabsBand` sticky tab band | `src/templates/TabsBand.tsx` (+ stories + test) |
| 3c | Port BulkBar molecule | Typed `BulkBar` sticky bottom action bar | `src/primitives/BulkBar.tsx` (+ stories + test) |
| 3d | Port AttributesPanel molecule | Typed `AttributesPanel` | `src/primitives/AttributesPanel.tsx` (+ stories + test) |
| 3e | Port additional cross-stage molecules from port-plan | One sub-issue per molecule Table 4 classifies as cross-stage | (per port-plan) |
| 3f | Port PipelineTemplate | Slot-based `PipelineTemplate` composing `StageStrip` + `TabsBand` | `src/templates/PipelineTemplate.tsx` (+ stories + test) |
| 3g | Port ProjectsLandingTemplate | Slot-based `ProjectsLandingTemplate` | `src/templates/ProjectsLandingTemplate.tsx` (+ stories + test) |
| 3h | Port ProjectSettingsTemplate | Slot-based `ProjectSettingsTemplate` | `src/templates/ProjectSettingsTemplate.tsx` (+ stories + test) |
| 3i | Write `MIGRATION_NOTES.md` | Root-level doc listing every new export, design source, tokens added, omissions, open questions | `MIGRATION_NOTES.md` |

### TDD pattern applied to each Phase 3 issue

1. **Write the failing test.** For molecules: prop-driven rendering +
   interaction. For templates: assert each slot renders its content
   and slots compose in the correct visual region (use
   `data-testid` from `src/testids/` to assert structure).
2. **Define the typed `Props` interface.** Templates expose slot
   props (`header?: ReactNode`, `body: ReactNode`, …). Molecules
   expose typed data props.
3. **Implement.** Slot-based composition; no leaking pipeline-specific
   state types into pd-ui.
4. **`.stories.tsx`** — one story per `DCArtboard`.
5. **`make ci AI=1`** green.
6. **Commit.** One commit per molecule/template.

### Phase 3.i — MIGRATION_NOTES content

`pd-ui/MIGRATION_NOTES.md` must contain:

- **New exports table:** column 1 = pd-ui export path, column 2 =
  design source file.
- **Tokens added or aliased:** if any.
- **Icon mapping reference:** link to the port-plan's Table 3.
- **Conscious omissions:** every `co-locate` or `skip` verdict from
  the port-plan, with one-line reason.
- **Open questions for CT.**

### Phase 3 acceptance gate

- Every Phase 1 `port`-verdict molecule and every template in the
  spec has a typed export with collocated `.stories.tsx` +
  `.test.tsx`.
- `pnpm exec tsc --noEmit` clean under strict settings.
- `make ci AI=1` green.
- `MIGRATION_NOTES.md` exists at pd-ui root and is honest about gaps.
- Demonstration that `final/source/source.jsx` could be implemented
  using pd-ui imports + stage-specific glue is documented in
  `MIGRATION_NOTES.md` (the glue itself is *not* part of this spec —
  stage-specific components are deferred to the follow-on
  `pd-ui-design-handoff-stages` spec).

---

## Phase 2 & 3 — Plan amendments after Phase 1

After CT approves the port-plan and `/decompose-spec --sync` creates
the milestone issues:

- [ ] **Update this plan file** with concrete TDD tasks for each Phase
  2 and Phase 3 issue. Replace the "anticipated" tables above with
  per-issue Task N sections following the same step-by-step format as
  Phase 1 Tasks 1–7.
- [ ] **Commit the amendment** with message
  `docs(plans): pd-ui-design-handoff Phase 2+3 tasks (post Phase 1)`.

---

## Done when

- `docs/research/2026-05-24-design-handoff-port-plan.md` exists,
  CT-approved, and committed.
- Every Phase 2 and Phase 3 issue under milestone
  `spec: pd-ui-design-handoff (#N)` is closed.
- `MIGRATION_NOTES.md` exists at pd-ui root.
- `make ci AI=1` green on the merge commit into `main`.
- Workspace convention: branches stay local; no PR opened (CT pushes
  when ready).
