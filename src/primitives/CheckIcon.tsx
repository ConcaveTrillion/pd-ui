import * as React from 'react';
import { Icon } from '../icons/Icon.js';
import { cn } from './cn.js';
import { CHECK_ICON } from '../testids/index.js';

/** The five validation states a CheckIcon can represent. */
export type CheckIconState = 'pass' | 'warn' | 'error' | 'running' | 'skip';

export interface CheckIconProps {
  /** Validation state to visualise. */
  state: CheckIconState;
  /** Icon size in pixels (width + height). Default: 16. */
  size?: number;
  /** Additional CSS class forwarded to the outer span. */
  className?: string;
}

/**
 * Generic state icon for validation displays.
 *
 * Maps each state to a design-system icon and token color:
 *   pass    → Check     (var(--exact)    — green)
 *   warn    → alert     (var(--fuzzy)    — amber)
 *   error   → x         (var(--mismatch) — red)
 *   running → loader    (var(--ink-2)    — neutral, with CSS spin)
 *   skip    → minus     (var(--ink-2)    — neutral)
 *
 * Colors come from token variables only — no hex literals.
 */
export function CheckIcon({ state, size = 16, className }: CheckIconProps): React.ReactElement {
  const config = STATE_CONFIG[state];
  return (
    <span
      data-testid={CHECK_ICON}
      data-state={state}
      className={cn('check-icon', `check-icon--${state}`, className)}
      style={{ color: config.color, display: 'inline-flex', alignItems: 'center' }}
      aria-label={config.label}
    >
      {state === 'running'
        ? <Icon name={config.icon} size={size} className="check-icon__spin" />
        : <Icon name={config.icon} size={size} />
      }
    </span>
  );
}

CheckIcon.displayName = 'CheckIcon';

// ---------------------------------------------------------------------------
// State → icon/color config
// ---------------------------------------------------------------------------

interface StateConfig {
  icon: 'check' | 'alert' | 'x' | 'loader' | 'minus';
  color: string;
  label: string;
}

const STATE_CONFIG: Record<CheckIconState, StateConfig> = {
  pass:    { icon: 'check',  color: 'var(--exact)',    label: 'Pass'    },
  warn:    { icon: 'alert',  color: 'var(--fuzzy)',    label: 'Warning' },
  error:   { icon: 'x',     color: 'var(--mismatch)', label: 'Error'   },
  running: { icon: 'loader', color: 'var(--ink-2)',    label: 'Running' },
  skip:    { icon: 'minus',  color: 'var(--ink-2)',    label: 'Skip'    },
};
