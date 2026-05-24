/**
 * TabsBand — per-stage tab band molecule.
 *
 * Design source: docs/templates/design_handoff_pd_ui/final/pipeline/pipeline-template.jsx
 * Component: `TabsBand` (lines 226–263)
 *
 * Renders a horizontal row of underline-style tabs. Purely presentational —
 * no internal state. The caller drives `current`/`onTabChange`. Suitable as
 * the default `tabsSlot` inside PipelineTemplate.
 *
 * Constraints:
 * - No hex literals — all colors via var(--token).
 * - No CVA — variants are CSS class modifiers.
 * - No direct lucide-react imports — pass icon nodes from @concavetrillion/pd-ui/icons.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TabsBandItem {
  /** Unique identifier; matched against `current`. */
  id: string;
  /** Display label for the tab. */
  name: string;
  /** Optional icon node (use icons from @concavetrillion/pd-ui/icons). */
  icon?: React.ReactNode;
  /** Optional numeric badge count rendered beside the label. */
  count?: number;
}

export interface TabsBandProps {
  /** Ordered list of tab items to render. */
  items: TabsBandItem[];
  /** ID of the currently active tab. */
  current: string;
  /** Called with the clicked tab's `id` when the user clicks a tab. */
  onTabChange?: (id: string) => void;
  /**
   * When true, adds `.tabs-band--sticky` class so the band can be positioned
   * sticky by a parent layout without extra wrapper elements.
   */
  sticky?: boolean;
  /**
   * Optional content rendered flush-right inside the band.
   * Useful for filter controls, action buttons, or count summaries.
   */
  rightSlot?: React.ReactNode;
  /** Additional class names applied to the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Horizontal tab band molecule ported from the pipeline design template.
 *
 * Usage:
 * ```tsx
 * <TabsBand
 *   items={[
 *     { id: 'overview', name: 'Overview' },
 *     { id: 'pages',    name: 'Pages', count: 47 },
 *     { id: 'settings', name: 'Settings' },
 *   ]}
 *   current="pages"
 *   onTabChange={setActiveTab}
 * />
 * ```
 */
export const TabsBand: React.FC<TabsBandProps> = ({
  items,
  current,
  onTabChange,
  sticky = false,
  rightSlot,
  className,
}) => (
  <div
    role="tablist"
    className={cn(
      'tabs-band',
      sticky && 'tabs-band--sticky',
      className,
    )}
  >
    <div className="tabs-band__tabs">
      {items.map(item => {
        const active = current === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              'tabs-band__tab',
              active && 'tabs-band__tab--active',
            )}
            onClick={() => onTabChange?.(item.id)}
          >
            {item.icon != null ? (
              <span className="tabs-band__icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="tabs-band__label">{item.name}</span>
            {item.count != null ? (
              <span className="tabs-band__count">{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
    {rightSlot != null ? (
      <div className="tabs-band__right">{rightSlot}</div>
    ) : null}
  </div>
);

TabsBand.displayName = 'TabsBand';
