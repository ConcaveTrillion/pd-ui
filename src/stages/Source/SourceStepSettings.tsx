import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import { Toggle } from '../../primitives/Toggle.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThumbQuality = 'low' | 'medium' | 'high';

export interface SourceSettings {
  /** Active preset id (null = no preset, custom values). */
  preset: string | null;
  thumbQuality: ThumbQuality;
  /** 1-8 concurrent workers. */
  workers: number;
  /** Auto-confirm generation when done. */
  autoConfirm: boolean;
}

export interface PresetOption {
  value: string;
  label: string;
}

export interface SourceStepSettingsProps {
  settings: SourceSettings;
  onChange: (next: SourceSettings) => void;
  /** Available presets. */
  presets: ReadonlyArray<PresetOption>;
  /** Save the current settings as a new preset. */
  onSavePreset?: (name: string) => void;
  /** Re-generate trigger. */
  onRegenerate?: () => void;
  'data-testid'?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUALITY_OPTIONS: Array<{ value: ThumbQuality; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SourceStepSettings — Settings panel for the Source generation step.
 *
 * Controls preset selection, thumbnail quality, worker concurrency,
 * auto-confirm, and re-generate. All field changes fire `onChange` with the
 * full updated `SourceSettings` (immutable spread).
 *
 * Save-preset uses an inline form (no native prompt()).
 */
export function SourceStepSettings({
  settings,
  onChange,
  presets,
  onSavePreset,
  onRegenerate,
  'data-testid': testid,
}: SourceStepSettingsProps): React.ReactElement {
  const [saveFormOpen, setSaveFormOpen] = React.useState(false);
  const [presetName, setPresetName] = React.useState('');
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  // Focus name input when form opens.
  React.useEffect(() => {
    if (saveFormOpen) {
      nameInputRef.current?.focus();
    }
  }, [saveFormOpen]);

  function handlePresetChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const raw = e.target.value;
    const next: SourceSettings = {
      ...settings,
      preset: raw === '' ? null : raw,
    };
    onChange(next);
  }

  function handleQualityChange(value: ThumbQuality) {
    onChange({ ...settings, thumbQuality: value });
  }

  function handleWorkersChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 1 && v <= 8) {
      onChange({ ...settings, workers: v });
    }
  }

  function handleAutoConfirmChange(checked: boolean) {
    onChange({ ...settings, autoConfirm: checked });
  }

  function handleOpenSaveForm() {
    setPresetName('');
    setSaveFormOpen(true);
  }

  function handleCancelSave() {
    setSaveFormOpen(false);
    setPresetName('');
  }

  function handleConfirmSave() {
    const trimmed = presetName.trim();
    if (trimmed && onSavePreset) {
      onSavePreset(trimmed);
    }
    setSaveFormOpen(false);
    setPresetName('');
  }

  function handleSaveKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelSave();
    }
  }

  const selectValue = settings.preset ?? '';

  return (
    <section
      className="source-step-settings"
      data-testid={testid}
    >
      {/* ── Preset row ─────────────────────────────────────────────────────── */}
      <div className="source-step-settings__row source-step-settings__row--preset">
        <label
          className="source-step-settings__label"
          htmlFor="source-step-settings-preset"
        >
          Preset
        </label>
        <div className="source-step-settings__preset-controls">
          <select
            id="source-step-settings-preset"
            className="source-step-settings__select"
            value={selectValue}
            onChange={handlePresetChange}
            data-testid="source-step-settings-preset"
          >
            <option value="">— No preset —</option>
            {presets.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {onSavePreset != null ? (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleOpenSaveForm}
              data-testid="source-step-settings-save-preset"
              disabled={saveFormOpen}
            >
              Save as preset…
            </Button>
          ) : null}
        </div>

        {/* Inline save-preset form */}
        {saveFormOpen ? (
          <div className="source-step-settings__save-form">
            <input
              ref={nameInputRef}
              type="text"
              className="source-step-settings__save-input"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={handleSaveKeyDown}
              aria-label="New preset name"
            />
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleConfirmSave}
              disabled={presetName.trim().length === 0}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleCancelSave}
            >
              Cancel
            </Button>
          </div>
        ) : null}
      </div>

      {/* ── Thumbnail quality ───────────────────────────────────────────────── */}
      <fieldset className="source-step-settings__row source-step-settings__fieldset">
        <legend className="source-step-settings__label">
          Thumbnail quality
        </legend>
        <div className="source-step-settings__radio-group">
          {QUALITY_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="source-step-settings__radio-label"
              data-testid={`source-step-settings-quality-${value}`}
            >
              <input
                type="radio"
                name="thumb-quality"
                value={value}
                checked={settings.thumbQuality === value}
                onChange={() => handleQualityChange(value)}
                className="source-step-settings__radio-input"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Concurrent workers ──────────────────────────────────────────────── */}
      <div className="source-step-settings__row">
        <label
          className="source-step-settings__label"
          htmlFor="source-step-settings-workers"
        >
          Concurrent workers
        </label>
        <div className="source-step-settings__slider-row">
          <input
            id="source-step-settings-workers"
            type="range"
            min={1}
            max={8}
            step={1}
            value={settings.workers}
            onChange={handleWorkersChange}
            className="source-step-settings__slider"
            data-testid="source-step-settings-workers"
          />
          <span className="source-step-settings__slider-value" aria-live="polite">
            {settings.workers}
          </span>
        </div>
      </div>

      {/* ── Auto-confirm ────────────────────────────────────────────────────── */}
      <div
        className="source-step-settings__row source-step-settings__row--toggle"
        data-testid="source-step-settings-auto-confirm"
      >
        <span className="source-step-settings__label">Auto-confirm</span>
        <Toggle
          checked={settings.autoConfirm}
          onCheckedChange={handleAutoConfirmChange}
          label="Auto-confirm generation when done"
          id="source-step-settings-auto-confirm"
        />
      </div>

      {/* ── Re-generate ─────────────────────────────────────────────────────── */}
      {onRegenerate != null ? (
        <div className="source-step-settings__row source-step-settings__row--regen">
          <Button
            variant="primary"
            size="md"
            type="button"
            onClick={onRegenerate}
            data-testid="source-step-settings-regenerate"
          >
            Re-generate
          </Button>
        </div>
      ) : null}
    </section>
  );
}

SourceStepSettings.displayName = 'SourceStepSettings';
