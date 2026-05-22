/**
 * SettingsSlot — gear button that opens a Radix Popover with UI preference
 * controls: theme toggle, density picker, and font-scale slider.
 *
 * Uses Radix `@radix-ui/react-popover` for accessible popover behaviour.
 * All styles reference CSS custom properties — no hex literals.
 * Icon imported from src/icons to respect the no-direct-lucide rule.
 */
import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Settings } from '../icons/lucide.js';
import { useUIPrefs, useDensity, useFontScale, useTheme } from '../stores/StoreContexts.js';

// ─── Internal helpers ─────────────────────────────────────────────────────────

const FONT_SCALE_MIN = 0.8;
const FONT_SCALE_MAX = 1.4;
const FONT_SCALE_STEP = 0.05;

function pct(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

// ─── Row layout helper ────────────────────────────────────────────────────────

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

// ─── Segmented-style toggle group ─────────────────────────────────────────────

interface SegButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

function SegButton({ active, onClick, children, ...rest }: SegButtonProps) {
  return (
    <button
      type="button"
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

// ─── SettingsSlot ─────────────────────────────────────────────────────────────

export function SettingsSlot() {
  const { setTheme, setDensity, setFontScale } = useUIPrefs();
  const theme = useTheme();
  const density = useDensity();
  const fontScale = useFontScale();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Settings and preferences"
          data-testid="settings-slot-trigger"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            padding: 0,
            border: '1px solid var(--border-2)',
            borderRadius: '6px',
            background: 'var(--bg-raised)',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background .12s, color .12s',
          }}
        >
          <Settings size={15} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          data-testid="settings-slot-popover"
          onInteractOutside={(e) => {
            // Prevent Radix DismissableLayer from closing the popover when a
            // pointer interaction fires due to reflow during a live control
            // drag (e.g. the font-scale slider updating the "Font: N%" label,
            // which causes Floating UI to reposition and emit an outside-interact
            // event). We intentionally always prevent default here so that sliders
            // and toggles inside the popover work correctly. Users can still close
            // the popover by pressing Escape or clicking the gear trigger again.
            e.preventDefault()
          }}
          style={{
            minWidth: '240px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-2)',
            borderRadius: '8px',
            padding: '12px 14px',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--ink-1) 12%, transparent)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 9999,
          }}
        >
          {/* Theme */}
          <SettingsRow label="Theme">
            <div
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
                data-testid="settings-theme-dark"
              >
                Dark
              </SegButton>
              <SegButton
                active={theme === 'light'}
                onClick={() => { setTheme('light'); }}
                data-testid="settings-theme-light"
              >
                Light
              </SegButton>
            </div>
          </SettingsRow>

          {/* Density */}
          <SettingsRow label="Density">
            <div
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
                data-testid="settings-density-compact"
              >
                Compact
              </SegButton>
              <SegButton
                active={density === 'normal'}
                onClick={() => { setDensity('normal'); }}
                data-testid="settings-density-normal"
              >
                Normal
              </SegButton>
              <SegButton
                active={density === 'comfortable'}
                onClick={() => { setDensity('comfortable'); }}
                data-testid="settings-density-comfortable"
              >
                Comfortable
              </SegButton>
            </div>
          </SettingsRow>

          {/* Font scale */}
          <SettingsRow label={`Font: ${pct(fontScale)}`}>
            <input
              type="range"
              min={FONT_SCALE_MIN}
              max={FONT_SCALE_MAX}
              step={FONT_SCALE_STEP}
              value={fontScale}
              onChange={(e) => { setFontScale(parseFloat(e.target.value)); }}
              aria-label={`Font scale ${pct(fontScale)}`}
              data-testid="settings-font-scale-slider"
              style={{
                flex: 1,
                accentColor: 'var(--accent)',
              }}
            />
          </SettingsRow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

SettingsSlot.displayName = 'SettingsSlot';
