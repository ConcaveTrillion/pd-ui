/**
 * PWHeader — PageWorkbench header bar with breadcrumb + page nav + mode picker.
 *
 * Tests:
 *   - Renders breadcrumb labels
 *   - Page counter shows 1-indexed "p N of M"
 *   - Prev button disabled at currentIdx=0
 *   - Next button disabled at currentIdx >= total-1
 *   - Click Prev fires onPrev callback
 *   - Click Next fires onNext callback
 *   - EditModeSelector mode change fires onModeChange
 *   - actionsSlot renders
 *   - data-testid forwards to root header element
 */
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PWHeader } from './PWHeader.js';

const CRUMBS = [
  { label: 'belloc-survivals', href: '/projects/1' },
  { label: 'Pages' },
  { label: 'p012' },
];

describe('PWHeader', () => {
  it('renders breadcrumb labels', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={4}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    expect(screen.getByText('belloc-survivals')).toBeTruthy();
    expect(screen.getByText('Pages')).toBeTruthy();
    expect(screen.getByText('p012')).toBeTruthy();
  });

  it('shows 1-indexed page counter "p 5 of 24"', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={4}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    // Counter renders "p 5 of 24" (1-indexed)
    expect(screen.getByTestId('pw-header-counter').textContent).toContain('5');
    expect(screen.getByTestId('pw-header-counter').textContent).toContain('24');
  });

  it('disables Prev button when currentIdx === 0', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={0}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    const prevBtn = screen.getByTestId('pw-header-prev');
    expect((prevBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables Next button when currentIdx >= total - 1', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={23}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    const nextBtn = screen.getByTestId('pw-header-next');
    expect((nextBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables Prev when currentIdx > 0', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    const prevBtn = screen.getByTestId('pw-header-prev');
    expect((prevBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('enables Next when currentIdx < total - 1', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    const nextBtn = screen.getByTestId('pw-header-next');
    expect((nextBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('fires onPrev when Prev is clicked', async () => {
    const onPrev = vi.fn();
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        onPrev={onPrev}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    await userEvent.click(screen.getByTestId('pw-header-prev'));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('fires onNext when Next is clicked', async () => {
    const onNext = vi.fn();
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        onNext={onNext}
        mode="view"
        onModeChange={() => undefined}
      />,
    );
    await userEvent.click(screen.getByTestId('pw-header-next'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('fires onModeChange when mode segment is activated', async () => {
    const onModeChange = vi.fn();
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        mode="view"
        onModeChange={onModeChange}
      />,
    );
    // Activate the "Split" option in the segmented control
    const splitRadio = screen.getByRole('radio', { name: /split/i });
    await userEvent.click(splitRadio);
    expect(onModeChange).toHaveBeenCalledWith('split');
  });

  it('renders actionsSlot content', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        mode="view"
        onModeChange={() => undefined}
        actionsSlot={<button data-testid="custom-action">Mark reviewed</button>}
      />,
    );
    expect(screen.getByTestId('custom-action')).toBeTruthy();
  });

  it('forwards data-testid to root header element', () => {
    render(
      <PWHeader
        breadcrumb={CRUMBS}
        currentIdx={5}
        total={24}
        mode="view"
        onModeChange={() => undefined}
        data-testid="pw-header"
      />,
    );
    expect(screen.getByTestId('pw-header').tagName.toLowerCase()).toBe('header');
  });
});
