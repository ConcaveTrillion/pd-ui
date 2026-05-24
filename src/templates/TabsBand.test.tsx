import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabsBand } from './TabsBand.js';

const ITEMS = [
  { id: 'overview', name: 'Overview' },
  { id: 'pages', name: 'Pages', count: 47 },
  { id: 'settings', name: 'Settings' },
];

describe('TabsBand', () => {
  it('renders all tab labels', () => {
    render(<TabsBand items={ITEMS} current="overview" />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks the current tab active with aria-selected and active class', () => {
    render(<TabsBand items={ITEMS} current="pages" />);
    const pagesBtn = screen.getByRole('tab', { name: /pages/i });
    expect(pagesBtn).toHaveAttribute('aria-selected', 'true');
    expect(pagesBtn).toHaveClass('tabs-band__tab--active');
  });

  it('non-current tabs do not have active class', () => {
    render(<TabsBand items={ITEMS} current="overview" />);
    const pagesBtn = screen.getByRole('tab', { name: /pages/i });
    expect(pagesBtn).not.toHaveClass('tabs-band__tab--active');
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<TabsBand items={ITEMS} current="overview" onTabChange={spy} />);
    await user.click(screen.getByRole('tab', { name: /settings/i }));
    expect(spy).toHaveBeenCalledWith('settings');
  });

  it('renders count badge when item has count', () => {
    render(<TabsBand items={ITEMS} current="overview" />);
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('does not render count badge when count is absent', () => {
    render(<TabsBand items={ITEMS} current="overview" />);
    // Only "pages" has count; overview and settings do not have a count element next to them
    const overviewTab = screen.getByRole('tab', { name: /^overview$/i });
    expect(overviewTab.querySelector('.tabs-band__count')).toBeNull();
  });

  it('adds sticky class when sticky prop is true', () => {
    const { container } = render(
      <TabsBand items={ITEMS} current="overview" sticky />,
    );
    // The root element should have the sticky class
    const root = container.firstElementChild;
    expect(root).toHaveClass('tabs-band--sticky');
  });

  it('does not add sticky class by default', () => {
    const { container } = render(<TabsBand items={ITEMS} current="overview" />);
    const root = container.firstElementChild;
    expect(root).not.toHaveClass('tabs-band--sticky');
  });

  it('renders rightSlot content', () => {
    render(
      <TabsBand
        items={ITEMS}
        current="overview"
        rightSlot={<button type="button">Filter</button>}
      />,
    );
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('renders icon when item has icon', () => {
    const itemsWithIcon = [
      { id: 'pages', name: 'Pages', icon: <svg data-testid="page-icon" aria-hidden="true" /> },
    ];
    render(<TabsBand items={itemsWithIcon} current="pages" />);
    expect(screen.getByTestId('page-icon')).toBeInTheDocument();
  });

  it('uses tablist role on root element', () => {
    render(<TabsBand items={ITEMS} current="overview" />);
    // The tab list wrapper should have role="tablist"
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
