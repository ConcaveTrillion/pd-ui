/**
 * AppearancePanel — built-in settings panel for UIPrefs.
 *
 * Controls: theme, density, fontScale, layerColors, statusColors,
 * accentColor / accentInkColor. All wired to createUIPrefsStore via
 * context hooks. No hex literals; all colors reference CSS tokens.
 *
 * testids (spec §Contract):
 *   settings-appearance-theme-dark
 *   settings-appearance-theme-light
 *   settings-appearance-density-compact
 *   settings-appearance-density-normal
 *   settings-appearance-density-comfortable
 *   settings-appearance-font-scale-slider
 *   settings-appearance-color-<key>        (color inputs)
 *   settings-appearance-color-<key>-reset  (reset buttons)
 */
import * as React from 'react';
import {
  useUIPrefs,
  useTheme,
  useDensity,
  useFontScale,
  useLayerColor,
  useStatusColor,
  useAccentColor,
} from '../stores/StoreContexts.js';
import { ColorField } from '../primitives/ColorField.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT_SCALE_MIN = 0.8;
const FONT_SCALE_MAX = 1.4;
const FONT_SCALE_STEP = 0.05;

function pct(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

// ─── Row layout helper ────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        minHeight: '32px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

// ─── Segmented toggle button ──────────────────────────────────────────────────

interface SegButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tabIndex?: number;
  'data-testid'?: string;
}

function SegButton({ active, onClick, children, tabIndex, ...rest }: SegButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      tabIndex={tabIndex ?? (active ? 0 : -1)}
      onClick={onClick}
      style={{
        padding: '3px 10px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--bg-raised)' : 'transparent',
        color: active ? 'var(--ink-1)' : 'var(--ink-3)',
        fontFamily: 'var(--ui-font)',
        fontSize: '11px',
        fontWeight: 500,
        transition: 'background .1s, color .1s',
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--ink-4)',
        paddingTop: '8px',
        paddingBottom: '4px',
        borderBottom: '1px solid var(--border-3)',
        marginBottom: '4px',
      }}
    >
      {children}
    </div>
  );
}

// ─── Color rows ───────────────────────────────────────────────────────────────

function LayerColorRow({
  layer,
  label,
  defaultToken,
}: {
  layer: 'block' | 'para' | 'line' | 'word';
  label: string;
  defaultToken: string;
}) {
  const { setLayerColor } = useUIPrefs();
  const value = useLayerColor(layer);
  return (
    <ColorField
      id={`appearance-color-layer-${layer}`}
      label={label}
      value={value}
      onChange={(v) => { setLayerColor(layer, v); }}
      defaultValue={defaultToken}
      inputTestId={`settings-appearance-color-${layer}`}
      resetTestId={`settings-appearance-color-${layer}-reset`}
    />
  );
}

function StatusColorRow({
  status,
  label,
  defaultToken,
}: {
  status: 'exact' | 'fuzzy' | 'mismatch' | 'ocr' | 'gt';
  label: string;
  defaultToken: string;
}) {
  const { setStatusColor } = useUIPrefs();
  const value = useStatusColor(status);
  return (
    <ColorField
      id={`appearance-color-status-${status}`}
      label={label}
      value={value}
      onChange={(v) => { setStatusColor(status, v); }}
      defaultValue={defaultToken}
      inputTestId={`settings-appearance-color-${status}`}
      resetTestId={`settings-appearance-color-${status}-reset`}
    />
  );
}

// ─── AppearancePanel ──────────────────────────────────────────────────────────

export function AppearancePanel() {
  const { setTheme, setDensity, setFontScale, setAccentColor, setAccentInkColor } = useUIPrefs();
  const theme = useTheme();
  const density = useDensity();
  const fontScale = useFontScale();
  const accentColors = useAccentColor();

  // Accent color value: strip var() wrapper for the input
  // The store returns 'var(--accent)' when no override. For the native color
  // input we need a hex string. If it's a var() fallback we show the token
  // default string as defaultValue and value both, so isOverridden = false.
  const accentIsToken = accentColors.fg.startsWith('var(');
  const accentInkIsToken = accentColors.bg.startsWith('var(');

  const accentValue = accentIsToken ? '#000000' : accentColors.fg;
  const accentInkValue = accentInkIsToken ? '#ffffff' : accentColors.bg;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '4px 0',
      }}
    >
      {/* ── Theme ─────────────────────────────────────────────────────── */}
      <Row label="Theme">
        <div
          role="radiogroup"
          aria-label="Theme"
          style={{
            display: 'inline-flex',
            padding: '2px',
            borderRadius: '6px',
            background: 'var(--bg-sunk)',
            border: '1px solid var(--border-2)',
          }}
        >
          <SegButton
            active={theme === 'dark'}
            onClick={() => { setTheme('dark'); }}
            data-testid="settings-appearance-theme-dark"
          >
            Dark
          </SegButton>
          <SegButton
            active={theme === 'light'}
            onClick={() => { setTheme('light'); }}
            data-testid="settings-appearance-theme-light"
          >
            Light
          </SegButton>
        </div>
      </Row>

      {/* ── Density ───────────────────────────────────────────────────── */}
      <Row label="Density">
        <div
          role="radiogroup"
          aria-label="Density"
          style={{
            display: 'inline-flex',
            padding: '2px',
            borderRadius: '6px',
            background: 'var(--bg-sunk)',
            border: '1px solid var(--border-2)',
          }}
        >
          <SegButton
            active={density === 'compact'}
            onClick={() => { setDensity('compact'); }}
            data-testid="settings-appearance-density-compact"
          >
            Compact
          </SegButton>
          <SegButton
            active={density === 'normal'}
            onClick={() => { setDensity('normal'); }}
            data-testid="settings-appearance-density-normal"
          >
            Normal
          </SegButton>
          <SegButton
            active={density === 'comfortable'}
            onClick={() => { setDensity('comfortable'); }}
            data-testid="settings-appearance-density-comfortable"
          >
            Comfortable
          </SegButton>
        </div>
      </Row>

      {/* ── Font scale ────────────────────────────────────────────────── */}
      <Row label={`Font: ${pct(fontScale)}`}>
        <input
          type="range"
          min={FONT_SCALE_MIN}
          max={FONT_SCALE_MAX}
          step={FONT_SCALE_STEP}
          value={fontScale}
          onChange={(e) => { setFontScale(parseFloat(e.target.value)); }}
          aria-label={`Font scale ${pct(fontScale)}`}
          data-testid="settings-appearance-font-scale-slider"
          style={{
            flex: 1,
            accentColor: 'var(--accent)',
          }}
        />
      </Row>

      {/* ── Accent colors ─────────────────────────────────────────────── */}
      <SectionHeading>Accent</SectionHeading>
      <ColorField
        id="appearance-color-accent"
        label="Accent"
        value={accentValue}
        onChange={(v) => { setAccentColor(v); }}
        {...(accentIsToken ? { defaultValue: accentValue } : {})}
        inputTestId="settings-appearance-color-accent"
        resetTestId="settings-appearance-color-accent-reset"
      />
      <ColorField
        id="appearance-color-accent-ink"
        label="Accent Ink"
        value={accentInkValue}
        onChange={(v) => { setAccentInkColor(v); }}
        {...(accentInkIsToken ? { defaultValue: accentInkValue } : {})}
        inputTestId="settings-appearance-color-accent-ink"
        resetTestId="settings-appearance-color-accent-ink-reset"
      />

      {/* ── Layer colors ──────────────────────────────────────────────── */}
      <SectionHeading>Layer colors</SectionHeading>
      <LayerColorRow layer="block" label="Block" defaultToken="var(--block)" />
      <LayerColorRow layer="para" label="Para" defaultToken="var(--para)" />
      <LayerColorRow layer="line" label="Line" defaultToken="var(--line)" />
      <LayerColorRow layer="word" label="Word" defaultToken="var(--word)" />

      {/* ── Status colors ─────────────────────────────────────────────── */}
      <SectionHeading>Status colors</SectionHeading>
      <StatusColorRow status="exact" label="Exact" defaultToken="var(--exact)" />
      <StatusColorRow status="fuzzy" label="Fuzzy" defaultToken="var(--fuzzy)" />
      <StatusColorRow status="mismatch" label="Mismatch" defaultToken="var(--mismatch)" />
      <StatusColorRow status="ocr" label="OCR" defaultToken="var(--ocr)" />
      <StatusColorRow status="gt" label="GT" defaultToken="var(--gt)" />
    </div>
  );
}

AppearancePanel.displayName = 'AppearancePanel';
