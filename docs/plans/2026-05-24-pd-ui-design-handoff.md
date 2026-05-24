---
status: active
synced: 2026-05-24
milestone: 16
repo: ConcaveTrillion/ocr-container-meta
spec: docs/specs/2026-05-24-pd-ui-design-handoff-design.md
---

# pd-ui design-handoff port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port the design-handoff bundle's atoms, cross-stage molecules, and layout templates into pd-ui as typed, slot-based, shared exports — gated by a Phase 1 audit document.

**Architecture:** Three phases, single milestone. Phase 1 produces a research doc (port-plan) that classifies every design identifier and gates Phases 2–3. Phase 2 adds atom-layer gaps to `src/primitives/` and `src/icons/`. Phase 3 adds layout templates to a new `src/templates/` folder plus cross-stage molecules promoted from the design's stage folders.

**Tech Stack:** React 18, TypeScript (strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`), Vite library build, Vitest + jsdom, Storybook (collocated `.stories.tsx`), pnpm, lucide-react.

**Spec:** [`docs/specs/2026-05-24-pd-ui-design-handoff-design.md`](../specs/2026-05-24-pd-ui-design-handoff-design.md)

**Design bundle:** `docs/templates/design_handoff_pd_ui/`

---

## Plan structure note

Phase 1 (Task 1) is the gating audit. Its output reshapes Phases 2 and 3.

Phase 2 (Tasks 2–6) and Phase 3 (Tasks 7–15) are filed as
*anticipated* issues right now so the milestone is fully visible, but
their `Acceptance` checklists and exact file lists may be amended after
CT approves the port-plan. The first acceptance item of every Phase 2
and Phase 3 task is therefore **"port-plan row reviewed and confirmed
for this identifier."**

---

## Task 1 — Write design-handoff port-plan audit  {#port-plan-audit}
model: sonnet  effort: M  area: pd-ui-docs

Context: This is the Phase 1 deliverable. Produces a research document
that classifies every identifier in `design_handoff_pd_ui/` against
pd-ui's current state. CT review of this document gates every Phase 2
and Phase 3 task in this plan.

Approach: Create `docs/research/2026-05-24-design-handoff-port-plan.md`
with five verdict tables defined in spec §4.1: (1) Atom verdict for
every identifier in `design-system/ui-base.jsx`; (2) Token diff between
design `tokens.css` and pd-ui `src/theme/tokens.css`; (3) Icon mapping
for every name in the design's `Icon` switch (~50 rows); (4)
Cross-stage molecule inventory for every identifier with usage count ≥3
in `COMPONENT_INDEX.md`, classified cross-stage vs stage-specific; (5)
Template inventory listing slots and molecule dependencies for
`PipelineTemplate`, `ProjectsLandingTemplate`, `ProjectSettingsTemplate`.

Verification: `git ls-files docs/research/2026-05-24-design-handoff-port-plan.md`

Acceptance:
- [ ] Skeleton document exists with header, status line, glossary, and five empty tables.
- [ ] Table 1 (atom verdict) populated for every export in `design-system/ui-base.jsx`.
- [ ] Table 2 (token diff) populated for every `--*` in design's `tokens.css`.
- [ ] Table 3 (icon mapping) populated for every name in the design's `Icon` switch.
- [ ] Table 4 (cross-stage molecule inventory) populated for every identifier with usage count ≥3.
- [ ] Table 5 (template inventory) populated for the three layout templates.
- [ ] Open-questions section surfaces every ambiguity for CT review.
- [ ] Status promoted from `draft` to `ready for CT review`.

---

## Task 2 — Port Icon: lucide additions + bespoke gaps  {#port-icon}
model: sonnet  effort: M  area: pd-ui-frontend

Context: pd-ui hard constraint is lucide-react only via `src/icons/`.
The design bundle's `Icon` component is a switch over ~50 inline SVGs.
Lucide-first strategy: re-export lucide equivalents where available,
implement domain glyphs as bespoke components.

Approach: For each row in port-plan Table 3 with verdict `lucide`, add
the lucide-react re-export to `src/icons/lucide.ts`. For each row with
verdict `bespoke`, implement the component in `src/icons/bespoke.tsx`
following the existing bespoke convention. Update `Icons.stories.tsx`
to gallery every new icon. No `<Icon name="…">` switch component —
apps continue to import named icon components.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 3 rows reviewed and confirmed for this task's scope.
- [ ] Every `lucide`-verdict design name has a corresponding re-export in `src/icons/lucide.ts`.
- [ ] Every `bespoke`-verdict design name has a typed component in `src/icons/bespoke.tsx`.
- [ ] `Icons.stories.tsx` galleries the new icons.
- [ ] `src/icons/bespoke.test.tsx` covers the new bespoke components' rendering.
- [ ] `make ci AI=1` green.

---

## Task 3 — Port Segmented atom  {#port-segmented}
model: sonnet  effort: S  area: pd-ui-frontend

Context: Inset single-select segmented control used across every wired
stage in the design bundle. Distinct from pd-ui's existing
`ToggleGroup` (a flat multi-select group).

Approach: Implement `src/primitives/Segmented.tsx` as a typed
single-select primitive with string-literal `value` prop, `onChange`
callback, and an `options` array of typed entries. CSS class modifiers
for the inset visual; no CVA, no hex literals. Collocate
`Segmented.stories.tsx` (one story per `DCArtboard` in the source) and
`Segmented.test.tsx` (variants + a11y).

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 1 row for `Segmented` reviewed.
- [ ] `src/primitives/Segmented.tsx` exports a typed `Segmented` with `Props` interface.
- [ ] `Segmented.stories.tsx` covers every `DCArtboard` variant from the design source.
- [ ] `Segmented.test.tsx` covers click, keyboard navigation, a11y role.
- [ ] No CVA import, no hex literals, no `!important`.
- [ ] `make ci AI=1` green.

---

## Task 4 — Port StepDots atom  {#port-stepdots}
model: sonnet  effort: S  area: pd-ui-frontend

Context: Numbered-circle progress indicator used in pipeline
progression states across the design bundle.

Approach: Implement `src/primitives/StepDots.tsx` as a typed primitive
with `steps` (number or array), `current` (index), and optional
`onStepClick`. Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 1 row for `StepDots` reviewed.
- [ ] `src/primitives/StepDots.tsx` exports a typed `StepDots`.
- [ ] `StepDots.stories.tsx` covers every `DCArtboard` variant.
- [ ] `StepDots.test.tsx` covers rendering and click behavior.
- [ ] `make ci AI=1` green.

---

## Task 5 — Port PageHeader atom (if confirmed by audit)  {#port-pageheader}
model: sonnet  effort: S  area: pd-ui-frontend

Context: Title + breadcrumb composite. pd-ui has `Breadcrumb` and
`TopNav` separately but no `PageHeader` molecule. Audit may downgrade
this to "skip" if the existing primitives compose cleanly enough.

Approach: If port-plan Table 1 verdict is `port`, implement
`src/primitives/PageHeader.tsx` composing existing `Breadcrumb` with a
typed title prop. Collocated stories + tests. If verdict is
`already-in-pd-ui` or `skip`, close this task with a no-op comment
referencing the verdict row.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 1 row for `PageHeader` reviewed.
- [ ] Either: `src/primitives/PageHeader.tsx` exists with typed Props, stories, tests, and CI green; OR: task closed as no-op with verdict reference in the closing comment.

---

## Task 6 — Reconcile token-diff gaps  {#reconcile-tokens}
model: sonnet  effort: S  area: pd-ui-frontend

Context: Recon suggests every design token already exists in pd-ui's
`tokens.css`. Audit confirms or surfaces gaps. Anticipated no-op.

Approach: For each port-plan Table 2 row with verdict `missing`, add
the token to `src/theme/tokens.css` under the existing naming
convention. For each `value-mismatch` row, surface to CT for decision
(do not change values unilaterally). Sync to `docs/design-system/` via
`scripts/sync-design-system.mjs`. If Table 2 has zero `missing` rows
and zero `value-mismatch` rows, close as no-op.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1 && node scripts/sync-design-system.mjs --check`

Acceptance:
- [ ] Port-plan Table 2 reviewed.
- [ ] Either: every `missing` token added to `src/theme/tokens.css` and synced, CI green; OR: task closed as no-op with reference to Table 2.

---

## Task 7 — Port StageStrip molecule  {#port-stagestrip}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Stage progress + nav strip. 8+ usages in design bundle. Used
inside `PipelineTemplate` and standalone in some stages.

Approach: Implement `src/templates/StageStrip.tsx` as a typed molecule
with `stages` (typed array of stage descriptors), `current` (stage id),
and `onStageClick`. Slot prop `actions` for per-stage action buttons.
String-literal union for stage status (`'todo' | 'in-progress' |
'done' | 'blocked'`). Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 4 row for `StageStrip` reviewed and confirmed cross-stage.
- [ ] `src/templates/StageStrip.tsx` exports a typed `StageStrip`.
- [ ] `StageStrip.stories.tsx` covers every `DCArtboard` variant.
- [ ] `StageStrip.test.tsx` covers prop variants, status rendering, click handling.
- [ ] `make ci AI=1` green.

---

## Task 8 — Port TabsBand molecule  {#port-tabsband}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Sticky tab band at the top of every stage body in the design.

Approach: Implement `src/templates/TabsBand.tsx` as a typed molecule
wrapping the existing `Tabs` primitive with sticky positioning, an
optional `rightSlot` for stage-level controls, and typed `items`.
Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 4 row for `TabsBand` reviewed.
- [ ] `src/templates/TabsBand.tsx` exports a typed `TabsBand`.
- [ ] `TabsBand.stories.tsx` covers every `DCArtboard` variant.
- [ ] `TabsBand.test.tsx` covers tab switching, sticky behavior asserted via class, rightSlot rendering.
- [ ] `make ci AI=1` green.

---

## Task 9 — Port BulkBar molecule  {#port-bulkbar}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Sticky bottom bulk-action bar that appears across the Source
and other stages when a selection is active.

Approach: Implement `src/primitives/BulkBar.tsx` as a typed molecule
with `selectedCount`, `onClearSelection`, and an `actions` render-prop
slot for app-supplied action buttons. Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 4 row for `BulkBar` reviewed.
- [ ] `src/primitives/BulkBar.tsx` exports a typed `BulkBar`.
- [ ] `BulkBar.stories.tsx` covers every `DCArtboard` variant.
- [ ] `BulkBar.test.tsx` covers rendering, action slot composition, clear-selection callback.
- [ ] `make ci AI=1` green.

---

## Task 10 — Port AttributesPanel molecule  {#port-attributespanel}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Right-side attributes panel used across multiple stages for
displaying selected entity properties.

Approach: Implement `src/primitives/AttributesPanel.tsx` as a typed
molecule with `title`, `entries` (typed key-value array), and an
optional `actions` slot. Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 4 row for `AttributesPanel` reviewed.
- [ ] `src/primitives/AttributesPanel.tsx` exports a typed `AttributesPanel`.
- [ ] `AttributesPanel.stories.tsx` covers every `DCArtboard` variant.
- [ ] `AttributesPanel.test.tsx` covers entry rendering and actions slot.
- [ ] `make ci AI=1` green.

---

## Task 11 — Port additional cross-stage molecules from port-plan  {#port-additional-molecules}
model: sonnet  effort: L  area: pd-ui-frontend

Context: Port-plan Table 4 may identify additional cross-stage
molecules beyond StageStrip/TabsBand/BulkBar/AttributesPanel.
Anticipated candidates from recon: `ViewToggle`, `FileToolbar`,
`ThumbCard`, `RunAllDirtyPanel`, `BuildPackagePanel`, `DiskCostBanner`.
Final list comes from the audit.

Approach: For each Table 4 row with verdict `cross-stage molecule` not
covered by Tasks 7–10, port to its target path (port-plan column 5)
following the same typed-Props + stories + tests pattern. One commit
per molecule. If audit confirms no additional cross-stage molecules,
close as no-op.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] Port-plan Table 4 reviewed; additional cross-stage molecules enumerated.
- [ ] For each enumerated molecule: typed export, collocated stories, collocated tests.
- [ ] `make ci AI=1` green after each port.

---

## Task 12 — Port PipelineTemplate  {#port-pipelinetemplate}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Page chrome shared by all wired pipeline stages (Source,
Grayscale, Crop, Hyphen-join). Slot-based.

Approach: Implement `src/templates/PipelineTemplate.tsx` exposing slot
props `header`, `stageStrip`, `tabs`, `body`, `bulkBar`. Composes
`StageStrip` and `TabsBand` from Tasks 7–8. No leaked
pipeline-specific state types — every slot is a `ReactNode`. Collocated
stories (one per `DCArtboard` from `final/pipeline/pipeline-template.jsx`)
+ tests asserting each slot renders into the correct testid region.

Blocked-by: #port-plan-audit, #port-stagestrip, #port-tabsband

Verification: `make ci AI=1`

Acceptance:
- [ ] `src/templates/PipelineTemplate.tsx` exports a typed `PipelineTemplate` with slot props.
- [ ] `PipelineTemplate.stories.tsx` covers every `DCArtboard` variant from the source.
- [ ] `PipelineTemplate.test.tsx` asserts each slot renders into its testid region.
- [ ] `make ci AI=1` green.

---

## Task 13 — Port ProjectsLandingTemplate  {#port-projectslandingtemplate}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Projects landing chrome from `final/projects/projects.jsx`.
Slot-based.

Approach: Implement
`src/templates/ProjectsLandingTemplate.tsx` exposing slot props
`attributesPanel`, `coverGrid`, `pipelineMini`. Collocated stories +
tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] `src/templates/ProjectsLandingTemplate.tsx` exports a typed template with slot props.
- [ ] Stories cover every `DCArtboard` variant from the source.
- [ ] Tests assert each slot renders into its testid region.
- [ ] `make ci AI=1` green.

---

## Task 14 — Port ProjectSettingsTemplate  {#port-projectsettingstemplate}
model: sonnet  effort: M  area: pd-ui-frontend

Context: Settings layout from `final/pipeline/project-settings.jsx`.
Slot-based.

Approach: Implement
`src/templates/ProjectSettingsTemplate.tsx` exposing slot props
`panels` (left) and `body` (right). Collocated stories + tests.

Blocked-by: #port-plan-audit

Verification: `make ci AI=1`

Acceptance:
- [ ] `src/templates/ProjectSettingsTemplate.tsx` exports a typed template with slot props.
- [ ] Stories cover every `DCArtboard` variant from the source.
- [ ] Tests assert each slot renders into its testid region.
- [ ] `make ci AI=1` green.

---

## Task 15 — Write MIGRATION_NOTES.md  {#migration-notes}
model: haiku  effort: S  area: pd-ui-docs

Context: Final deliverable summarizing what landed where, what was
deliberately not ported, and what's still ambiguous. PROMPT.md §6
requirement.

Approach: Write `MIGRATION_NOTES.md` at pd-ui repo root with five
sections: new exports table (column 1 = pd-ui export path, column 2 =
design source file); tokens added or aliased; icon mapping reference
(link to port-plan Table 3); conscious omissions (every `co-locate` or
`skip` verdict with one-line reason); open questions for CT.
Demonstration of `final/source/source.jsx` → pd-ui imports is
documented (the glue itself is part of the follow-on stages spec).

Blocked-by: #port-icon, #port-segmented, #port-stepdots, #port-pageheader, #reconcile-tokens, #port-stagestrip, #port-tabsband, #port-bulkbar, #port-attributespanel, #port-additional-molecules, #port-pipelinetemplate, #port-projectslandingtemplate, #port-projectsettingstemplate

Verification: `git ls-files MIGRATION_NOTES.md && make ci AI=1`

Acceptance:
- [ ] `MIGRATION_NOTES.md` exists at pd-ui root.
- [ ] New exports table lists every new pd-ui export with its design source.
- [ ] Tokens added or aliased section reflects port-plan Table 2 outcomes.
- [ ] Icon mapping references port-plan Table 3.
- [ ] Conscious omissions list every `co-locate` / `skip` verdict.
- [ ] Open questions for CT documented.
- [ ] `final/source/source.jsx` → pd-ui imports demonstration documented.

---

## Done when

- Every task above is closed under milestone `spec: pd-ui-design-handoff (#N)`.
- `pnpm exec tsc --noEmit` clean under strict settings.
- `make ci AI=1` green on merge into `main`.
- `MIGRATION_NOTES.md` exists at pd-ui root.
- Workspace convention: branches stay local; no PR opened (CT pushes when ready).
