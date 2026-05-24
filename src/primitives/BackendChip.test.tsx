import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackendChip } from './BackendChip.js';
import { BACKEND_CHIP } from '../testids/index.js';

describe('BackendChip', () => {
  it('renders GPU variant with exact tone class', () => {
    const { container } = render(<BackendChip backend="gpu" data-testid={BACKEND_CHIP} />);
    expect(screen.getByTestId(BACKEND_CHIP)).toBeInTheDocument();
    expect(container.querySelector('.badge--tone-exact')).not.toBeNull();
  });

  it('renders GPU label text', () => {
    render(<BackendChip backend="gpu" />);
    expect(screen.getByText('GPU · CUDA')).toBeInTheDocument();
  });

  it('renders CPU variant with fuzzy tone class', () => {
    const { container } = render(<BackendChip backend="cpu" data-testid={BACKEND_CHIP} />);
    expect(container.querySelector('.badge--tone-fuzzy')).not.toBeNull();
  });

  it('renders CPU label text', () => {
    render(<BackendChip backend="cpu" />);
    expect(screen.getByText('CPU · numpy')).toBeInTheDocument();
  });

  it('renders auto variant with neutral tone class', () => {
    const { container } = render(<BackendChip backend="auto" data-testid={BACKEND_CHIP} />);
    // neutral tone does not add a tone modifier class — badge base styling applies
    expect(container.querySelector('.badge')).not.toBeNull();
    expect(container.querySelector('.badge--tone-exact')).toBeNull();
    expect(container.querySelector('.badge--tone-fuzzy')).toBeNull();
  });

  it('renders auto label text', () => {
    render(<BackendChip backend="auto" />);
    expect(screen.getByText('auto')).toBeInTheDocument();
  });

  it('applies data-testid attribute', () => {
    render(<BackendChip backend="gpu" data-testid={BACKEND_CHIP} />);
    expect(screen.getByTestId(BACKEND_CHIP)).toBeInTheDocument();
  });

  it('sets data-backend attribute matching the backend prop', () => {
    render(<BackendChip backend="gpu" data-testid={BACKEND_CHIP} />);
    expect(screen.getByTestId(BACKEND_CHIP)).toHaveAttribute('data-backend', 'gpu');
  });

  describe('fallback prop', () => {
    it('appends fallback marker when fallback=true and backend=cpu', () => {
      render(<BackendChip backend="cpu" fallback />);
      expect(screen.getByText('CPU · numpy ↓')).toBeInTheDocument();
    });

    it('sets data-fallback attribute when fallback=true and backend=cpu', () => {
      render(<BackendChip backend="cpu" fallback data-testid={BACKEND_CHIP} />);
      expect(screen.getByTestId(BACKEND_CHIP)).toHaveAttribute('data-fallback', 'true');
    });

    it('does not show fallback marker when fallback=true but backend=gpu', () => {
      render(<BackendChip backend="gpu" fallback />);
      // GPU label unchanged
      expect(screen.getByText('GPU · CUDA')).toBeInTheDocument();
      expect(screen.queryByText(/↓/)).toBeNull();
    });

    it('does not set data-fallback when backend is not cpu', () => {
      render(<BackendChip backend="gpu" fallback data-testid={BACKEND_CHIP} />);
      expect(screen.getByTestId(BACKEND_CHIP)).not.toHaveAttribute('data-fallback');
    });

    it('renders dot element for all variants', () => {
      const { container } = render(<BackendChip backend="cpu" fallback />);
      expect(container.querySelector('.badge__dot')).not.toBeNull();
    });
  });
});
