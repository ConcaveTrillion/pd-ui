import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StageControlsLeft } from './StageControlsLeft.js';
import type { GrayscaleParams } from './AdvancedParams.js';
import {
  STAGE_CONTROLS_PANEL,
  STAGE_CONTROLS_PANEL_REVERT,
  STAGE_CONTROLS_PANEL_SAVE,
} from '../../testids/index.js';

const BASE_PARAMS: GrayscaleParams = {
  samplerRadius: 8,
  gamma: 1.8,
  outputRange: [0, 255],
};

function renderControls(overrides: Partial<React.ComponentProps<typeof StageControlsLeft>> = {}) {
  const onModeChange = vi.fn();
  const onParamsChange = vi.fn();
  const onRevert = vi.fn();
  const onSave = vi.fn();

  const result = render(
    <StageControlsLeft
      inheritance="clean"
      backend="gpu"
      mode="standard"
      onModeChange={onModeChange}
      params={BASE_PARAMS}
      onParamsChange={onParamsChange}
      onRevert={onRevert}
      onSave={onSave}
      {...overrides}
    />,
  );

  return { ...result, onModeChange, onParamsChange, onRevert, onSave };
}

describe('StageControlsLeft', () => {
  describe('renders StageControlsPanel with given inheritance', () => {
    it('clean — data-inheritance=clean', () => {
      renderControls({ inheritance: 'clean' });
      const panel = screen.getByTestId(STAGE_CONTROLS_PANEL);
      expect(panel).toHaveAttribute('data-inheritance', 'clean');
    });

    it('modified — data-inheritance=modified', () => {
      renderControls({ inheritance: 'modified' });
      const panel = screen.getByTestId(STAGE_CONTROLS_PANEL);
      expect(panel).toHaveAttribute('data-inheritance', 'modified');
    });

    it('preset — data-inheritance=preset', () => {
      renderControls({ inheritance: 'preset', presetName: 'Newsprint' });
      const panel = screen.getByTestId(STAGE_CONTROLS_PANEL);
      expect(panel).toHaveAttribute('data-inheritance', 'preset');
    });

    it('preset — renders presetName text', () => {
      renderControls({ inheritance: 'preset', presetName: 'Newsprint' });
      expect(screen.getByText('Newsprint')).toBeInTheDocument();
    });
  });

  describe('mode change propagates', () => {
    it('clicking Perceptual mode card fires onModeChange', () => {
      const { onModeChange } = renderControls({ mode: 'standard' });
      const perceptualCard = screen.getByTestId('mode-card-perceptual');
      fireEvent.click(perceptualCard);
      expect(onModeChange).toHaveBeenCalledWith('perceptual');
    });

    it('clicking Standard mode card fires onModeChange', () => {
      const { onModeChange } = renderControls({ mode: 'perceptual' });
      const standardCard = screen.getByTestId('mode-card-standard');
      fireEvent.click(standardCard);
      expect(onModeChange).toHaveBeenCalledWith('standard');
    });

    it('current mode is reflected via aria-checked', () => {
      renderControls({ mode: 'perceptual' });
      expect(screen.getByTestId('mode-card-perceptual')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('mode-card-standard')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('params change propagates', () => {
    it('AdvancedParams renders inside the controls slot', () => {
      renderControls({ params: { samplerRadius: 8, gamma: 1.8, outputRange: [0, 255] } });
      // AdvancedParams renders an Accordion item with the "Advanced parameters" trigger
      expect(screen.getByText(/advanced/i)).toBeInTheDocument();
    });
  });

  describe('revert and save fire', () => {
    it('clicking Revert calls onRevert', () => {
      const { onRevert } = renderControls();
      fireEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT));
      expect(onRevert).toHaveBeenCalledTimes(1);
    });

    it('clicking Save as default calls onSave', () => {
      const { onSave } = renderControls();
      fireEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_SAVE));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('onRevert not called when omitted', () => {
      // Should not throw when onRevert is omitted from props
      // Render without onRevert to verify no crash on click
      render(
        <StageControlsLeft
          inheritance="clean"
          backend="gpu"
          mode="standard"
          onModeChange={vi.fn()}
          params={BASE_PARAMS}
          onParamsChange={vi.fn()}
          onSave={vi.fn()}
        />,
      );
      fireEvent.click(screen.getByTestId(STAGE_CONTROLS_PANEL_REVERT));
      // No error = pass
    });
  });

  describe('cpuFallback shows BackendChip warning', () => {
    it('cpuFallback=true renders the cpu-warning role=alert region', () => {
      renderControls({ backend: 'cpu', cpuFallback: true });
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('cpuFallback=false does not render the warning', () => {
      renderControls({ backend: 'gpu', cpuFallback: false });
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('cpuFallback omitted does not render the warning', () => {
      renderControls({ backend: 'gpu' });
      expect(screen.queryByRole('alert')).toBeNull();
    });
  });

  describe('data-testid forwards', () => {
    it('custom data-testid is applied to the outer panel', () => {
      renderControls({ 'data-testid': 'my-custom-id' });
      expect(screen.getByTestId('my-custom-id')).toBeInTheDocument();
    });

    it('default testid is STAGE_CONTROLS_PANEL when not specified', () => {
      renderControls();
      expect(screen.getByTestId(STAGE_CONTROLS_PANEL)).toBeInTheDocument();
    });
  });

  describe('modeEstimates prop', () => {
    it('accepts custom modeEstimates without error', () => {
      // Just checks it renders without throwing
      renderControls({
        modeEstimates: {
          standard: { secondsPerPage: 2, tone: 'fuzzy' },
          perceptual: { secondsPerPage: 5, tone: 'fuzzy' },
        },
      });
      expect(screen.getByTestId(STAGE_CONTROLS_PANEL)).toBeInTheDocument();
    });
  });
});
