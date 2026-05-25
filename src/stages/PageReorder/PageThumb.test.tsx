/**
 * PageThumb — Vitest unit tests.
 *
 * Coverage:
 *   - Renders both page numbers (numeric and string)
 *   - Renders img elements with correct alt text when thumbnailUrl is provided
 *   - Renders placeholder divs when thumbnailUrl is absent
 *   - Applies REORDER_PAGE_THUMB testid by default
 *   - Accepts a custom data-testid override
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageThumb } from './PageThumb.js';
import { REORDER_PAGE_THUMB } from '../../testids/index.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const noImages = {
  pageA: { id: 'page-5', number: 5 },
  pageB: { id: 'page-6', number: 6 },
};

const withImages = {
  pageA: { id: 'page-5', number: 5, thumbnailUrl: 'https://example.com/5.png' },
  pageB: { id: 'page-6', number: 6, thumbnailUrl: 'https://example.com/6.png' },
};

// ─── Page numbers ─────────────────────────────────────────────────────────────

describe('PageThumb — page numbers', () => {
  it('renders both numeric page numbers', () => {
    render(<PageThumb {...noImages} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('renders string page numbers', () => {
    render(
      <PageThumb
        pageA={{ id: 'page-front', number: 'front' }}
        pageB={{ id: 'page-back', number: 'back' }}
      />,
    );
    expect(screen.getByText('front')).toBeInTheDocument();
    expect(screen.getByText('back')).toBeInTheDocument();
  });
});

// ─── Image rendering ──────────────────────────────────────────────────────────

describe('PageThumb — image rendering', () => {
  it('renders img elements with alt text when thumbnailUrl is provided', () => {
    render(<PageThumb {...withImages} />);
    expect(screen.getByAltText('Page 5')).toBeInTheDocument();
    expect(screen.getByAltText('Page 6')).toBeInTheDocument();
  });

  it('does not render img elements when thumbnailUrl is absent', () => {
    render(<PageThumb {...noImages} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

// ─── testids ──────────────────────────────────────────────────────────────────

describe('PageThumb — testids', () => {
  it('applies REORDER_PAGE_THUMB testid to root by default', () => {
    render(<PageThumb {...noImages} />);
    expect(screen.getByTestId(REORDER_PAGE_THUMB)).toBeInTheDocument();
  });

  it('accepts a custom data-testid override', () => {
    render(<PageThumb {...noImages} data-testid="custom-thumb" />);
    expect(screen.getByTestId('custom-thumb')).toBeInTheDocument();
    expect(screen.queryByTestId(REORDER_PAGE_THUMB)).not.toBeInTheDocument();
  });
});
