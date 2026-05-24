import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DiskCostBanner } from './DiskCostBanner.js';

describe('DiskCostBanner', () => {
  it('renders the size text', () => {
    render(<DiskCostBanner size="1.84 GB" />);
    expect(screen.getByText('1.84 GB')).toBeTruthy();
  });

  it('renders "Stage artifacts:" prefix label', () => {
    render(<DiskCostBanner size="500 MB" />);
    expect(screen.getByText(/Stage artifacts/)).toBeTruthy();
  });

  it('renders prune action when onPrune provided', () => {
    render(<DiskCostBanner size="1 GB" onPrune={() => {}} />);
    expect(screen.getByRole('button', { name: /prune/i })).toBeTruthy();
  });

  it('omits prune button when onPrune not provided', () => {
    render(<DiskCostBanner size="1 GB" />);
    expect(screen.queryByRole('button', { name: /prune/i })).toBeNull();
  });

  it('calls onPrune when prune button clicked', () => {
    const onPrune = vi.fn();
    render(<DiskCostBanner size="1 GB" onPrune={onPrune} />);
    fireEvent.click(screen.getByRole('button', { name: /prune/i }));
    expect(onPrune).toHaveBeenCalledTimes(1);
  });

  it('forwards className', () => {
    const { container } = render(<DiskCostBanner size="1 GB" className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
