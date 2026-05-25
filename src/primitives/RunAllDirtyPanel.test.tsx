import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RunAllDirtyPanel } from './RunAllDirtyPanel.js';

describe('RunAllDirtyPanel', () => {
  it('renders the dirty count', () => {
    render(<RunAllDirtyPanel dirtyCount={5} onRunAll={() => {}} />);
    expect(screen.getByText(/5/)).toBeTruthy();
  });

  it('renders "Run All" button', () => {
    render(<RunAllDirtyPanel dirtyCount={3} onRunAll={() => {}} />);
    expect(screen.getByRole('button', { name: /run all/i })).toBeTruthy();
  });

  it('calls onRunAll when button clicked', () => {
    const onRunAll = vi.fn();
    render(<RunAllDirtyPanel dirtyCount={3} onRunAll={onRunAll} />);
    fireEvent.click(screen.getByRole('button', { name: /run all/i }));
    expect(onRunAll).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<RunAllDirtyPanel dirtyCount={3} onRunAll={() => {}} disabled />);
    const btn = screen.getByRole('button', { name: /run all/i });
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('disables button when running prop is true', () => {
    render(<RunAllDirtyPanel dirtyCount={3} onRunAll={() => {}} running />);
    const btn = screen.getByRole('button', { name: /running/i });
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('renders with run-all-dirty-panel class', () => {
    const { container } = render(<RunAllDirtyPanel dirtyCount={0} onRunAll={() => {}} />);
    expect(container.querySelector('.run-all-dirty-panel')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(
      <RunAllDirtyPanel dirtyCount={0} onRunAll={() => {}} className="custom" />,
    );
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('renders zero dirty count without error', () => {
    render(<RunAllDirtyPanel dirtyCount={0} onRunAll={() => {}} />);
    expect(screen.getByText(/0/)).toBeTruthy();
  });
});
