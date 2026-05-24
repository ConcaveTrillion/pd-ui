import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from './cn.js';

export interface ToggleProps {
  /** Current on/off state. */
  checked: boolean;
  /** Called with the new boolean state when the user toggles. */
  onCheckedChange: (checked: boolean) => void;
  /** Prevents interaction and dims the control. */
  disabled?: boolean;
  /** Optional text label rendered alongside the toggle. */
  label?: string;
  /** Optional id — wired to label `htmlFor` when label is provided. */
  id?: string;
  className?: string;
}

/**
 * Toggle — boolean switch primitive.
 *
 * Built on Radix `Switch` for accessible keyboard + aria behavior
 * (OQ-9 decision: Radix Switch in `src/primitives/Toggle.tsx`).
 *
 * Styled via `.toggle` / `.toggle__thumb` CSS classes — no inline styles.
 * Use alongside a `<label>` or provide `label` prop for accessible labeling.
 */
export function Toggle({
  checked,
  onCheckedChange,
  disabled,
  label,
  id,
  className,
}: ToggleProps): React.ReactElement {
  const autoId = React.useId();
  const switchId = id ?? autoId;

  return (
    <span className={cn('toggle-wrapper', className)}>
      <SwitchPrimitive.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn('toggle', checked ? 'toggle--on' : undefined)}
      >
        <SwitchPrimitive.Thumb className="toggle__thumb" />
      </SwitchPrimitive.Root>
      {label != null ? (
        <label htmlFor={switchId} className="toggle__label">
          {label}
        </label>
      ) : null}
    </span>
  );
}

Toggle.displayName = 'Toggle';
