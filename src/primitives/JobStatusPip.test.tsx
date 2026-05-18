import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { JobStatusPip } from './JobStatusPip.js';

describe('JobStatusPip', () => {
  it('renders with done state — correct testid, .pip class, green token', () => {
    render(<JobStatusPip state="done" />);
    const el = screen.getByTestId('job-status-pip-done');
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

  it('renders with error state — red token var(--mismatch)', () => {
    render(<JobStatusPip state="error" />);
    const el = screen.getByTestId('job-status-pip-error');
    expect(el.style.color).toBe('var(--mismatch)');
  });

  it('custom label prop overrides default state text', () => {
    render(<JobStatusPip state="done" label="Finished" />);
    expect(screen.getByText('Finished')).toBeTruthy();
    expect(screen.queryByText('done')).toBeNull();
  });

  it('omitting label renders the state string as the label', () => {
    render(<JobStatusPip state="queued" />);
    expect(screen.getByText('queued')).toBeTruthy();
  });

  it('additional className is merged', () => {
    render(<JobStatusPip state="done" className="custom-cls" />);
    const el = screen.getByTestId('job-status-pip-done');
    expect(el.classList.contains('pip')).toBe(true);
    expect(el.classList.contains('custom-cls')).toBe(true);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<JobStatusPip state="running" ref={ref} />);
    expect(ref.current?.classList.contains('pip')).toBe(true);
  });
});
