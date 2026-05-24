/**
 * JobsDrawer tests — covering #354.
 *
 * Tests the full three-mode surface (expanded / collapsed / dismissed)
 * plus toast/tombstone cards and callback wiring.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JobsDrawer } from './JobsDrawer.js';
import type { Job } from './JobRow.js';
import type { JobToast } from './JobsDrawer.js';

// ─── Factories ─────────────────────────────────────────────────────────────────

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 'job-1',
    project: 'My Book',
    phase: 'OCR — page 12 of 40',
    pct: 30,
    status: 'running',
    cancelable: true,
    ...overrides,
  };
}

function makeToast(overrides: Partial<JobToast> = {}): JobToast {
  return {
    id: 'toast-1',
    project: 'Finished Book',
    message: 'Completed successfully',
    ...overrides,
  };
}

// ─── Render helpers ────────────────────────────────────────────────────────────

describe('JobsDrawer (#354)', () => {
  // ─── dismissed mode ──────────────────────────────────────────────────────────

  it('renders nothing when mode=dismissed, no jobs, no toasts', () => {
    const { container } = render(
      <JobsDrawer activeJobs={[]} toasts={[]} mode="dismissed" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('still renders toasts even when mode=dismissed', () => {
    render(
      <JobsDrawer
        activeJobs={[]}
        toasts={[makeToast()]}
        mode="dismissed"
      />,
    );
    expect(screen.getByTestId('jobs-drawer-toast')).toBeTruthy();
  });

  // ─── expanded mode ────────────────────────────────────────────────────────────

  it('renders the drawer in expanded mode with jobs', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByTestId('jobs-drawer')).toBeTruthy();
  });

  it('renders JobRow for each active job in expanded mode', () => {
    const jobs = [makeJob({ id: 'a' }), makeJob({ id: 'b', project: 'Second Book' })];
    render(<JobsDrawer activeJobs={jobs} mode="expanded" />);
    // JobRow renders data-testid="job-row" per the JobRow contract
    const rows = screen.getAllByTestId('job-row');
    expect(rows).toHaveLength(2);
  });

  it('shows "Jobs" title in the header', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByText('Jobs')).toBeTruthy();
  });

  it('shows summary with running count when running jobs exist', () => {
    render(
      <JobsDrawer
        activeJobs={[makeJob({ status: 'running' }), makeJob({ id: 'b', status: 'done' })]}
        mode="expanded"
      />,
    );
    expect(screen.getByTestId('jobs-drawer-summary').textContent).toMatch(/1 running/);
    expect(screen.getByTestId('jobs-drawer-summary').textContent).toMatch(/1 done/);
  });

  it('does not render drawer body when no active jobs in expanded mode', () => {
    render(<JobsDrawer activeJobs={[]} mode="expanded" />);
    // The outer wrapper renders (for toasts), but the drawer body is absent
    expect(screen.queryByTestId('jobs-drawer-header')).toBeNull();
    expect(screen.queryByText('View all jobs')).toBeNull();
  });

  it('renders Collapse button in expanded mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByRole('button', { name: /collapse/i })).toBeTruthy();
  });

  it('renders Dismiss button in expanded mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByRole('button', { name: /dismiss drawer/i })).toBeTruthy();
  });

  it('renders resize handle in expanded mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByLabelText('Resize drawer')).toBeTruthy();
  });

  it('renders "View all jobs" footer in expanded mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByText('View all jobs')).toBeTruthy();
  });

  // ─── collapsed mode ───────────────────────────────────────────────────────────

  it('does NOT render resize handle in collapsed mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="collapsed" />);
    expect(screen.queryByLabelText('Resize drawer')).toBeNull();
  });

  it('renders Expand button in collapsed mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="collapsed" />);
    expect(screen.getByRole('button', { name: /expand/i })).toBeTruthy();
  });

  it('shows mini progress bar for single running job in collapsed mode', () => {
    render(
      <JobsDrawer
        activeJobs={[makeJob({ status: 'running', pct: 55 })]}
        mode="collapsed"
      />,
    );
    expect(screen.getByTestId('jobs-drawer-collapsed-progress')).toBeTruthy();
  });

  it('does NOT show mini progress bar when multiple running jobs in collapsed mode', () => {
    render(
      <JobsDrawer
        activeJobs={[
          makeJob({ id: 'a', status: 'running' }),
          makeJob({ id: 'b', status: 'running' }),
        ]}
        mode="collapsed"
      />,
    );
    expect(screen.queryByTestId('jobs-drawer-collapsed-progress')).toBeNull();
  });

  it('does not render job list in collapsed mode', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="collapsed" />);
    expect(screen.queryByTestId('job-row')).toBeNull();
    expect(screen.queryByText('View all jobs')).toBeNull();
  });

  // ─── toasts ───────────────────────────────────────────────────────────────────

  it('renders tombstone toasts', () => {
    render(
      <JobsDrawer
        activeJobs={[]}
        toasts={[makeToast(), makeToast({ id: 'toast-2', project: 'Other Book' })]}
        mode="expanded"
      />,
    );
    const toasts = screen.getAllByTestId('jobs-drawer-toast');
    expect(toasts).toHaveLength(2);
  });

  it('renders toast project name and message', () => {
    render(
      <JobsDrawer
        activeJobs={[]}
        toasts={[makeToast({ project: 'My Toast Book', message: 'All done!' })]}
        mode="expanded"
      />,
    );
    expect(screen.getByText('My Toast Book')).toBeTruthy();
    expect(screen.getByText('All done!')).toBeTruthy();
  });

  it('renders toast Open button', () => {
    render(
      <JobsDrawer activeJobs={[]} toasts={[makeToast()]} mode="expanded" />,
    );
    expect(screen.getByRole('button', { name: /^open$/i })).toBeTruthy();
  });

  it('renders toast Dismiss button', () => {
    render(
      <JobsDrawer activeJobs={[]} toasts={[makeToast()]} mode="expanded" />,
    );
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeTruthy();
  });

  it('calls onToastOpen with toast id when toast Open clicked', () => {
    const onToastOpen = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[]}
        toasts={[makeToast({ id: 'toast-42' })]}
        mode="expanded"
        onToastOpen={onToastOpen}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^open$/i }));
    expect(onToastOpen).toHaveBeenCalledTimes(1);
    expect(onToastOpen).toHaveBeenCalledWith('toast-42');
  });

  it('calls onToastDismiss with toast id when toast Dismiss clicked', () => {
    const onToastDismiss = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[]}
        toasts={[makeToast({ id: 'toast-42' })]}
        mode="expanded"
        onToastDismiss={onToastDismiss}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onToastDismiss).toHaveBeenCalledTimes(1);
    expect(onToastDismiss).toHaveBeenCalledWith('toast-42');
  });

  // ─── callbacks ────────────────────────────────────────────────────────────────

  it('calls onToggleMode when Collapse button clicked', () => {
    const onToggleMode = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[makeJob()]}
        mode="expanded"
        onToggleMode={onToggleMode}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }));
    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleMode when Expand button clicked', () => {
    const onToggleMode = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[makeJob()]}
        mode="collapsed"
        onToggleMode={onToggleMode}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when Dismiss drawer button clicked', () => {
    const onDismiss = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[makeJob()]}
        mode="expanded"
        onDismiss={onDismiss}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /dismiss drawer/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onViewAll when "View all jobs" footer clicked', () => {
    const onViewAll = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[makeJob()]}
        mode="expanded"
        onViewAll={onViewAll}
      />,
    );
    fireEvent.click(screen.getByText('View all jobs'));
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('passes onOpen, onPauseResume, onCancel through to JobRow', () => {
    const onOpen = vi.fn();
    render(
      <JobsDrawer
        activeJobs={[makeJob({ status: 'succeeded', pct: 100 })]}
        mode="expanded"
        onJobOpen={onOpen}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(onOpen).toHaveBeenCalledWith('job-1');
  });

  // ─── testid presence ─────────────────────────────────────────────────────────

  it('has data-testid="jobs-drawer" on the root element', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByTestId('jobs-drawer')).toBeTruthy();
  });

  it('has data-testid="jobs-drawer-header" on the header', () => {
    render(<JobsDrawer activeJobs={[makeJob()]} mode="expanded" />);
    expect(screen.getByTestId('jobs-drawer-header')).toBeTruthy();
  });
});
