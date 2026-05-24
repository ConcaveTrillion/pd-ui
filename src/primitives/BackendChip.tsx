import * as React from 'react';
import { Badge } from './Badge.js';
import type { BadgeTone } from './Badge.js';

export type BackendValue = 'gpu' | 'cpu' | 'auto';

export interface BackendChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which compute backend is active. */
  backend: BackendValue;
  /**
   * When true and `backend='cpu'`, the CPU is a fallback (GPU was requested
   * but unavailable). Renders an amber chip with a "↓" fallback marker.
   * Has no effect when `backend` is not 'cpu'.
   */
  fallback?: boolean;
}

const TONE_MAP: Record<BackendValue, BadgeTone> = {
  gpu: 'exact',
  cpu: 'fuzzy',
  auto: 'neutral',
};

const BASE_LABEL: Record<BackendValue, string> = {
  gpu: 'GPU · CUDA',
  cpu: 'CPU · numpy',
  auto: 'auto',
};

/**
 * BackendChip — GPU / CPU / auto status indicator chip.
 *
 * Promoted from stage-local usage (Grayscale + PageWorkbench StageControlsPanel)
 * to `src/primitives/` as suite-wide vocabulary (Phase 2 M2 atom promotion).
 *
 * Composes on top of `Badge` so that all tone tokens and dot rendering come
 * from the existing design-system primitive rather than duplicating styles.
 */
export const BackendChip = React.forwardRef<HTMLSpanElement, BackendChipProps>(
  function BackendChip({ backend, fallback, ...props }, ref) {
    const tone = TONE_MAP[backend];
    const isFallback = fallback === true && backend === 'cpu';
    const label = isFallback ? `${BASE_LABEL[backend]} ↓` : BASE_LABEL[backend];

    return (
      <Badge
        ref={ref}
        tone={tone}
        dot
        mono
        data-backend={backend}
        data-fallback={isFallback ? 'true' : undefined}
        {...props}
      >
        {label}
      </Badge>
    );
  },
);

BackendChip.displayName = 'BackendChip';
