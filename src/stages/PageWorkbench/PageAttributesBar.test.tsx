/**
 * PageAttributesBar unit tests.
 *
 * Tests:
 *   - Renders each attr label+value
 *   - Expand/collapse toggles
 *   - Clicking a chip opens its popover
 *   - Editing + Apply fires onChange(id, nextValue)
 *   - Cancel does NOT call onChange
 *   - readOnly chip doesn't open popover
 *   - Number editor renders input[type=number]
 *   - Select editor renders <select> with options
 *   - data-testid forwards to outer wrapper
 *   - Empty attrs renders only toggle
 *
 * Notes:
 *   - Radix Popover in jsdom produces act() warnings for position updates —
 *     these are harmless and expected.
 *   - userEvent.setup() + findBy* for async popover open.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { PageAttributesBar } from './PageAttributesBar.js';
import type { PageAttribute } from './PageAttributesBar.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const ATTRS: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '2.5' },
  { id: 'dpi', label: 'DPI', value: '300', editor: 'number' },
  { id: 'lang', label: 'Lang', value: 'en', editor: 'select', options: [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
  ]},
  { id: 'source', label: 'Source', value: 'scan', readOnly: true },
];

function setup(props?: Partial<React.ComponentProps<typeof PageAttributesBar>>) {
  const onChange = vi.fn();
  const utils = render(
    <PageAttributesBar
      attrs={ATTRS}
      onChange={onChange}
      {...props}
    />,
  );
  return { onChange, ...utils };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PageAttributesBar', () => {
  it('renders each attr label and value when expanded', () => {
    setup();
    expect(screen.getByText('Skew')).toBeTruthy();
    expect(screen.getByText('2.5')).toBeTruthy();
    expect(screen.getByText('DPI')).toBeTruthy();
    expect(screen.getByText('300')).toBeTruthy();
    expect(screen.getByText('Lang')).toBeTruthy();
    expect(screen.getByText('en')).toBeTruthy();
    expect(screen.getByText('Source')).toBeTruthy();
    expect(screen.getByText('scan')).toBeTruthy();
  });

  it('applies data-testid to outer wrapper', () => {
    const { container } = render(
      <PageAttributesBar
        attrs={[]}
        onChange={vi.fn()}
        data-testid="custom-bar"
      />,
    );
    expect(container.querySelector('[data-testid="custom-bar"]')).toBeTruthy();
  });

  it('uses default data-testid page-attributes-bar', () => {
    const { container } = render(
      <PageAttributesBar attrs={[]} onChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-testid="page-attributes-bar"]')).toBeTruthy();
  });

  it('renders toggle with data-testid page-attributes-bar-toggle', () => {
    setup();
    expect(screen.getByTestId('page-attributes-bar-toggle')).toBeTruthy();
  });

  it('chips have per-attr testids via pageAttrChipTestId pattern', () => {
    setup();
    expect(screen.getByTestId('page-attr-chip-skew')).toBeTruthy();
    expect(screen.getByTestId('page-attr-chip-dpi')).toBeTruthy();
    expect(screen.getByTestId('page-attr-chip-lang')).toBeTruthy();
  });

  it('collapses when defaultCollapsed=true, shows count pill', () => {
    setup({ defaultCollapsed: true });
    // Chips should not be present
    expect(screen.queryByTestId('page-attr-chip-skew')).toBeNull();
    // Count label should be visible
    expect(screen.getByText(`Attributes (${ATTRS.length})`)).toBeTruthy();
  });

  it('expand/collapse toggles chip visibility', async () => {
    const user = userEvent.setup();
    setup({ defaultCollapsed: true });

    const toggle = screen.getByTestId('page-attributes-bar-toggle');
    // Initially collapsed — no chips
    expect(screen.queryByTestId('page-attr-chip-skew')).toBeNull();

    // Expand
    await user.click(toggle);
    expect(screen.getByTestId('page-attr-chip-skew')).toBeTruthy();

    // Collapse
    await user.click(toggle);
    expect(screen.queryByTestId('page-attr-chip-skew')).toBeNull();
  });

  it('clicking a chip opens popover with Apply/Cancel buttons', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('page-attr-chip-skew'));

    const applyBtn = await screen.findByRole('button', { name: /apply edit/i });
    const cancelBtn = await screen.findByRole('button', { name: /cancel edit/i });
    expect(applyBtn).toBeTruthy();
    expect(cancelBtn).toBeTruthy();
  });

  it('Apply fires onChange with the new value', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByTestId('page-attr-chip-skew'));
    const input = await screen.findByRole('textbox', { name: /edit skew/i });

    // Clear and type new value
    await user.clear(input);
    await user.type(input, '5.0');

    await user.click(await screen.findByRole('button', { name: /apply edit/i }));

    expect(onChange).toHaveBeenCalledWith('skew', '5.0');
  });

  it('Cancel does NOT call onChange', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByTestId('page-attr-chip-skew'));
    const input = await screen.findByRole('textbox', { name: /edit skew/i });

    await user.clear(input);
    await user.type(input, 'ignored');

    await user.click(await screen.findByRole('button', { name: /cancel edit/i }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Escape key closes popover without calling onChange', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByTestId('page-attr-chip-skew'));
    const input = await screen.findByRole('textbox', { name: /edit skew/i });

    await user.type(input, 'ignored{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /apply edit/i })).toBeNull();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('readOnly chip does not open popover when clicked', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('page-attr-chip-source'));

    // Popover should NOT appear
    expect(screen.queryByRole('button', { name: /apply edit/i })).toBeNull();
  });

  it('number editor renders input[type=number]', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('page-attr-chip-dpi'));

    const input = await screen.findByRole('spinbutton', { name: /edit dpi/i });
    expect(input).toBeTruthy();
    expect((input as HTMLInputElement).type).toBe('number');
  });

  it('select editor renders <select> with options', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('page-attr-chip-lang'));

    const select = await screen.findByRole('combobox', { name: /edit lang/i });
    expect(select).toBeTruthy();

    const options = (select as HTMLSelectElement).options;
    expect(options[0]?.text).toBe('English');
    expect(options[1]?.text).toBe('French');
  });

  it('select editor Apply fires onChange with selected value', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByTestId('page-attr-chip-lang'));

    const select = await screen.findByRole('combobox', { name: /edit lang/i });
    await user.selectOptions(select, 'fr');

    await user.click(await screen.findByRole('button', { name: /apply edit/i }));

    expect(onChange).toHaveBeenCalledWith('lang', 'fr');
  });

  it('renders empty state with only toggle button', () => {
    render(<PageAttributesBar attrs={[]} onChange={vi.fn()} />);
    expect(screen.getByTestId('page-attributes-bar-toggle')).toBeTruthy();
    // No chip list when no attrs
    expect(screen.queryByRole('list')).toBeNull();
  });
});
