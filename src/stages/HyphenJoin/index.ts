/**
 * HyphenJoin stage barrel (Phase 2 M6).
 */

// ─── HJStatusPill ─────────────────────────────────────────────────────────────
export { HJStatusPill } from './HJStatusPill.js';
export type { HJStatusPillProps, HJStatus } from './HJStatusPill.js';

// ─── HJDecisionCard ───────────────────────────────────────────────────────────
export { HJDecisionCard } from './HJDecisionCard.js';
export type { HJDecisionCardProps, HJDecisionCase } from './HJDecisionCard.js';

// ─── HyphenOverview ───────────────────────────────────────────────────────────
export { HyphenOverview } from './HyphenOverview.js';
export type { HyphenOverviewProps, HyphenOverviewStats } from './HyphenOverview.js';

// ─── HyphenUndecided ──────────────────────────────────────────────────────────
export { HyphenUndecided } from './HyphenUndecided.js';
export type { HyphenUndecidedProps, HJDecisionHandlers } from './HyphenUndecided.js';

// ─── HyphenMismatch ───────────────────────────────────────────────────────────
export { HyphenMismatch } from './HyphenMismatch.js';
export type { HyphenMismatchProps, HyphenMismatchItem, HyphenDecision } from './HyphenMismatch.js';

// ─── HyphenStepSettings ───────────────────────────────────────────────────────
export { HyphenStepSettings, HYPHEN_STEP_SETTINGS_DEFAULT } from './HyphenStepSettings.js';
export type {
  HyphenStepSettingsProps,
  HyphenSettings,
  HyphenRule,
  HyphenNgramCacheSettings,
  HyphenThresholds,
} from './HyphenStepSettings.js';
