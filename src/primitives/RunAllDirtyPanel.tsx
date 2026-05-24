import * as React from 'react';
import { cn } from './cn.js';
import { Button } from './Button.js';

export interface RunAllDirtyPanelProps {
  /** Number of pages / items with dirty (un-processed) status. */
  dirtyCount: number;
  /** Handler called when the user clicks "Run All". */
  onRunAll: () => void;
  /** When true, disables the button (e.g. when a job is already running). */
  running?: boolean;
  /** Hard-disable the panel regardless of running state. */
  disabled?: boolean;
  className?: string;
}

/**
 * RunAllDirtyPanel — action panel for re-running all dirty pages in a stage.
 *
 * Shows the current dirty count and a "Run All" action button.
 * Disables when a job is running or explicitly disabled.
 *
 * Used in wf02/05/05b/09/10 pipeline-shell panels.
 * Token-only styling; no hex literals.
 */
export function RunAllDirtyPanel({
  dirtyCount,
  onRunAll,
  running,
  disabled,
  className,
}: RunAllDirtyPanelProps): React.ReactElement {
  const isDisabled = disabled === true || running === true;

  return (
    <div className={cn('run-all-dirty-panel', className)}>
      <div className="run-all-dirty-panel__info">
        <span
          className={cn(
            'run-all-dirty-panel__count',
            dirtyCount > 0 ? 'run-all-dirty-panel__count--dirty' : undefined,
          )}
          aria-label={`${dirtyCount} dirty pages`}
        >
          {dirtyCount}
        </span>
        <span className="run-all-dirty-panel__label">
          {dirtyCount === 1 ? 'page needs re-run' : 'pages need re-run'}
        </span>
      </div>
      <Button
        type="button"
        variant="primary"
        disabled={isDisabled}
        onClick={onRunAll}
        className="run-all-dirty-panel__btn"
      >
        {running === true ? 'Running…' : 'Run All'}
      </Button>
    </div>
  );
}

RunAllDirtyPanel.displayName = 'RunAllDirtyPanel';
