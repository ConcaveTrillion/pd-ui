# pd-ui Design-Handoff Migration Notes

**Applies to:** `@concavetrillion/pd-ui` consumers — `pd-ocr-labeler-spa`,
`pd-prep-for-pgdp`, and future `pd-ocr-trainer-spa`.

**Authoritative references:**
- Port-plan + CT decisions: `docs/research/2026-05-24-design-handoff-port-plan.md`
- Design-handoff plan: `docs/plans/2026-05-24-pd-ui-design-handoff.md` (workspace root)
- All shipped work landed on commits `2042bd9..main` (design-handoff milestone #333)

---

## Overview of changes shipped in this milestone

The design-handoff milestone (`spec: pd-ui-design-handoff (#333)`) extended
existing primitives, added an `<Icon name>` dispatcher shim, ported four
shell molecules (`AppHeader`, `JobsPill`, `JobsDrawer`, `JobRow`), ported five
new template molecules (`StageStrip`, `TabsBand`, `ProjectsDrawer`,
`ProjectsLandingTemplate`, `PipelineTemplate`, `ProjectSettingsTemplate`,
`SettingsNav`), ported cross-stage batch-1 molecules, and deprecated two
`AppShell` props.

---

## 1. Icon dispatcher shim (OQ-1)

**Decision:** add a `<Icon name>` dispatcher shim to `src/icons/` that maps
every design-system icon name to the corresponding named lucide or bespoke
export. Named exports remain available; the shim allows ported stage code to
use the design API verbatim.

**New export** (from `@concavetrillion/pd-ui/icons`):
```ts
import { Icon, ICON_NAMES } from '@concavetrillion/pd-ui/icons';
// types:
import type { IconName, IconDispatcherProps } from '@concavetrillion/pd-ui/icons';
```

**Before (design bundle style, not valid in pd-ui consumers prior to this milestone):**
```tsx
// Design source called a monolithic SVG dispatcher — not available in pd-ui
<Icon name="check" size={14} />
<Icon name="alert" size={16} className="error-icon" />
```

**After (now valid):**
```tsx
import { Icon } from '@concavetrillion/pd-ui/icons';

<Icon name="check" size={14} />
<Icon name="alert" size={16} className="error-icon" />
```

**Name mapping table (design name → lucide export):**

| Design name | Lucide export | Notes |
|---|---|---|
| `alert` | `AlertTriangle` | lucide ^0.400.0 name (OQ-7) |
| `swap` | `ArrowLeftRight` | straight bidirectional (OQ-8) |
| `loader` | `Loader2` | — |
| `trash` | `Trash2` | — |
| `moreH` | `MoreHorizontal` | — |
| `grip` | `GripVertical` | — |
| `refresh` | `RefreshCw` | — |
| `chevR` | `ChevronRight` | — |
| `chevL` | `ChevronLeft` | — |
| `chevD` | `ChevronDown` | — |
| `arrowR` | `ArrowRight` | — |
| `arrowUp` | `ArrowUp` | — |
| `arrowDown` | `ArrowDown` | — |
| `arrowUpDown` | `ArrowUpDown` | — |

All other design names (e.g. `check`, `x`, `info`, `search`, `plus`, `eye`)
map identically to lucide exports of the same PascalCase name.

**28 new lucide exports added in this milestone:** `AlertTriangle`, `Archive`,
`ArrowDown`, `ArrowLeftRight`, `ArrowRight`, `ArrowUp`, `ArrowUpDown`, `Bell`,
`CheckCircle`, `Copy`, `Download`, `File`, `FileText`, `Folder`, `GripVertical`,
`HardDrive`, `Image`, `Link`, `Loader2` (already present), `Moon`, `Package`,
`Pause`, `Play`, `RefreshCw`, `Scissors`, `Sparkles`, `Sun`, `Upload`, `Wrench`.

**Named exports still work** — direct named imports from `@concavetrillion/pd-ui/icons`
are unchanged and preferred for code that wasn't ported from the design bundle:
```tsx
import { Check, AlertTriangle } from '@concavetrillion/pd-ui/icons';
```

---

## 2. Button extended with `icon` / `iconRight` / `full` props (OQ-2)

**Decision:** extend `Button` non-breakingly with three new optional props.
Existing callers that omit them are unaffected.

**Before:**
```tsx
// Icon had to be composed manually as a child
<Button variant="primary">
  <Plus size={14} />
  Add project
</Button>

// Full-width required className
<Button variant="ghost" className="w-full">Cancel</Button>
```

**After:**
```tsx
import { Button } from '@concavetrillion/pd-ui/primitives';
import { Icon } from '@concavetrillion/pd-ui/icons';

<Button variant="primary" icon={<Icon name="plus" size={14} />}>
  Add project
</Button>

<Button variant="ghost" iconRight={<Icon name="chevR" size={14} />}>
  Continue
</Button>

<Button variant="ghost" full>Cancel</Button>
```

**New props:**

| Prop | Type | Notes |
|---|---|---|
| `icon` | `React.ReactNode` | Rendered before children |
| `iconRight` | `React.ReactNode` | Rendered after children |
| `full` | `boolean` | Sets `width: 100%` via `.btn.full` CSS class |

---

## 3. Input extended with `suffix` slot and `autoFocusRing` (OQ-3)

**Decision:** extend `Input` with a composite wrapper + `suffix` slot and an
`autoFocusRing` prop. Callers that omit `suffix` receive the original bare
`<input>` — no structural change.

**Before:**
```tsx
// No suffix support — suffix had to be positioned outside the input
<Input size="sm" placeholder="Search…" />
```

**After:**
```tsx
import { Input } from '@concavetrillion/pd-ui/primitives';
import { Icon } from '@concavetrillion/pd-ui/icons';

// Suffix inside the input wrapper (search icon, clear button, etc.)
<Input
  size="sm"
  placeholder="Search…"
  suffix={<Icon name="search" size={14} />}
/>

// Programmatic focus ring (e.g. when a parent highlights an active field)
<Input autoFocusRing placeholder="Filename" />
```

When `suffix` is provided, `Input` renders a composite `div.input-wrapper >
input + span.input-suffix` structure. The wrapper carries the visual
border/background so it reads as one unified field.

`autoFocusRing` applies the CSS class `.input-focus-ring` (uses
`var(--accent)`) — no inline styles.

---

## 4. Badge extended with `tone` / `dot` / `mono` props (OQ-4)

**Decision:** extend `Badge` with a 13-value `tone` prop carrying the full
design-system status vocabulary. The existing `variant` prop (default / primary
/ danger) is unchanged.

**Before:**
```tsx
// Only structural variants available
<Badge variant="primary">OCR</Badge>
<Badge variant="danger">Failed</Badge>
```

**After:**
```tsx
import { Badge } from '@concavetrillion/pd-ui/primitives';

// Semantic status tones
<Badge tone="exact">Exact</Badge>
<Badge tone="fuzzy">Fuzzy</Badge>
<Badge tone="running">Running</Badge>
<Badge tone="mismatch">Mismatch</Badge>
<Badge tone="ocr">OCR</Badge>
<Badge tone="gt">GT</Badge>

// Dot indicator
<Badge tone="running" dot>Processing</Badge>

// Monospace font (e.g. a score or hash)
<Badge tone="exact" mono>0.97</Badge>
```

**Full `tone` value set:**

| Tone | Semantic meaning | Token |
|---|---|---|
| `neutral` | Uncolored / informational | `--ink-2` / `--bg-raised` |
| `brand` | Accent highlight | `--accent` |
| `clean` / `exact` | Verified match | `--exact` |
| `dirty` / `fuzzy` / `review` | Needs review | `--fuzzy` |
| `running` / `ocr` | In-progress / OCR data | `--ocr` |
| `failed` / `mismatch` / `error` | Error state | `--mismatch` |
| `gt` | Ground-truth reference | `--gt` |

---

## 5. Shell molecules: AppHeader, JobsPill, JobsDrawer, JobRow (OQ-5)

**Decision:** port all four into `src/shell/` so every pd-* SPA gets a
consistent jobs indicator and user-avatar chrome.

**New exports** (from `@concavetrillion/pd-ui/shell`):

```ts
import {
  AppHeader,
  JobsPill, type JobsPillProps, type ActiveJob,
  JobRow,  type JobRowProps, type Job, type JobStatus,
  JobsDrawer, type JobsDrawerProps, type JobsDrawerMode, type JobToast,
} from '@concavetrillion/pd-ui/shell';
```

**Before** — consumers had to roll their own chrome or use the generic
`TopNav` layout shell:
```tsx
// Only layout slot available — no jobs indicator, no avatar
import { TopNav } from '@concavetrillion/pd-ui/shell';

<TopNav>
  <img src={appIcon} alt="" width={20} height={20} />
  <span className="app-name">My App</span>
</TopNav>
```

**After:**
```tsx
import { AppHeader, JobsPill, JobsDrawer, JobRow } from '@concavetrillion/pd-ui/shell';

// Compose AppHeader with a jobs pill
<AppHeader
  appName="pd-ocr-labeler"
  username="CT"
  initials="CT"
  unread={2}
  jobsSlot={
    <JobsPill
      jobs={activeJobs}
      onClick={() => setJobsOpen(true)}
    />
  }
  search={<Input placeholder="Search…" size="sm" />}
/>

// Jobs side drawer
<JobsDrawer
  open={jobsOpen}
  onOpenChange={setJobsOpen}
  jobs={jobs}
  mode="panel"
/>
```

`TopNav` remains available as a lower-level layout primitive. `AppHeader`
composes `TopNav` internally — do not nest `AppHeader` inside `TopNav`.

---

## 6. AppShell `drawer` and `rightPanel` props deprecated (OQ-12)

**Decision:** `AppShell` is converging to a 3-zone shell (header + rail +
main). The `drawer` and `rightPanel` props are retained for back-compat with
existing consumers (`pd-ocr-labeler-spa`, `pd-prep-for-pgdp`) but are
`@deprecated` in JSDoc. These props will be removed in a future spec after
both consumers migrate.

**Current behaviour:** both props still work and render — no runtime change.

**JSDoc deprecation warning added to `AppShellProps`:**
```ts
/** @deprecated OQ-12: use ProjectsDrawer or a Radix Dialog/Sheet instead. */
drawer?: React.ReactNode;

/** @deprecated OQ-12: compose a right-pane split inside `children` instead. */
rightPanel?: React.ReactNode;
```

**Migration path for existing consumers:**

| Current usage | Recommended replacement |
|---|---|
| `<AppShell drawer={<MyPanel />}>` | `<ProjectsDrawer>` template molecule, or a Radix `Sheet` inside `children` |
| `<AppShell rightPanel={<MyPanel />}>` | Right-side split layout inside `children` (CSS grid or flex) |

No action is required before the follow-on migration spec lands.

---

## 7. New template molecules: StageStrip, TabsBand, ProjectsDrawer

These are exported from `@concavetrillion/pd-ui/templates`.

### StageStrip

Pipeline stage progress indicator. Renders an ordered list of pipeline stage
tabs with active/done/pending states.

```tsx
import { StageStrip, PIPELINE_STAGES } from '@concavetrillion/pd-ui/templates';

<StageStrip
  stages={PIPELINE_STAGES}
  activeStageId="wf03"
  onStageClick={(id) => navigate(`/project/${projectId}/stage/${id}`)}
/>
```

`PIPELINE_STAGES` is the canonical ordered stage list from the design system.
Consuming apps can supply a custom `stages` array for project-specific
pipelines.

### TabsBand

A horizontal tab band that renders within a pipeline stage shell.

```tsx
import { TabsBand } from '@concavetrillion/pd-ui/templates';
import type { TabsBandItem } from '@concavetrillion/pd-ui/templates';

const tabs: TabsBandItem[] = [
  { id: 'pages', label: 'Pages' },
  { id: 'config', label: 'Configure' },
  { id: 'output', label: 'Output' },
];

<TabsBand
  tabs={tabs}
  activeTabId={currentTab}
  onTabChange={setCurrentTab}
/>
```

### ProjectsDrawer

Suite-wide projects list drawer. Renders as a slide-in panel showing project
cards with status badges; embeds in templates, not an AppShell zone (OQ-12).

```tsx
import { ProjectsDrawer } from '@concavetrillion/pd-ui/templates';
import type { ProjectsDrawerProject } from '@concavetrillion/pd-ui/templates';

<ProjectsDrawer
  open={projectsOpen}
  onOpenChange={setProjectsOpen}
  projects={projects}
  selectedId={currentProjectId}
  onSelectProject={(id) => navigate(`/project/${id}`)}
/>
```

---

## 8. New full-page templates: PipelineTemplate, ProjectSettingsTemplate,
   ProjectsLandingTemplate, SettingsNav

These are also exported from `@concavetrillion/pd-ui/templates`.

> Note: these templates compose lower-level pd-ui molecules and are intended
> as a starting scaffold. Consuming apps are expected to pass their own
> `children` for the per-stage content area.

### PipelineTemplate

Full pipeline-project shell. Composes `AppHeader` + `StageStrip` + `TabsBand`
+ content slot.

```tsx
import { PipelineTemplate } from '@concavetrillion/pd-ui/templates';

<PipelineTemplate
  project={project}
  stages={PIPELINE_STAGES}
  activeStageId={stageId}
  currentTab={tabId}
  onStageChange={setStageId}
  onTabChange={setTabId}
  tabsSlot={<TabsBand tabs={stageTabs} activeTabId={tabId} onTabChange={setTabId} />}
>
  {/* Per-stage tab content */}
  <PagesTab projectId={project.id} />
</PipelineTemplate>
```

### ProjectSettingsTemplate

Project-scoped settings destination. Left rail is a `SettingsNav` with eight
setting groups; `children` fills the right pane.

```tsx
import { ProjectSettingsTemplate } from '@concavetrillion/pd-ui/templates';

<ProjectSettingsTemplate
  project={project}
  currentGroup="bibliographic"
  onGroupChange={setGroup}
>
  <BibliographicSettingsPane project={project} />
</ProjectSettingsTemplate>
```

### ProjectsLandingTemplate

Root projects list + detail pane. Merged empty/populated state via a
discriminated union (OQ-11 decision; `ProjectsPage` + `ProjectsEmpty`
merged into a single component).

```tsx
import { ProjectsLandingTemplate } from '@concavetrillion/pd-ui/templates';

// Populated state
<ProjectsLandingTemplate
  state="populated"
  projects={projects}
  selectedId={selectedProjectId}
  onSelectProject={setSelectedProjectId}
  defaultTab="activity"
/>

// Empty state (no projects yet)
<ProjectsLandingTemplate
  state="empty"
  onCreateProject={handleCreate}
/>
```

### SettingsNav

Extracted settings group nav sidebar from `ProjectSettingsTemplate` (OQ-10).
Available for apps that build their own settings layout.

```tsx
import { SettingsNav } from '@concavetrillion/pd-ui/templates';

<SettingsNav
  groups={settingsGroups}
  currentGroup={currentGroup}
  onGroupChange={setGroup}
/>
```

---

## 9. New cross-stage primitive molecules (batch 1)

All shipped in `@concavetrillion/pd-ui/primitives`. These were ported from
the design bundle's `final/` files (Table 4 cross-stage entries).

| Export | Description |
|---|---|
| `StatTile` | Statistic tile: label + value + optional tone |
| `FlagChip` | OCR quality flag badge chip (uses Badge `tone`) |
| `RowFlagBadge` | Inline flag badge for table rows |
| `Toggle` | Boolean switch primitive (Radix `Switch` internally, OQ-9) |
| `DiskCostBanner` | Disk cost / storage warning banner |
| `ViewToggle` | List vs. grid view toggle |
| `QualityBanner` | Quality summary banner with flag count |
| `BulkActionBar` | Multi-selection bulk-action toolbar |
| `AttributesPanel` | Key/value attributes panel (projects + stage contexts) |

**Toggle before/after (OQ-9 — no equivalent existed):**

```tsx
// Before: no standalone boolean switch; callers used ToggleGroup or a
// custom <input type="checkbox">
<ToggleGroup type="single" value={value} onValueChange={setValue}>
  <ToggleGroupItem value="on">On</ToggleGroupItem>
</ToggleGroup>

// After: simple boolean switch
import { Toggle } from '@concavetrillion/pd-ui/primitives';
<Toggle checked={enabled} onCheckedChange={setEnabled} label="Auto-OCR" />
```

---

## 10. Token aliases NOT added (OQ-6)

**Decision:** pd-ui does **not** add `--font-sans` / `--font-mono` back-compat
aliases. Consumers must use the canonical token names.

| Avoid | Use instead |
|---|---|
| `var(--font-sans)` | `var(--ui-font)` |
| `var(--font-mono)` | `var(--mono-font)` |

If any consumer imported `--font-sans` from the design bundle's `tokens.css`,
find-and-replace at the consumer's call site.

---

## 11. `Divider` rename: use `Separator`

The design bundle uses the identifier `Divider`. pd-ui exports `Separator`
(same component, Radix-backed, functionally equivalent).

```tsx
// Design source  — not available as-is
<Divider />
<Divider vertical />

// pd-ui equivalent
import { Separator } from '@concavetrillion/pd-ui/primitives';
<Separator />
<Separator orientation="vertical" />
```

---

## 11b. Phase 2 — Shipped

Tracks per-stage components landed under Phase 2 (spec:
`docs/specs/2026-05-24-design-handoff-stages-phase-2.md`).

### M1: ArtifactViewer + overlays (2026-05-24 · 9f81be7)

New subpath: `@concavetrillion/pd-ui/stages/PageWorkbench`.

| Export | Role |
|---|---|
| `ArtifactViewer` | Multi-consumer composition molecule — wraps `PageImageCanvas` with paper chrome and one of five overlay modes (`view` / `split` / `illust` / `rotate` / `words`). |
| `SplitOverlay` | Draggable vertical split line for before/after compare. Exposes `SplitHandle` DOM sidecar with `role="separator"` for a11y. |
| `IllustOverlay` | Illustration bbox highlight rects (Konva `underlay` slot). |
| `WordBboxOverlay` | Per-word bbox rects (Konva `selection` slot with `selectionLayerListening`); fires `onWordClick(id)`. Each rect carries `data-testid="word-bbox-{id}"`. |
| `RotateHandle` | Rotation drag handle for `overlayMode='rotate'`. |
| Types | `OverlayMode`, `SplitProposal`, `IllustBbox`, `WordBbox`, `ArtifactViewerProps`. |

Internal sub-components `ArtifactPlate` and `PaperRender` are **not**
exported — consume `ArtifactViewer` for the composed surface. Consumers
that need a custom outer shell can import the individual overlays
directly.

Unblocks: pd-prep-for-pgdp PageWorkbenchPage / Grayscale PageViewer /
Crop BboxEditor / OCR labeler surfaces; pd-ocr-labeler-spa annotation
canvas migration.

### M2 atom promotions (2026-05-24)

4 atoms promoted from stage folders to `src/primitives/` per §6.5 of
the Phase 2 spec, exported from the existing `./primitives` subpath:

| Export | Commit | Description |
|---|---|---|
| `BackendChip` | `1cfc595` | GPU/CPU/auto status chip (composes `Badge`; `fallback` prop adds `data-fallback` attribute for amber CPU-fallback state). |
| `CheckIcon` | `4b1d788` | Pass/warn/error/running/skip state icon (uses `<Icon>` dispatcher; added `Minus` to lucide icon set). |
| `PageChip` | `10d2688` | Mono-font page-prefix navigation chip (e.g. `p019`); button when `onClick` provided, span otherwise. **Breaking:** the prior kanban-internal `PageChip` re-export is now `KanbanPageChip` (and `PageChipProps` → `KanbanPageChipProps`); update imports if consuming the kanban drag chip. |
| `ToggleBadge` | `48c4bce` | Mini inline labeled switch (composes existing `Toggle`); for inline table-row use. |

Unblocks: M2 cross-cutting `StageControlsPanel` (`BackendChip`), M4
Grayscale `StageControlsLeft` (`BackendChip`), M7 Scannos
`ToggleBadge`, M9 Validation `CheckRow`/`CheckIcon`/`PageChip`.

---

## 12. Conscious omissions

The following design-bundle identifiers were intentionally **not** ported:

| Identifier | Verdict | Reason |
|---|---|---|
| `ProjectListBackdrop` | `skip` | Prototype scaffold — demo overlay behind the projects drawer in design canvas; not a standalone component |
| `AppFrame` | Use `AppShell` | Design `AppFrame` is a monolithic wrapper; maps to `AppShell` + `Dialog`/`Drawer` composition |
| `TopNav` (design version) | Use `AppHeader` | Design's opinionated `TopNav` is superseded by the slotted `AppHeader` molecule |
| `VariationA`, `VariationB`, `ThemedFrame` | `skip` | Design-canvas artboard frames; not portworthy React components |
| `STAGE_DEFS`, `STAGE_FLAGS`, `FLAG_TONE`, `FLAG_META` | `stage-specific` | Data constants; belong in `pd-ocr-ops` or the consuming SPA's own constants |
| `Tab` (pipeline-shell local) | `co-locate` | Thin per-file tab helper that differs per stage; use pd-ui `Tabs` primitive from `@concavetrillion/pd-ui/primitives` |
| `CheckRow`, `PageThumb`, `PageRow` | `stage-specific` | Tightly coupled to page/image data model; defer to per-stage SPA |
| `ProjectConfigureFrame` | Not yet ported | Composed of `BuildPackagePanel` + `RunAllDirtyPanel` + `DiskCostBanner`; those sub-molecules are in pd-ui; `ProjectConfigureFrame` is deferred to the stages spec |
| `StageJumpPopover`, `StageContextStrip`, `ConfigureHeader`, `ConfigureTabs` | Deferred | Cross-stage molecules scheduled for the follow-on `pd-ui-design-handoff-stages` spec |
| `ThumbGrid`, `ThumbFlagBadge`, `ThumbSizeToggle`, `FilterToolbar`, `TableHeader`, `TableFooter`, `SummaryStrip`, `SummaryCell` | Deferred | Phase 3 / stages spec |

---

## 13. Migration checklist for `pd-ocr-labeler-spa` and `pd-prep-for-pgdp`

1. **Icons:** replace any inline icon SVGs or direct `lucide-react` imports
   with named exports from `@concavetrillion/pd-ui/icons`. Use `<Icon name>`
   dispatcher for code ported verbatim from the design bundle.

2. **Badge tones:** replace custom status-colored spans with
   `<Badge tone="…">` using the 13-value tone set.

3. **Button icons:** pass `icon` / `iconRight` instead of composing icon
   children manually.

4. **Input suffix:** pass `suffix` for input fields with a trailing icon or
   button; remove custom wrapper divs.

5. **Toggle:** replace `<input type="checkbox">` boolean switches with
   `<Toggle>` from primitives.

6. **AppShell `drawer` / `rightPanel`:** these still work (retained for
   back-compat) but are `@deprecated`. Plan migration to `ProjectsDrawer`
   or in-`children` splits when the follow-on migration spec is filed.

7. **Font tokens:** replace `var(--font-sans)` → `var(--ui-font)` and
   `var(--font-mono)` → `var(--mono-font)` in any CSS that referenced the
   design-bundle aliases.

8. **Separator name:** replace `Divider` → `Separator`; `vertical` prop →
   `orientation="vertical"`.

---

*Generated from port-plan CT review decisions (all 12 OQs resolved 2026-05-24).
See `docs/research/2026-05-24-design-handoff-port-plan.md` § "CT review decisions"
for authoritative OQ rationale.*
