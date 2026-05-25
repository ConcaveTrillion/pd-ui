import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SourceBanner } from './SourceBanner.js';
import {
  SOURCE_BANNER,
  SOURCE_BANNER_GENERATE,
  SOURCE_BANNER_REGENERATE,
  sourceBulkActionTestId,
} from '../../testids/index.js';

// ── helpers ───────────────────────────────────────────────────────────────────

function renderBanner(props: Partial<React.ComponentProps<typeof SourceBanner>> = {}) {
  const defaults: React.ComponentProps<typeof SourceBanner> = {
    state: 'idle',
    ...props,
  };
  return render(<SourceBanner {...defaults} />);
}

// ── idle state ────────────────────────────────────────────────────────────────

describe('SourceBanner — idle state', () => {
  it('renders the Generate button', () => {
    renderBanner({ state: 'idle' });
    expect(screen.getByTestId(SOURCE_BANNER_GENERATE)).toBeInTheDocument();
    expect(screen.getByTestId(SOURCE_BANNER_GENERATE)).toHaveTextContent('Generate');
  });

  it('does not render Re-generate when onRegenerate is omitted', () => {
    renderBanner({ state: 'idle' });
    expect(screen.queryByTestId(SOURCE_BANNER_REGENERATE)).not.toBeInTheDocument();
  });

  it('renders Re-generate when onRegenerate is provided', () => {
    renderBanner({ state: 'idle', onRegenerate: () => undefined });
    expect(screen.getByTestId(SOURCE_BANNER_REGENERATE)).toBeInTheDocument();
    expect(screen.getByTestId(SOURCE_BANNER_REGENERATE)).toHaveTextContent('Re-generate');
  });

  it('sets data-state=idle on the root section', () => {
    renderBanner({ state: 'idle' });
    const section = screen.getByTestId(SOURCE_BANNER);
    expect(section).toHaveAttribute('data-state', 'idle');
  });

  it('does not render progress bar in idle state', () => {
    renderBanner({ state: 'idle' });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('does not render selection count in idle state', () => {
    renderBanner({ state: 'idle' });
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('onGenerate fires when Generate is clicked', async () => {
    const onGenerate = vi.fn();
    renderBanner({ state: 'idle', onGenerate });
    await userEvent.click(screen.getByTestId(SOURCE_BANNER_GENERATE));
    expect(onGenerate).toHaveBeenCalledOnce();
  });

  it('onRegenerate fires when Re-generate is clicked', async () => {
    const onRegenerate = vi.fn();
    renderBanner({ state: 'idle', onRegenerate });
    await userEvent.click(screen.getByTestId(SOURCE_BANNER_REGENERATE));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('no error when onGenerate is omitted and Generate is clicked', async () => {
    renderBanner({ state: 'idle' });
    await userEvent.click(screen.getByTestId(SOURCE_BANNER_GENERATE));
    // no throw
  });
});

// ── generating state ──────────────────────────────────────────────────────────

describe('SourceBanner — generating state', () => {
  it('renders a progressbar', () => {
    renderBanner({ state: 'generating', progress: 0.5 });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('progress bar aria-valuenow reflects progress prop (50%)', () => {
    renderBanner({ state: 'generating', progress: 0.5 });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('progress bar aria-valuenow at 0 when progress=0', () => {
    renderBanner({ state: 'generating', progress: 0 });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('progress bar aria-valuenow at 100 when progress=1', () => {
    renderBanner({ state: 'generating', progress: 1 });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('progress bar aria-valuenow defaults to 0 when progress is omitted', () => {
    renderBanner({ state: 'generating' });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows "X of Y" page counter when currentPage and totalPages are provided', () => {
    renderBanner({ state: 'generating', progress: 0.5, currentPage: 12, totalPages: 64 });
    expect(screen.getByText('12 of 64')).toBeInTheDocument();
  });

  it('does not render page counter when currentPage is omitted', () => {
    renderBanner({ state: 'generating', progress: 0.5, totalPages: 64 });
    expect(screen.queryByText(/of 64/)).not.toBeInTheDocument();
  });

  it('sets data-state=generating on the root section', () => {
    renderBanner({ state: 'generating' });
    const section = screen.getByTestId(SOURCE_BANNER);
    expect(section).toHaveAttribute('data-state', 'generating');
  });

  it('does not render Generate button in generating state', () => {
    renderBanner({ state: 'generating' });
    expect(screen.queryByTestId(SOURCE_BANNER_GENERATE)).not.toBeInTheDocument();
  });
});

// ── selection state ───────────────────────────────────────────────────────────

describe('SourceBanner — selection state', () => {
  it('renders selected count text', () => {
    renderBanner({ state: 'selection', selectedCount: 3 });
    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('renders 0 selected when selectedCount is omitted', () => {
    renderBanner({ state: 'selection' });
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });

  it('sets data-state=selection on the root section', () => {
    renderBanner({ state: 'selection', selectedCount: 3 });
    const section = screen.getByTestId(SOURCE_BANNER);
    expect(section).toHaveAttribute('data-state', 'selection');
  });

  it('renders all five non-danger bulk-action buttons', () => {
    renderBanner({ state: 'selection' });
    expect(screen.getByTestId(sourceBulkActionTestId('page'))).toBeInTheDocument();
    expect(screen.getByTestId(sourceBulkActionTestId('cover'))).toBeInTheDocument();
    expect(screen.getByTestId(sourceBulkActionTestId('back'))).toBeInTheDocument();
    expect(screen.getByTestId(sourceBulkActionTestId('blank'))).toBeInTheDocument();
    expect(screen.getByTestId(sourceBulkActionTestId('duplicate'))).toBeInTheDocument();
  });

  it('renders the danger Remove button', () => {
    renderBanner({ state: 'selection' });
    expect(screen.getByTestId(sourceBulkActionTestId('remove'))).toBeInTheDocument();
    expect(screen.getByTestId(sourceBulkActionTestId('remove'))).toHaveTextContent('Remove');
  });

  it('does not render Generate button in selection state', () => {
    renderBanner({ state: 'selection' });
    expect(screen.queryByTestId(SOURCE_BANNER_GENERATE)).not.toBeInTheDocument();
  });

  it('does not render progressbar in selection state', () => {
    renderBanner({ state: 'selection' });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});

// ── bulk-action callbacks ─────────────────────────────────────────────────────

describe('SourceBanner — bulk-action callbacks', () => {
  const ACTIONS = ['page', 'cover', 'back', 'blank', 'duplicate', 'remove'] as const;

  for (const action of ACTIONS) {
    it(`onBulkAction called with '${action}' when ${action} button is clicked`, async () => {
      const onBulkAction = vi.fn();
      renderBanner({ state: 'selection', onBulkAction });
      await userEvent.click(screen.getByTestId(sourceBulkActionTestId(action)));
      expect(onBulkAction).toHaveBeenCalledWith(action);
    });
  }

  it('no error when onBulkAction is omitted and a bulk button is clicked', async () => {
    renderBanner({ state: 'selection' });
    await userEvent.click(screen.getByTestId(sourceBulkActionTestId('page')));
    // no throw
  });
});

// ── data-testid forwarding ────────────────────────────────────────────────────

describe('SourceBanner — data-testid', () => {
  it('default testid is SOURCE_BANNER', () => {
    renderBanner({ state: 'idle' });
    expect(screen.getByTestId(SOURCE_BANNER)).toBeInTheDocument();
  });

  it('custom data-testid overrides the default', () => {
    renderBanner({ state: 'idle', 'data-testid': 'custom-banner' });
    expect(screen.getByTestId('custom-banner')).toBeInTheDocument();
    expect(screen.queryByTestId(SOURCE_BANNER)).not.toBeInTheDocument();
  });
});
