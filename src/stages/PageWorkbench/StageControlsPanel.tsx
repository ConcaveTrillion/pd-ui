import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import { BackendChip } from '../../primitives/BackendChip.js';
import {
  STAGE_CONTROLS_PANEL,
  STAGE_CONTROLS_PANEL_REVERT,
  STAGE_CONTROLS_PANEL_SAVE,
} from '../../testids/index.js';

/**
 * Inheritance state of the current stage's settings.
 *
 * - `'clean'`    — settings are at their defaults (no overrides).
 * - `'modified'` — settings have been changed from the defaults.
 * - `'preset'`   — settings are sourced from a named preset.
 */
export type Inheritance = 'clean' | 'modified' | 'preset';

export interface StageControlsPanelProps {
  /**
   * Inheritance state — drives the header banner copy and tone.
   */
  inheritance: Inheritance;

  /**
   * When `inheritance='preset'`, the name of the active preset to display.
   */
  presetName?: string;

  /**
   * When true, renders a CPU-fallback warning row beneath the header banner
   * using `BackendChip` with `backend='cpu'` and `fallback=true`.
   */
  cpuFallback?: boolean;

  /**
   * Per-stage control content — rendered in the scrollable body between the
   * banner and the sticky footer.
   */
  controlsSlot: React.ReactNode;

  /** Called when the user clicks "Revert". */
  onRevert?: () => void;

  /** Called when the user clicks "Save as default". */
  onSave?: () => void;

  /**
   * When true, both footer action buttons are rendered in their disabled state
   * and their callbacks will not fire.
   */
  disabled?: boolean;

  'data-testid'?: string;
}

const INHERITANCE_LABEL: Record<Inheritance, string> = {
  clean: 'Using defaults',
  modified: 'Overrides active',
  preset: 'Preset applied',
};

const INHERITANCE_MODIFIER: Record<Inheritance, string> = {
  clean: 'clean',
  modified: 'modified',
  preset: 'preset',
};

/**
 * StageControlsPanel — left-drawer chrome for per-stage controls.
 *
 * Slot-based: accepts a `controlsSlot` render prop. The shell handles the
 * inheritance-banner, optional CPU-fallback warning, and sticky Revert /
 * Save-as-default footer. Per-stage content (`ThresholdControls`,
 * `GrayscaleControls`, etc.) is composed here by the consuming page.
 */
export const StageControlsPanel = React.forwardRef<HTMLElement, StageControlsPanelProps>(
  function StageControlsPanel(
    {
      inheritance,
      presetName,
      cpuFallback,
      controlsSlot,
      onRevert,
      onSave,
      disabled = false,
      'data-testid': testId = STAGE_CONTROLS_PANEL,
    },
    ref,
  ) {
    const modifier = INHERITANCE_MODIFIER[inheritance];

    return (
      <aside
        ref={ref}
        className="stage-controls-panel"
        data-testid={testId}
        data-inheritance={inheritance}
      >
        {/* ── Header: inheritance banner ── */}
        <header
          className={`stage-controls-panel__header stage-controls-panel__header--${modifier}`}
        >
          <div className="stage-controls-panel__banner">
            <span
              className={`stage-controls-panel__banner-indicator stage-controls-panel__banner-indicator--${modifier}`}
              aria-hidden="true"
            />
            <div className="stage-controls-panel__banner-text">
              <span className="stage-controls-panel__banner-label">
                {INHERITANCE_LABEL[inheritance]}
              </span>
              {inheritance === 'preset' && presetName != null ? (
                <span className="stage-controls-panel__banner-preset mono">{presetName}</span>
              ) : null}
            </div>
          </div>
        </header>

        {/* ── CPU-fallback warning row ── */}
        {cpuFallback === true ? (
          <div className="stage-controls-panel__cpu-warning" role="alert" aria-live="polite">
            <BackendChip backend="cpu" fallback={true} />
            <span className="stage-controls-panel__cpu-warning-text">
              GPU unavailable — running on CPU
            </span>
          </div>
        ) : null}

        {/* ── Scrollable controls body ── */}
        <div className="stage-controls-panel__content">{controlsSlot}</div>

        {/* ── Sticky footer ── */}
        <footer className="stage-controls-panel__footer">
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            data-testid={STAGE_CONTROLS_PANEL_REVERT}
            onClick={disabled ? undefined : onRevert}
          >
            Revert
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={disabled}
            data-testid={STAGE_CONTROLS_PANEL_SAVE}
            onClick={disabled ? undefined : onSave}
          >
            Save as default
          </Button>
        </footer>
      </aside>
    );
  },
);

StageControlsPanel.displayName = 'StageControlsPanel';
