/**
 * StageJumpPopover — pipeline stage navigation popover.
 *
 * Renders a trigger button that opens a Radix Popover listing all pipeline
 * stages. Each stage is clickable and calls `onJump(stageId)` except for the
 * currently-active stage, which is rendered as "active" only.
 *
 * Used in wf03/wf11/wf-pw stage navigation.
 *
 * Constraints:
 *   - No hex literals — all colors via var(--token).
 *   - Uses Radix Popover (behaviour-heavy = Radix-appropriate).
 *   - No direct lucide-react imports.
 */
import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../primitives/Popover.js';
import { Badge } from '../primitives/Badge.js';
import { Button } from '../primitives/Button.js';
import { cn } from '../primitives/cn.js';
import type { StageDef } from './StageStrip.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StageJumpPopoverProps {
  /** Ordered list of pipeline stage descriptors. */
  stages: StageDef[];
  /** Currently active stage id — this stage is highlighted, not clickable as jump. */
  currentStage: string;
  /** Called with the target stage id when the user selects a stage to jump to. */
  onJump: (stageId: string) => void;
  /** Custom trigger element. Defaults to a "Jump to stage…" button. */
  trigger?: React.ReactNode;
  /** When true, the popover starts open (for testing / Storybook). */
  defaultOpen?: boolean;
  className?: string;
}

// ─── Group ordering helper ─────────────────────────────────────────────────────

function groupStages(stages: StageDef[]): { group: string; stages: StageDef[] }[] {
  const groups: { group: string; stages: StageDef[] }[] = [];
  for (const stage of stages) {
    const existing = groups.find((g) => g.group === stage.group);
    if (existing != null) {
      existing.stages.push(stage);
    } else {
      groups.push({ group: stage.group, stages: [stage] });
    }
  }
  return groups;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StageJumpPopover({
  stages,
  currentStage,
  onJump,
  trigger,
  defaultOpen,
  className,
}: StageJumpPopoverProps): React.ReactElement {
  const [open, setOpen] = React.useState(defaultOpen ?? false);

  const grouped = groupStages(stages);

  const handleJump = (stageId: string): void => {
    if (stageId === currentStage) return;
    onJump(stageId);
    setOpen(false);
  };

  const triggerNode = trigger ?? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Jump to stage"
      className="stage-jump-popover__trigger-btn"
    >
      Jump to stage…
    </Button>
  );

  return (
    <div className={cn('stage-jump-popover', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {triggerNode}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="stage-jump-popover__content"
        >
          <div className="stage-jump-popover__list" role="menu">
            {grouped.map(({ group, stages: groupStages }) => (
              <div key={group} className="stage-jump-popover__group">
                <div className="stage-jump-popover__group-label">{group}</div>
                {groupStages.map((stage) => {
                  const isCurrent = stage.id === currentStage;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="menuitem"
                      className={cn(
                        'stage-jump-popover__item',
                        isCurrent ? 'stage-jump-popover__item--current' : undefined,
                      )}
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => handleJump(stage.id)}
                    >
                      <span className="stage-jump-popover__item-label">{stage.short}</span>
                      {isCurrent ? (
                        <Badge tone="brand" className="stage-jump-popover__item-badge">
                          current
                        </Badge>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

StageJumpPopover.displayName = 'StageJumpPopover';
