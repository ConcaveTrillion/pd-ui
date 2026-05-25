import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StageControlsPanel } from './StageControlsPanel.js';
import {
  STAGE_CONTROLS_PANEL,
  STAGE_CONTROLS_PANEL_REVERT,
  STAGE_CONTROLS_PANEL_SAVE,
} from '../../testids/index.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function renderPanel(props: Partial<React.ComponentProps<typeof StageControlsPanel>> = {}) {
  const defaults: React.ComponentProps<typeof StageControlsPanel> = {
    inheritance: 'clean',
    controlsSlot: <div data-testid="slot-content">controls here</div>,
    ...props,
  };
  return render(<StageControlsPanel {...defaults} />);
}

// ── inheritance variants ──────────────────────────────────────────────────────

describe('StageControlsPanel — inheritance variants', () => {
  it('clean: shows "Using defaults"', () => {
    renderPanel({ inheritance: 'clean' });
    expect(screen.getByText('Using defaults')).toBeInTheDocument();
  });

  it('clean: sets data-inheritance=clean on aside', () => {
    renderPanel({ inheritance: 'clean' });
    const aside = screen.getByTestId(STAGE_CONTROLS_PANEL);
    expect(aside).toHaveAttribute('data-inheritance', 'clean');
  });

  it('modified: shows "Overrides active"', () => {
    renderPanel({ inheritance: 'modified' });
    expect(screen.getByText('Overrides active')).toBeInTheDocument();
  });

  it('modified: sets data-inheritance=modified', () => {
    renderPanel({ inheritance: 'modified' });
    const aside = screen.getByTestId(STAGE_CONTROLS_PANEL);
    expect(aside).toHaveAttribute('data-inheritance', 'modified');
  });

  it('preset: shows "Preset applied"', () => {
    renderPanel({ inheritance: 'preset', presetName: 'My Preset' });
    expect(screen.getByText('Preset applied')).toBeInTheDocument();
  });

  it('preset: shows the preset name', () => {
    renderPanel({ inheritance: 'preset', presetName: 'WF-11 Default' });
    expect(screen.getByText('WF-11 Default')).toBeInTheDocument();
  });

  it('preset with no presetName: does not render preset name span', () => {
    renderPanel({ inheritance: 'preset' });
    // The preset label is shown but no extra name text
    expect(screen.queryByText(/WF/)).not.toBeInTheDocument();
  });
});

// ── cpuFallback ───────────────────────────────────────────────────────────────

describe('StageControlsPanel — cpuFallback', () => {
  it('cpuFallback=true: renders CPU-fallback warning row', () => {
    renderPanel({ cpuFallback: true });
    // BackendChip renders with data-backend='cpu'
    const chip = document.querySelector('[data-backend="cpu"]');
    expect(chip).not.toBeNull();
  });

  it('cpuFallback=true: warning row has role=alert', () => {
    renderPanel({ cpuFallback: true });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('cpuFallback=false: no alert row rendered', () => {
    renderPanel({ cpuFallback: false });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('cpuFallback omitted: no alert row rendered', () => {
    renderPanel({});
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ── controlsSlot ─────────────────────────────────────────────────────────────

describe('StageControlsPanel — controlsSlot', () => {
  it('renders slot content inside the content area', () => {
    renderPanel({
      controlsSlot: <p data-testid="my-controls">slider here</p>,
    });
    expect(screen.getByTestId('my-controls')).toBeInTheDocument();
  });

  it('slot content is inside the __content div', () => {
    renderPanel({
      controlsSlot: <span data-testid="inner">x</span>,
    });
    const inner = screen.getByTestId('inner');
    const content = inner.closest('.stage-controls-panel__content');
    expect(content).not.toBeNull();
  });

  it('null controlsSlot renders without error', () => {
    renderPanel({ controlsSlot: null });
    expect(screen.getByTestId(STAGE_CONTROLS_PANEL)).toBeInTheDocument();
  });
});

// ── callbacks ─────────────────────────────────────────────────────────────────

describe('StageControlsPanel — callbacks', () => {
  it('onRevert fires when Revert button is clicked', async () => {
    const onRevert = vi.fn();
    renderPanel({ onRevert });
    await userEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT));
    expect(onRevert).toHaveBeenCalledOnce();
  });

  it('onSave fires when Save as default button is clicked', async () => {
    const onSave = vi.fn();
    renderPanel({ onSave });
    await userEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('no error when onRevert is omitted and Revert is clicked', async () => {
    // omit onRevert entirely — exactOptionalPropertyTypes forbids passing undefined
    renderPanel({});
    await userEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT));
    // no throw
  });

  it('no error when onSave is omitted and Save is clicked', async () => {
    // omit onSave entirely — exactOptionalPropertyTypes forbids passing undefined
    renderPanel({});
    await userEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE));
    // no throw
  });
});

// ── disabled ──────────────────────────────────────────────────────────────────

describe('StageControlsPanel — disabled', () => {
  it('disabled=true: Revert button is disabled', () => {
    renderPanel({ disabled: true });
    const btn = screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT);
    expect(btn).toBeDisabled();
  });

  it('disabled=true: Save button is disabled', () => {
    renderPanel({ disabled: true });
    const btn = screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE);
    expect(btn).toBeDisabled();
  });

  it('disabled=true: onRevert does not fire when button is clicked', async () => {
    const onRevert = vi.fn();
    renderPanel({ disabled: true, onRevert });
    const btn = screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT);
    // userEvent respects the disabled attribute
    await userEvent.click(btn);
    expect(onRevert).not.toHaveBeenCalled();
  });

  it('disabled=true: onSave does not fire when button is clicked', async () => {
    const onSave = vi.fn();
    renderPanel({ disabled: true, onSave });
    const btn = screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE);
    await userEvent.click(btn);
    expect(onSave).not.toHaveBeenCalled();
  });
});

// ── data-testid forward ───────────────────────────────────────────────────────

describe('StageControlsPanel — data-testid', () => {
  it('default testid is STAGE_CONTROLS_PANEL', () => {
    renderPanel();
    expect(screen.getByTestId(STAGE_CONTROLS_PANEL)).toBeInTheDocument();
  });

  it('custom data-testid overrides the default', () => {
    renderPanel({ 'data-testid': 'custom-panel' });
    expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
    expect(screen.queryByTestId(STAGE_CONTROLS_PANEL)).not.toBeInTheDocument();
  });
});

// ── footer button labels ───────────────────────────────────────────────────────

describe('StageControlsPanel — footer', () => {
  it('footer has Revert and Save as default buttons', () => {
    renderPanel();
    expect(screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT)).toHaveTextContent('Revert');
    expect(screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE)).toHaveTextContent('Save as default');
  });

  it('footer buttons are inside the __footer element', () => {
    renderPanel();
    const revert = screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT);
    const footer = revert.closest('.stage-controls-panel__footer');
    expect(footer).not.toBeNull();
  });
});
