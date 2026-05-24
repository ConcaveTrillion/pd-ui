/**
 * Templates subpath barrel (`@concavetrillion/pd-ui/templates`).
 *
 * Cross-stage layout molecules that compose primitive-layer components
 * into shared pipeline / project UI patterns.
 *
 * Import via: `import { ... } from '@concavetrillion/pd-ui/templates'`
 */

// ─── StageStrip (#340) ────────────────────────────────────────────────────────
export { StageStrip, PIPELINE_STAGES } from './StageStrip.js';
export type { StageStripProps, StageDef } from './StageStrip.js';

// ─── TabsBand (#341) ──────────────────────────────────────────────────────────
export { TabsBand } from './TabsBand.js';
export type { TabsBandItem, TabsBandProps } from './TabsBand.js';

// ─── ProjectsDrawer (#356, OQ-12) ─────────────────────────────────────────────
export { ProjectsDrawer } from './ProjectsDrawer.js';
export type {
  ProjectsDrawerProps,
  ProjectsDrawerProject,
  ProjectsDrawerTab,
  ProjectStatus,
} from './ProjectsDrawer.js';
