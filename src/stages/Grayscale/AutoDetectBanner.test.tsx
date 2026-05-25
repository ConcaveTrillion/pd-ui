import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AutoDetectBanner } from './AutoDetectBanner.js';
import { AUTO_DETECT_BANNER, AUTO_DETECT_BANNER_REDETECT } from '../../testids/index.js';

// ── helpers ───────────────────────────────────────────────────────────────────

function renderBanner(props: Partial<React.ComponentProps<typeof AutoDetectBanner>> = {}) {
  const defaults: React.ComponentProps<typeof AutoDetectBanner> = {
    mode: 'standard',
    estimatedSecondsPerPage: 2,
    ...props,
  };
  return render(<AutoDetectBanner {...defaults} />);
}

// ── mode rendering ────────────────────────────────────────────────────────────

describe('AutoDetectBanner — mode rendering', () => {
  it('renders "standard" mode in headline', () => {
    renderBanner({ mode: 'standard' });
    expect(screen.getByText('standard')).toBeInTheDocument();
  });

  it('renders "perceptual" mode in headline', () => {
    renderBanner({ mode: 'perceptual' });
    expect(screen.getByText('perceptual')).toBeInTheDocument();
  });

  it('renders the headline with "Auto-detected:" prefix', () => {
    renderBanner({ mode: 'standard' });
    expect(screen.getByText(/Auto-detected:/)).toBeInTheDocument();
  });

  it('root element is an aside with correct testid', () => {
    renderBanner();
    const aside = screen.getByTestId(AUTO_DETECT_BANNER);
    expect(aside.tagName.toLowerCase()).toBe('aside');
  });
});

// ── profile chip ──────────────────────────────────────────────────────────────

describe('AutoDetectBanner — profile chip', () => {
  it('does not render chip when profile is omitted', () => {
    renderBanner({ mode: 'standard' });
    expect(screen.queryByTestId('auto-detect-banner-profile')).not.toBeInTheDocument();
  });

  it('renders chip with profile text when profile is provided', () => {
    renderBanner({ mode: 'standard', profile: 'text-heavy' });
    const chip = screen.getByTestId('auto-detect-banner-profile');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent('text-heavy');
  });

  it('renders chip with "art-heavy" profile', () => {
    renderBanner({ mode: 'perceptual', profile: 'art-heavy' });
    expect(screen.getByTestId('auto-detect-banner-profile')).toHaveTextContent('art-heavy');
  });

  it('renders chip with "mixed" profile', () => {
    renderBanner({ mode: 'standard', profile: 'mixed' });
    expect(screen.getByTestId('auto-detect-banner-profile')).toHaveTextContent('mixed');
  });
});

// ── time text ─────────────────────────────────────────────────────────────────

describe('AutoDetectBanner — estimated time', () => {
  it('renders estimated seconds per page as subtext', () => {
    renderBanner({ estimatedSecondsPerPage: 3 });
    expect(screen.getByText('~3s/page')).toBeInTheDocument();
  });

  it('renders zero seconds correctly', () => {
    renderBanner({ estimatedSecondsPerPage: 0 });
    expect(screen.getByText('~0s/page')).toBeInTheDocument();
  });

  it('renders large value correctly', () => {
    renderBanner({ estimatedSecondsPerPage: 120 });
    expect(screen.getByText('~120s/page')).toBeInTheDocument();
  });
});

// ── Re-detect button ──────────────────────────────────────────────────────────

describe('AutoDetectBanner — onRedetect', () => {
  it('does not render Re-detect button when onRedetect is omitted', () => {
    renderBanner();
    expect(screen.queryByTestId(AUTO_DETECT_BANNER_REDETECT)).not.toBeInTheDocument();
  });

  it('renders Re-detect button when onRedetect is provided', () => {
    renderBanner({ onRedetect: vi.fn() });
    expect(screen.getByTestId(AUTO_DETECT_BANNER_REDETECT)).toBeInTheDocument();
    expect(screen.getByTestId(AUTO_DETECT_BANNER_REDETECT)).toHaveTextContent('Re-detect');
  });

  it('calls onRedetect when Re-detect is clicked', async () => {
    const user = userEvent.setup();
    const onRedetect = vi.fn();
    renderBanner({ onRedetect });
    await user.click(screen.getByTestId(AUTO_DETECT_BANNER_REDETECT));
    expect(onRedetect).toHaveBeenCalledTimes(1);
  });
});

// ── data-testid forwarding ────────────────────────────────────────────────────

describe('AutoDetectBanner — data-testid forwarding', () => {
  it('uses the default AUTO_DETECT_BANNER testid', () => {
    renderBanner();
    expect(screen.getByTestId(AUTO_DETECT_BANNER)).toBeInTheDocument();
  });

  it('forwards a custom data-testid to the root aside', () => {
    renderBanner({ 'data-testid': 'my-banner' });
    expect(screen.getByTestId('my-banner')).toBeInTheDocument();
    expect(screen.queryByTestId(AUTO_DETECT_BANNER)).not.toBeInTheDocument();
  });
});
