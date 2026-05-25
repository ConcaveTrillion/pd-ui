import * as React from 'react';
import { Check } from '../icons/lucide.js';
import { cn } from './cn.js';

export type StepDotsState = 'active' | 'done' | 'pending';

export interface StepDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered list of step labels. */
  steps: string[];
  /** Zero-based index of the current (active) step. */
  current: number;
  /** Optional click handler; called with the zero-based step index. */
  onStepClick?: (index: number) => void;
}

function getState(index: number, current: number): StepDotsState {
  if (index === current) return 'active';
  if (index < current) return 'done';
  return 'pending';
}

export const StepDots = React.forwardRef<HTMLDivElement, StepDotsProps>(function StepDots(
  { steps, current, onStepClick, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="Steps"
      className={cn('step-dots', className)}
      {...props}
    >
      {steps.map((label, i) => {
        const state = getState(i, current);
        const isActive = state === 'active';
        const isDone = state === 'done';

        return (
          <React.Fragment key={i}>
            {/* Step item: dot + label */}
            <div
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              className={cn('step-item')}
              onClick={() => onStepClick?.(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onStepClick?.(i);
                }
              }}
              style={{ cursor: onStepClick !== undefined ? 'pointer' : 'default' }}
            >
              {/* Circular dot */}
              <div
                className={cn('step-dot', `t-${state}`)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  background: isActive
                    ? 'var(--accent)'
                    : isDone
                      ? 'var(--exact)'
                      : 'var(--bg-raised)',
                  color: isActive || isDone ? 'var(--accent-ink)' : 'var(--ink-3)',
                  border: isActive || isDone ? 'none' : '1px solid var(--border-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'var(--mono-font)',
                  flexShrink: 0,
                }}
              >
                {isDone ? <Check size={10} strokeWidth={3} /> : i + 1}
              </div>

              {/* Step label */}
              <span
                className="step-label"
                style={{
                  fontSize: 11.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--ink-1)' : isDone ? 'var(--ink-2)' : 'var(--ink-3)',
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className="step-connector"
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 1,
                  background: 'var(--border-1)',
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

StepDots.displayName = 'StepDots';
