/**
 * SettingsNav — settings sidebar navigation molecule.
 *
 * Design source: docs/templates/design_handoff_pd_ui/final/pipeline/pipeline-template.jsx
 * Component: inline sidebar inside `ProjectSettingsTemplate` (lines 356–386)
 *
 * Renders a vertical list of settings group items with icon, active highlight
 * (accent left-border + bg-raised), and danger-zone tone. Slot-based API so
 * any pd-* SPA can supply a custom `groups` list.
 *
 * Constraints:
 * - No hex literals — all colors via var(--token).
 * - No CVA — variants are CSS class modifiers.
 * - No direct lucide-react imports — icons resolved through Icon dispatcher.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';
import { Icon } from '../icons/Icon.js';
import type { IconName } from '../icons/Icon.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One settings group entry in the sidebar nav. */
export interface SettingsNavGroup {
  /** Unique identifier; matched against `currentGroup`. */
  id: string;
  /** Display label for the settings group. */
  name: string;
  /**
   * Icon to render beside the label.
   * Must be one of the design-system IconName values.
   */
  icon: IconName;
  /**
   * When true the item renders in the mismatch (danger) tone.
   * Intended for destructive sections like "Danger zone".
   */
  danger?: boolean;
}

export interface SettingsNavProps {
  /** Ordered list of settings groups to render. */
  groups: SettingsNavGroup[];
  /** ID of the currently active group. */
  currentGroup: string;
  /** Called with the clicked group's `id`. */
  onGroupChange: (id: string) => void;
  /**
   * Optional label heading shown above the nav items.
   * Matches the "Project settings" caption in the design source.
   */
  label?: string;
  /** Additional class names applied to the root `<nav>` element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Default groups — the 8 project-settings groups from the design
// ---------------------------------------------------------------------------

/**
 * Default 8-item group list for the project-settings sidebar.
 *
 * Import and pass directly to `<SettingsNav groups={PROJECT_SETTINGS_GROUPS} …>`
 * for the standard project-settings use case.  Override with a custom list
 * for app-specific settings layouts.
 *
 * Source: pipeline-template.jsx ProjectSettingsTemplate (lines 362–370).
 */
export const PROJECT_SETTINGS_GROUPS: SettingsNavGroup[] = [
  { id: 'general',   name: 'General',           icon: 'wrench'   },
  { id: 'bib',       name: 'Bibliographic',      icon: 'fileText' },
  { id: 'pgdp',      name: 'PGDP submission',    icon: 'package'  },
  { id: 'format',    name: 'Format & content',   icon: 'file'     },
  { id: 'defaults',  name: 'Stage defaults',     icon: 'sparkles' },
  { id: 'members',   name: 'Members',            icon: 'image'    },
  { id: 'storage',   name: 'Storage & cleanup',  icon: 'hardDrive' },
  { id: 'danger',    name: 'Danger zone',        icon: 'trash',   danger: true },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Vertical settings-group sidebar nav molecule.
 *
 * Usage with default project-settings groups:
 * ```tsx
 * <SettingsNav
 *   groups={PROJECT_SETTINGS_GROUPS}
 *   currentGroup={activeGroup}
 *   onGroupChange={setActiveGroup}
 *   label="Project settings"
 * />
 * ```
 *
 * Usage with custom groups (e.g. user-account settings in another SPA):
 * ```tsx
 * const MY_GROUPS: SettingsNavGroup[] = [
 *   { id: 'profile',   name: 'Profile',   icon: 'image'  },
 *   { id: 'security',  name: 'Security',  icon: 'wrench' },
 *   { id: 'danger',    name: 'Danger',    icon: 'trash',  danger: true },
 * ];
 *
 * <SettingsNav
 *   groups={MY_GROUPS}
 *   currentGroup={activeGroup}
 *   onGroupChange={setActiveGroup}
 * />
 * ```
 */
export const SettingsNav: React.FC<SettingsNavProps> = ({
  groups,
  currentGroup,
  onGroupChange,
  label,
  className,
}) => (
  <nav
    aria-label={label ?? 'Settings navigation'}
    className={cn('settings-nav', className)}
  >
    {label != null ? (
      <div className="settings-nav__label">{label}</div>
    ) : null}

    <div className="settings-nav__list">
      {groups.map(group => {
        const active = group.id === currentGroup;
        return (
          <button
            key={group.id}
            type="button"
            aria-current={active ? 'page' : undefined}
            className={cn(
              'settings-nav__item',
              active      && 'settings-nav__item--active',
              group.danger && 'settings-nav__item--danger',
            )}
            onClick={() => onGroupChange(group.id)}
          >
            <span className="settings-nav__item-icon" aria-hidden="true">
              <Icon name={group.icon} size={13} />
            </span>
            <span className="settings-nav__item-name">{group.name}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

SettingsNav.displayName = 'SettingsNav';
