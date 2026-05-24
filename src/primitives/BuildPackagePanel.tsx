import * as React from 'react';
import { cn } from './cn.js';
import { Button } from './Button.js';
import { Badge } from './Badge.js';
import type { BadgeTone } from './Badge.js';

export interface BuildPackagePanelProps {
  /** Handler called when the user initiates a package build. */
  onBuild: () => void;
  /** When true, shows building-in-progress state and disables the button. */
  building?: boolean;
  /** Hard-disable the panel regardless of building state. */
  disabled?: boolean;
  /**
   * Semantic status tone for the status badge.
   * Maps to BadgeTone — e.g. 'clean', 'dirty', 'running', 'failed'.
   */
  status?: BadgeTone;
  /** Human-readable label for the status badge. Shown only when `status` is provided. */
  statusLabel?: string;
  className?: string;
}

/**
 * BuildPackagePanel — action panel for triggering a package/artifact build.
 *
 * Shows a status badge (if the build has a known status) and a "Build Package"
 * action button. Disables while a build is in progress.
 *
 * Used in wf02/05/05b/09/10 pipeline-shell panels.
 * Token-only styling; no hex literals.
 */
export function BuildPackagePanel({
  onBuild,
  building,
  disabled,
  status,
  statusLabel,
  className,
}: BuildPackagePanelProps): React.ReactElement {
  const isDisabled = disabled === true || building === true;

  return (
    <div className={cn('build-package-panel', className)}>
      {status != null && statusLabel != null ? (
        <Badge
          tone={status}
          className="build-package-panel__status"
        >
          {statusLabel}
        </Badge>
      ) : null}
      <Button
        type="button"
        variant="primary"
        disabled={isDisabled}
        onClick={onBuild}
        className="build-package-panel__btn"
      >
        {building === true ? 'Building…' : 'Build Package'}
      </Button>
    </div>
  );
}

BuildPackagePanel.displayName = 'BuildPackagePanel';
