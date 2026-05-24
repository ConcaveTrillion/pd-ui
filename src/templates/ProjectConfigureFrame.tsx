/**
 * ProjectConfigureFrame — combined configure/build panel for pipeline stages.
 *
 * Composes:
 *   - DiskCostBanner    (artifact size + optional prune)
 *   - RunAllDirtyPanel  (re-run dirty pages)
 *   - BuildPackagePanel (trigger package build)
 *
 * Provides a `children` slot for stage-specific controls above the
 * action panels.
 *
 * Used in wf02/05/05b/09/10 pipeline-shell.jsx (right-side configure pane).
 * Token-only styling; no hex literals.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';
import { DiskCostBanner } from '../primitives/DiskCostBanner.js';
import { RunAllDirtyPanel } from '../primitives/RunAllDirtyPanel.js';
import { BuildPackagePanel } from '../primitives/BuildPackagePanel.js';
import type { BadgeTone } from '../primitives/Badge.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectConfigureFrameProps {
  /** Human-readable artifact disk size string, e.g. `"1.84 GB"`. */
  diskSize: string;
  /** Called when the user clicks "Prune…" in the DiskCostBanner. */
  onPrune?: () => void;
  /** Number of pages with dirty (un-processed) status. */
  dirtyCount: number;
  /** Handler called when the user clicks "Run All". */
  onRunAll: () => void;
  /** Handler called when the user clicks "Build Package". */
  onBuild: () => void;
  /**
   * When true, disables RunAllDirtyPanel button and shows running state.
   * Also disables BuildPackagePanel while a job is in progress.
   */
  running?: boolean;
  /** Hard-disable all actions. */
  disabled?: boolean;
  /**
   * Build status tone for the BuildPackagePanel badge.
   * Shown alongside `buildStatusLabel` when provided.
   */
  buildStatus?: BadgeTone;
  /** Human-readable build status label (e.g. "Ready", "Building…"). */
  buildStatusLabel?: string;
  /** Stage-specific controls rendered above the action panels. */
  children?: React.ReactNode;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectConfigureFrame({
  diskSize,
  onPrune,
  dirtyCount,
  onRunAll,
  onBuild,
  running,
  disabled,
  buildStatus,
  buildStatusLabel,
  children,
  className,
}: ProjectConfigureFrameProps): React.ReactElement {
  return (
    <aside className={cn('project-configure-frame', className)}>
      {children != null ? (
        <div className="project-configure-frame__slot">{children}</div>
      ) : null}

      <DiskCostBanner
        size={diskSize}
        {...(onPrune !== undefined ? { onPrune } : {})}
        className="project-configure-frame__disk"
      />

      <RunAllDirtyPanel
        dirtyCount={dirtyCount}
        onRunAll={onRunAll}
        {...(running !== undefined ? { running } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
        className="project-configure-frame__run-all"
      />

      <BuildPackagePanel
        onBuild={onBuild}
        {...(running !== undefined ? { building: running } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
        {...(buildStatus !== undefined ? { status: buildStatus } : {})}
        {...(buildStatusLabel !== undefined ? { statusLabel: buildStatusLabel } : {})}
        className="project-configure-frame__build"
      />
    </aside>
  );
}

ProjectConfigureFrame.displayName = 'ProjectConfigureFrame';
