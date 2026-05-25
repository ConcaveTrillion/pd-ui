/**
 * PipelineMini — compact 23-dot pipeline progress strip for the Projects
 * sidebar. Ported from `final/projects/projects.jsx` lines 93-116.
 *
 * Props:
 *   stages        — array of stage descriptors (id, label?, status?)
 *   activeStageId — overrides status='active' computation; the matching dot
 *                   gets the active style regardless of its status field.
 */

import React from 'react';
import { PROJECTS_PIPELINE_MINI, projectsPipelineMiniDotTestId } from '../../testids/index.js';
import './PipelineMini.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PipelineMiniStageStatus = 'done' | 'active' | 'pending' | 'skipped';

export interface PipelineMiniStage {
  id: string;
  label?: string;
  /** Explicit status — 'active' is superseded by `activeStageId` when provided. */
  status?: PipelineMiniStageStatus;
}

export interface PipelineMiniProps {
  stages: PipelineMiniStage[];
  /** Overrides status='active' computation. */
  activeStageId?: string;
  /** Custom testid for the container. Defaults to PROJECTS_PIPELINE_MINI. */
  'data-testid'?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PipelineMini = ({
  stages,
  activeStageId,
  'data-testid': testId = PROJECTS_PIPELINE_MINI,
}: PipelineMiniProps): React.ReactElement => {
  return (
    <div
      className="pipeline-mini"
      data-testid={testId}
      aria-label="Pipeline progress"
    >
      {stages.map((stage) => {
        const resolvedStatus = resolveStatus(stage, activeStageId);
        const label = stage.label ?? stage.id;
        const ariaLabel = `${label} — ${resolvedStatus}`;
        const isActive = resolvedStatus === 'active';

        return (
          <span
            key={stage.id}
            role="img"
            aria-label={ariaLabel}
            title={ariaLabel}
            className="pipeline-mini__dot"
            data-status={resolvedStatus}
            {...(isActive ? { 'data-active': 'true' } : {})}
            data-testid={projectsPipelineMiniDotTestId(stage.id)}
          />
        );
      })}
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveStatus(
  stage: PipelineMiniStage,
  activeStageId: string | undefined,
): PipelineMiniStageStatus {
  // activeStageId takes precedence — suppress any status='active' on other stages
  if (activeStageId !== undefined) {
    if (stage.id === activeStageId) return 'active';
    // Don't propagate 'active' to non-matching stages
    const s = stage.status;
    return s === 'active' ? 'pending' : (s ?? 'pending');
  }
  return stage.status ?? 'pending';
}
