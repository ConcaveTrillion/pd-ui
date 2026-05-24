/**
 * ProjectSettingsTemplate — project-scoped settings page template.
 *
 * Design source: `ProjectSettingsTemplate` in
 * docs/templates/design_handoff_pd_ui/final/pipeline/pipeline-template.jsx
 * (lines 339–394).
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  ProjectInfoBand (inSettings)                       │
 *   ├──────────────┬──────────────────────────────────────┤
 *   │  Left rail   │  Right pane (children slot)          │
 *   │  (8-item     │                                      │
 *   │   settings   │                                      │
 *   │   nav)       │                                      │
 *   └──────────────┴──────────────────────────────────────┘
 *
 * Slots:
 *   - `theme`        — forwarded to the root div as data-theme
 *   - `project`      — ProjectData bag (title, author, id, pages, ingested, size)
 *   - `currentGroup` — active group id (one of the 8 ProjectSettingsGroup values)
 *   - `children`     — right-pane content; defaults to a placeholder stripe
 *
 * Note on inline nav: Issue #357 is shipping `SettingsNav` to
 * `src/templates/SettingsNav.tsx` in parallel. To avoid a hard dependency on
 * the not-yet-merged component, the 8-item left-rail nav is defined inline
 * here. After both branches merge, a follow-up refactor can swap the inline
 * nav for the extracted SettingsNav component.
 *
 * Constraints:
 *   - No hex literals — all colors via var(--token).
 *   - No CVA.
 *   - No direct lucide-react imports.
 */
import * as React from 'react';
import { Icon } from '../icons/Icon.js';
import type { IconName } from '../icons/Icon.js';
import { ProjectInfoBand } from "./PipelineTemplate.js";
import type { PipelineProject as ProjectData } from "./PipelineTemplate.js";
import {
  PROJECT_SETTINGS_TEMPLATE,
  PROJECT_SETTINGS_NAV,
  PROJECT_SETTINGS_CONTENT,
  projectSettingsNavItem,
} from '../testids/index.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The 8 project-settings group identifiers. */
export type ProjectSettingsGroup =
  | 'general'
  | 'bib'
  | 'pgdp'
  | 'format'
  | 'defaults'
  | 'members'
  | 'storage'
  | 'danger';

interface NavItem {
  id: ProjectSettingsGroup;
  name: string;
  icon: IconName;
  danger?: boolean;
}

/** Default 8-item project-settings nav definition (matches design source). */
const NAV_ITEMS: readonly NavItem[] = [
  { id: 'general',  name: 'General',           icon: 'wrench'    },
  { id: 'bib',      name: 'Bibliographic',      icon: 'fileText'  },
  { id: 'pgdp',     name: 'PGDP submission',    icon: 'package'   },
  { id: 'format',   name: 'Format & content',   icon: 'file'      },
  { id: 'defaults', name: 'Stage defaults',     icon: 'sparkles'  },
  { id: 'members',  name: 'Members',            icon: 'image'     },
  { id: 'storage',  name: 'Storage & cleanup',  icon: 'hardDrive' },
  { id: 'danger',   name: 'Danger zone',        icon: 'trash',    danger: true },
] as const;

// ---------------------------------------------------------------------------
// Default right-pane placeholder (no children supplied)
// ---------------------------------------------------------------------------

function SettingsContentPlaceholder() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 320,
        border: '1px dashed var(--border-2)',
        borderRadius: 10,
        background: 'repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in oklab, var(--border-1) 35%, transparent) 14px 15px)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ink-3)',
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-4)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          content slot · settings group
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
          Settings group content renders here.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ProjectSettingsTemplateProps {
  /**
   * Design-system theme override.
   * Applied as `data-theme` on the root element.
   * Defaults to the inherited theme from the ancestor context.
   */
  theme?: 'dark' | 'light';
  /** Project identity data displayed in the ProjectInfoBand. */
  project?: ProjectData;
  /**
   * Currently active settings group.
   * One of the 8 standard project-settings groups.
   */
  currentGroup?: ProjectSettingsGroup;
  /**
   * Right-pane content slot.
   * Defaults to a striped placeholder when omitted.
   */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Sample project (used when no project prop is supplied)
// ---------------------------------------------------------------------------

const SAMPLE_PROJECT: ProjectData = {
  title: 'Belloc — Survivals & New Arrivals',
  author: 'Hilaire Belloc',
  id: 'belloc-survivals',
  pages: 232,
  ingested: '12 min ago',
  size: '2.1 GB',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Project-scoped settings page template.
 *
 * Composes:
 *   - `ProjectInfoBand` (in settings mode) — project identity header
 *   - 8-item left-rail nav (inline; see note on SettingsNav in file header)
 *   - Right-pane slot for settings group content
 *
 * @example
 * ```tsx
 * <ProjectSettingsTemplate
 *   project={myProject}
 *   currentGroup="bib"
 * >
 *   <BibliographicSettingsForm />
 * </ProjectSettingsTemplate>
 * ```
 */
export function ProjectSettingsTemplate({
  theme,
  project = SAMPLE_PROJECT,
  currentGroup = 'general',
  children,
}: ProjectSettingsTemplateProps): React.ReactElement {
  return (
    <div
      data-testid={PROJECT_SETTINGS_TEMPLATE}
      data-theme={theme}
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-page)',
        color: 'var(--ink-1)',
      }}
    >
      {/* Project identity header — "Close settings" button variant */}
      <ProjectInfoBand project={project} inSettings />

      {/* Two-column body: nav rail + content pane */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          minHeight: 0,
        }}
      >
        {/* ── Left rail ─────────────────────────────────────────────────── */}
        <nav
          data-testid={PROJECT_SETTINGS_NAV}
          aria-label="Settings navigation"
          style={{
            borderRight: '1px solid var(--border-1)',
            background: 'var(--bg-surface)',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div
            className="label"
            style={{
              color: 'var(--ink-3)',
              padding: '4px 8px 8px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Project settings
          </div>

          {NAV_ITEMS.map(item => {
            const active = item.id === currentGroup;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={projectSettingsNavItem(item.id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  all: 'unset',
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: active ? 'var(--bg-raised)' : 'transparent',
                  borderLeft: active
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                  color: item.danger
                    ? 'var(--mismatch)'
                    : active
                    ? 'var(--ink-1)'
                    : 'var(--ink-2)',
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} aria-hidden="true">
                  <Icon name={item.icon} size={13} />
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* ── Right pane ─────────────────────────────────────────────────── */}
        <div
          data-testid={PROJECT_SETTINGS_CONTENT}
          style={{
            overflow: 'auto',
            padding: '20px 28px',
          }}
        >
          {children !== undefined ? children : <SettingsContentPlaceholder />}
        </div>
      </div>
    </div>
  );
}

ProjectSettingsTemplate.displayName = 'ProjectSettingsTemplate';

// Re-export project data type so consumers can type their project bags correctly
export type { ProjectData };
