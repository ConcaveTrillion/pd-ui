import * as React from 'react';
import { cn } from './cn.js';

export interface ConfigureTabItem {
  /** Unique tab identifier. */
  id: string;
  /** Display label. */
  label: string;
  /** Optional badge count shown after the label (e.g. flag count). */
  count?: number;
}

export interface ConfigureTabsProps {
  /** Ordered list of tabs. */
  tabs: ConfigureTabItem[];
  /** Currently selected tab id. */
  value: string;
  /** Called with the new tab id when the user clicks an inactive tab. */
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * ConfigureTabs — horizontal tab strip for configure / detail panels.
 *
 * Renders a tablist with accessible aria-selected state. Used in
 * wf03/wf11/wf-pw configure panes (General / Advanced / Flags etc.).
 * Token-only styling; no hex literals. No Radix dependency — this is
 * a pure layout/a11y wrapper; the panel body is composed by the consumer.
 */
export function ConfigureTabs({
  tabs,
  value,
  onValueChange,
  className,
}: ConfigureTabsProps): React.ReactElement {
  return (
    <div
      role="tablist"
      className={cn('configure-tabs', className)}
      aria-label="Configure sections"
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`configure-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`configure-panel-${tab.id}`}
            className={cn(
              'configure-tabs__tab',
              active ? 'configure-tabs__tab--active' : undefined,
            )}
            onClick={active ? undefined : () => onValueChange(tab.id)}
          >
            <span className="configure-tabs__label">{tab.label}</span>
            {tab.count != null ? (
              <span className="configure-tabs__count">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

ConfigureTabs.displayName = 'ConfigureTabs';
