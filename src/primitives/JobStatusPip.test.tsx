import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { JobStatusPip } from './JobStatusPip.js';

describe('JobStatusPip', () => {
  it('renders with succeeded state — correct testid, .pip class, green token', () => {
    render(<JobStatusPip state="succeeded" />);
    const el = screen.getByTestId('job-status-pip-succeeded');
    expect(el.classList.contains('pip')).toBe(true);
    expect(el.style.color).toBe('var(--exact)');
  });

  it('renders with running state — has pip--running class', () => {
    render(<JobStatusPip state="running" />);
    const el = screen.getByTestId('job-status-pip-running');
    expect(el.classList.contains('pip--running')).toBe(true);
  });

  it('renders with queued state — gray token var(--ink-3)', () => {
    render(<JobStatusPip state="queued" />);
    const el = screen.getByTestId('job-status-pip-queued');
    expect(el.style.color).toBe('var(--ink-3)');
  });

  it('renders with failed state — red token var(--mismatch)', () => {
    render(<JobStatusPip state="failed" />);
    const el = screen.getByTestId('job-status-pip-failed');
    expect(el.style.color).toBe('var(--mismatch)');
  });

  it('renders with cancelled state — fuzzy token var(--fuzzy)', () => {
    render(<JobStatusPip state="cancelled" />);
    const el = screen.getByTestId('job-status-pip-cancelled');
    expect(el.style.color).toBe('var(--fuzzy)');
  });

  it('custom label prop overrides default state text', () => {
    render(<JobStatusPip state="succeeded" label="Finished" />);
    expect(screen.getByText('Finished')).toBeTruthy();
    expect(screen.queryByText('succeeded')).toBeNull();
  });

  it('omitting label renders the state string as the label', () => {
    render(<JobStatusPip state="queued" />);
    expect(screen.getByText('queued')).toBeTruthy();
  });

  it('additional className is merged', () => {
    render(<JobStatusPip state="succeeded" className="custom-cls" />);
    const el = screen.getByTestId('job-status-pip-succeeded');
    expect(el.classList.contains('pip')).toBe(true);
    expect(el.classList.contains('custom-cls')).toBe(true);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<JobStatusPip state="running" ref={ref} />);
    expect(ref.current?.classList.contains('pip')).toBe(true);
  });
});
