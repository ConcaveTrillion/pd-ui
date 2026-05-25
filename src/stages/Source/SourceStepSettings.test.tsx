import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SourceStepSettings } from './SourceStepSettings.js';
import type { SourceSettings, PresetOption } from './SourceStepSettings.js';

const DEFAULT_SETTINGS: SourceSettings = {
  preset: null,
  thumbQuality: 'medium',
  workers: 4,
  autoConfirm: false,
};

const PRESETS: ReadonlyArray<PresetOption> = [
  { value: 'fast', label: 'Fast' },
  { value: 'hq', label: 'High Quality' },
];

describe('SourceStepSettings', () => {
  // ── Render checks ──────────────────────────────────────────────────────────

  it('renders all 4 settings sections', () => {
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={PRESETS}
      />,
    );
    // Preset row
    expect(screen.getByRole('combobox')).toBeDefined();
    // Thumbnail quality fieldset
    expect(screen.getByRole('group')).toBeDefined();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    // Workers slider
    expect(screen.getByRole('slider')).toBeDefined();
    // Auto-confirm toggle (via its label)
    expect(screen.getByText('Auto-confirm generation when done')).toBeDefined();
  });

  // ── Preset select ──────────────────────────────────────────────────────────

  it('fires onChange with updated preset when preset select changes', () => {
    const onChange = vi.fn();
    render(
      <SourceStepSettings settings={DEFAULT_SETTINGS} onChange={onChange} presets={PRESETS} />,
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'fast' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      preset: 'fast',
    });
  });

  it('fires onChange with preset: null when blank option is selected', () => {
    const onChange = vi.fn();
    const settingsWithPreset: SourceSettings = { ...DEFAULT_SETTINGS, preset: 'fast' };
    render(
      <SourceStepSettings settings={settingsWithPreset} onChange={onChange} presets={PRESETS} />,
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith({ ...settingsWithPreset, preset: null });
  });

  // ── Thumbnail quality radio ────────────────────────────────────────────────

  it('fires onChange with updated thumbQuality when radio changes', () => {
    const onChange = vi.fn();
    render(<SourceStepSettings settings={DEFAULT_SETTINGS} onChange={onChange} presets={[]} />);
    const highRadio = screen.getByRole('radio', { name: 'High' });
    fireEvent.click(highRadio);
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      thumbQuality: 'high',
    });
  });

  it('marks the current quality radio as checked', () => {
    render(
      <SourceStepSettings
        settings={{ ...DEFAULT_SETTINGS, thumbQuality: 'low' }}
        onChange={() => undefined}
        presets={[]}
      />,
    );
    const lowRadio = screen.getByRole('radio', { name: 'Low' });
    expect((lowRadio as HTMLInputElement).checked).toBe(true);
    const highRadio = screen.getByRole('radio', { name: 'High' });
    expect((highRadio as HTMLInputElement).checked).toBe(false);
  });

  // ── Workers slider ─────────────────────────────────────────────────────────

  it('fires onChange with updated workers when slider changes', () => {
    const onChange = vi.fn();
    render(<SourceStepSettings settings={DEFAULT_SETTINGS} onChange={onChange} presets={[]} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_SETTINGS, workers: 7 });
  });

  it('displays current workers value next to slider', () => {
    render(
      <SourceStepSettings
        settings={{ ...DEFAULT_SETTINGS, workers: 3 }}
        onChange={() => undefined}
        presets={[]}
      />,
    );
    expect(screen.getByText('3')).toBeDefined();
  });

  // ── Auto-confirm toggle ────────────────────────────────────────────────────

  it('fires onChange with updated autoConfirm when toggle changes', () => {
    const onChange = vi.fn();
    render(<SourceStepSettings settings={DEFAULT_SETTINGS} onChange={onChange} presets={[]} />);
    // The Radix Switch renders a button role
    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_SETTINGS, autoConfirm: true });
  });

  // ── Save-as-preset inline form ─────────────────────────────────────────────

  it('does not render Save-as-preset button when onSavePreset not provided', () => {
    render(
      <SourceStepSettings settings={DEFAULT_SETTINGS} onChange={() => undefined} presets={[]} />,
    );
    expect(screen.queryByText('Save as preset…')).toBeNull();
  });

  it('renders Save-as-preset button when onSavePreset provided', () => {
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={() => undefined}
      />,
    );
    expect(screen.getByText('Save as preset…')).toBeDefined();
  });

  it('opens inline save form when Save-as-preset button is clicked', () => {
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={() => undefined}
      />,
    );
    fireEvent.click(screen.getByText('Save as preset…'));
    expect(screen.getByPlaceholderText('Preset name')).toBeDefined();
    expect(screen.getByText('Save')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });

  it('fires onSavePreset with the entered name when Save is clicked', () => {
    const onSavePreset = vi.fn();
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={onSavePreset}
      />,
    );
    fireEvent.click(screen.getByText('Save as preset…'));
    const nameInput = screen.getByPlaceholderText('Preset name');
    fireEvent.change(nameInput, { target: { value: 'My Preset' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSavePreset).toHaveBeenCalledWith('My Preset');
  });

  it('fires onSavePreset when Enter is pressed in the name input', () => {
    const onSavePreset = vi.fn();
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={onSavePreset}
      />,
    );
    fireEvent.click(screen.getByText('Save as preset…'));
    const nameInput = screen.getByPlaceholderText('Preset name');
    fireEvent.change(nameInput, { target: { value: 'Quick Preset' } });
    fireEvent.keyDown(nameInput, { key: 'Enter' });
    expect(onSavePreset).toHaveBeenCalledWith('Quick Preset');
  });

  it('closes the inline form when Cancel is clicked without firing onSavePreset', () => {
    const onSavePreset = vi.fn();
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={onSavePreset}
      />,
    );
    fireEvent.click(screen.getByText('Save as preset…'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(onSavePreset).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('Preset name')).toBeNull();
  });

  it('closes form and does not fire when Escape is pressed', () => {
    const onSavePreset = vi.fn();
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onSavePreset={onSavePreset}
      />,
    );
    fireEvent.click(screen.getByText('Save as preset…'));
    const nameInput = screen.getByPlaceholderText('Preset name');
    fireEvent.keyDown(nameInput, { key: 'Escape' });
    expect(onSavePreset).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('Preset name')).toBeNull();
  });

  // ── Re-generate button ─────────────────────────────────────────────────────

  it('does not render Re-generate button when onRegenerate not provided', () => {
    render(
      <SourceStepSettings settings={DEFAULT_SETTINGS} onChange={() => undefined} presets={[]} />,
    );
    expect(screen.queryByText('Re-generate')).toBeNull();
  });

  it('renders Re-generate button when onRegenerate provided', () => {
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText('Re-generate')).toBeDefined();
  });

  it('fires onRegenerate when Re-generate button is clicked', () => {
    const onRegenerate = vi.fn();
    render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        onRegenerate={onRegenerate}
      />,
    );
    fireEvent.click(screen.getByText('Re-generate'));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  // ── data-testid forwarding ─────────────────────────────────────────────────

  it('forwards data-testid to root section element', () => {
    const { container } = render(
      <SourceStepSettings
        settings={DEFAULT_SETTINGS}
        onChange={() => undefined}
        presets={[]}
        data-testid="my-source-settings"
      />,
    );
    expect(container.querySelector('[data-testid="my-source-settings"]')).not.toBeNull();
  });
});
