---
title: Consumer canary gaps (pdomain-prep-for-pgdp migration)
date: 2026-05-21
repo: pdomain/pdomain-ui
status: open
---

# Consumer canary gaps — pdomain-prep-for-pgdp Phase 2 migration

During the pdomain-prep-for-pgdp migration onto `@pdomain/pdomain-ui`
(ocr-container-meta #266) four gaps in pdomain-ui's public API were identified
and left as `GAP-N` code comments in pdomain-prep-for-pgdp. This plan tracks
the corresponding pdomain-ui issues.

## Background

Phase 2 of ocr-container-meta #266 migrated pdomain-prep-for-pgdp off its
private canvas/shell/prefs implementations onto pdomain-ui's published surface.
Four places were reached where the pdomain-ui API was insufficient, forcing
pdomain-prep-for-pgdp to keep local workarounds. Each is filed as a `GAP`
comment in the pdomain-prep-for-pgdp codebase; the corresponding pdomain-ui fix is
tracked below.

## Tracked issues

| # | Area | Title | Status |
|---|------|-------|--------|
| [#12](https://github.com/pdomain/pdomain-ui/issues/12) | canvas | expose Konva image-node ref for consumer Transformer attachment | backlog |
| [#13](https://github.com/pdomain/pdomain-ui/issues/13) | canvas | selection-slot layer should be `listening=true` with click forwarding | backlog |
| [#14](https://github.com/pdomain/pdomain-ui/issues/14) | shell | AppShell footer slot for status/footer bar | backlog |
| [#9](https://github.com/pdomain/pdomain-ui/issues/9) | prefs | spec: shared app-settings modal and AppShell header-actions slot | backlog |

Issue #9 was already open as a spec issue for the shared-settings modal.
A comment has been added to #9 recording the two specific blockers from
pdomain-prep-for-pgdp: (a) missing `'system'` theme value in `createUIPrefsStore()`,
and (b) the store being async/server-backed with no local-storage adapter.
The spec for #9 must address both as acceptance criteria.

## Workarounds in pdomain-prep-for-pgdp (to be removed when gaps close)

- `GAP (canvas #12)`: CSS-transform `rotate(Ndeg)` preview on an `<img>` element
  instead of a Konva Transformer.
- `GAP (canvas #13)`: transparent DOM hit-test overlay div for word-click detection
  instead of Konva layer event routing.
- `GAP (shell #14)`: absolutely-positioned status element outside the AppShell
  slot system.
- `GAP (prefs #9)`: local prefs store instead of `createUIPrefsStore()`.

## Prioritisation notes

- #13 (selection layer) and #12 (Konva ref) are both Phase 2 canvas surface
  concerns; they can land together.
- #14 (footer slot) is a small AppShell grid change; low risk.
- #9 (prefs) is the largest: it gates shared-settings modal design; the
  `'system'` theme value and persistence-adapter sub-requirements must be
  in the spec before implementation starts.
