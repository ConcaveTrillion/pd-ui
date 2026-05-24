import * as React from 'react';
import { cn } from './cn.js';
import { Input } from './Input.js';
import { Button } from './Button.js';

export interface FilterToolbarProps {
  /** Current filter value. */
  value: string;
  /** Called with the new filter string as the user types or clears. */
  onValueChange: (value: string) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
  className?: string;
}

/**
 * FilterToolbar — a search input with an inline clear button.
 *
 * Composes Input and Button.  Used in wf03/wf11/wf-pw page-list stages
 * to filter by flag kind, page type, or free text.
 * Token-only styling; no hex literals.
 */
export function FilterToolbar({
  value,
  onValueChange,
  placeholder = 'Filter…',
  className,
}: FilterToolbarProps): React.ReactElement {
  return (
    <div className={cn('filter-toolbar', className)}>
      <Input
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="filter-toolbar__input"
        suffix={
          value !== '' ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Clear filter"
              onClick={() => onValueChange('')}
              className="filter-toolbar__clear"
            >
              ×
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

FilterToolbar.displayName = 'FilterToolbar';
