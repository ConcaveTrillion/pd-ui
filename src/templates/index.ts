/**
 * pd-ui/templates subpath export.
 *
 * Re-exports all public templates API:
 *  - ProjectsDrawer (suite-wide molecule for project selection — OQ-12)
 *
 * Import via: import { ProjectsDrawer } from '@concavetrillion/pd-ui/templates'
 */

// ─── ProjectsDrawer ───────────────────────────────────────────────────────────
export { ProjectsDrawer } from './ProjectsDrawer.js';
export type {
  ProjectsDrawerProps,
  ProjectsDrawerProject,
  ProjectsDrawerTab,
  ProjectStatus,
} from './ProjectsDrawer.js';
