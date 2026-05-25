import * as React from 'react';
import { cn } from './cn.js';

export type ViewMode = 'list' | 'thumb';

export interface ViewToggleProps {
  /** Currently active view mode. Defaults to `"list"`. */
  mode?: ViewMode;
  /** Called with the new mode when the user selects an option. */
  onChange: (mode: ViewMode) => void;
  className?: string;
}

interface ViewOption {
  id: ViewMode;
  label: string;
}

const OPTIONS: ViewOption[] = [
  { id: 'list', label: 'List' },
  { id: 'thumb', label: 'Thumbnails' },
];

/**
 * ViewToggle — segmented pill for switching between list and thumbnail views.
 *
 * Used in wf03/05/05b/11/wf-pw page-list stages.
 * Icon rendering is deferred to CSS `::before` content on `.view-toggle__option-icon`
 * so no icon import is needed inside this primitive.
 */
export function ViewToggle({
  mode = 'list',
  onChange,
  className,
}: ViewToggleProps): React.ReactElement {
  return (
    <div className={cn('view-toggle', className)} role="group" aria-label="View mode">
      {OPTIONS.map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            data-id={opt.id}
            className={cn(
              'view-toggle__option',
              active ? 'view-toggle__option--active' : undefined,
            )}
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
          >
            <span
              className={cn('view-toggle__option-icon', `view-toggle__option-icon--${opt.id}`)}
              aria-hidden="true"
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

ViewToggle.displayName = 'ViewToggle';
