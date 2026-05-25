import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PanelToolbar } from './PanelToolbar.js';

describe('PanelToolbar', () => {
  it('renders "Never validated" when lastRun is null', () => {
    render(<PanelToolbar lastRun={null} onRevalidate={() => undefined} />);
    expect(screen.getByText('Never validated')).toBeInTheDocument();
  });

  it('renders "Never validated" when lastRun is undefined', () => {
    render(<PanelToolbar onRevalidate={() => undefined} />);
    expect(screen.getByText('Never validated')).toBeInTheDocument();
  });

  it('renders relative time when lastRun is a recent Date', () => {
    const recentDate = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    render(<PanelToolbar lastRun={recentDate} onRevalidate={() => undefined} />);
    expect(screen.getByText(/Last run/)).toBeInTheDocument();
    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
  });

  it('renders relative time when lastRun is an ISO string', () => {
    const isoString = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
    render(<PanelToolbar lastRun={isoString} onRevalidate={() => undefined} />);
    expect(screen.getByText(/Last run/)).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
  });

  it('calls onRevalidate when Re-validate button is clicked', async () => {
    const user = userEvent.setup();
    const onRevalidate = vi.fn();
    render(<PanelToolbar lastRun={null} onRevalidate={onRevalidate} />);

    await user.click(screen.getByTestId('validation-panel-toolbar-revalidate'));
    expect(onRevalidate).toHaveBeenCalledOnce();
  });

  it('renders the root testid', () => {
    render(<PanelToolbar lastRun={null} onRevalidate={() => undefined} />);
    expect(screen.getByTestId('validation-panel-toolbar')).toBeInTheDocument();
  });

  it('renders the revalidate button testid', () => {
    render(<PanelToolbar lastRun={null} onRevalidate={() => undefined} />);
    expect(screen.getByTestId('validation-panel-toolbar-revalidate')).toBeInTheDocument();
  });

  it('renders the Re-validate button label', () => {
    render(<PanelToolbar lastRun={null} onRevalidate={() => undefined} />);
    expect(screen.getByText('Re-validate')).toBeInTheDocument();
  });

  it('accepts a custom data-testid', () => {
    render(
      <PanelToolbar
        lastRun={null}
        onRevalidate={() => undefined}
        data-testid="custom-toolbar"
      />,
    );
    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
  });
});
