/**
 * PageAttributesPanel unit tests.
 *
 * Tests:
 *   - Renders title
 *   - Renders each attr's label
 *   - Text input commit (blur) fires onChange(id, value)
 *   - Pressing Enter inside text input commits
 *   - Number input commit (blur) fires onChange(id, value)
 *   - Select editor commits onChange on select change
 *   - readOnly attr does not render an editor
 *   - data-testid forwards to outer wrapper
 *   - Row testids follow pageAttrPanelRowTestId pattern
 *   - Empty attrs renders empty state
 *   - Custom title renders
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { PageAttributesPanel } from './PageAttributesPanel.js';
import type { PageAttribute } from './PageAttributesBar.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const ATTRS: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '2.5' },
  { id: 'dpi', label: 'DPI', value: '300', editor: 'number' },
  {
    id: 'lang',
    label: 'Lang',
    value: 'en',
    editor: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
    ],
  },
  { id: 'source', label: 'Source', value: 'scan', readOnly: true },
];

function setup(props?: Partial<React.ComponentProps<typeof PageAttributesPanel>>) {
  const onChange = vi.fn();
  const utils = render(
    <PageAttributesPanel attrs={ATTRS} onChange={onChange} {...props} />,
  );
  return { onChange, ...utils };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PageAttributesPanel', () => {
  it('renders default title "Page attributes"', () => {
    setup();
    expect(screen.getByText('Page attributes')).toBeTruthy();
  });

  it('renders custom title', () => {
    setup({ title: 'My custom title' });
    expect(screen.getByText('My custom title')).toBeTruthy();
  });

  it('renders each attr label', () => {
    setup();
    expect(screen.getByText('Skew')).toBeTruthy();
    expect(screen.getByText('DPI')).toBeTruthy();
    expect(screen.getByText('Lang')).toBeTruthy();
    expect(screen.getByText('Source')).toBeTruthy();
  });

  it('applies data-testid to outer aside wrapper', () => {
    const { container } = render(
      <PageAttributesPanel attrs={[]} onChange={vi.fn()} data-testid="custom-panel" />,
    );
    expect(container.querySelector('[data-testid="custom-panel"]')).toBeTruthy();
  });

  it('uses default data-testid page-attributes-panel', () => {
    const { container } = render(
      <PageAttributesPanel attrs={[]} onChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-testid="page-attributes-panel"]')).toBeTruthy();
  });

  it('row testids follow page-attr-panel-row-{id} pattern', () => {
    const { container } = setup();
    expect(container.querySelector('[data-testid="page-attr-panel-row-skew"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="page-attr-panel-row-dpi"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="page-attr-panel-row-lang"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="page-attr-panel-row-source"]')).toBeTruthy();
  });

  it('text input blur fires onChange(id, value)', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const input = screen.getByRole('textbox', { name: /edit skew/i });
    await user.clear(input);
    await user.type(input, '5.0');
    await user.tab(); // triggers blur

    expect(onChange).toHaveBeenCalledWith('skew', '5.0');
  });

  it('pressing Enter inside text input commits onChange', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const input = screen.getByRole('textbox', { name: /edit skew/i });
    await user.clear(input);
    await user.type(input, '3.1{Enter}');

    expect(onChange).toHaveBeenCalledWith('skew', '3.1');
  });

  it('number input blur fires onChange(id, value)', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const input = screen.getByRole('spinbutton', { name: /edit dpi/i });
    await user.clear(input);
    await user.type(input, '600');
    await user.tab(); // triggers blur

    expect(onChange).toHaveBeenCalledWith('dpi', '600');
  });

  it('select editor fires onChange immediately on change (no blur needed)', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const select = screen.getByRole('combobox', { name: /edit lang/i });
    await user.selectOptions(select, 'fr');

    expect(onChange).toHaveBeenCalledWith('lang', 'fr');
  });

  it('readOnly attr renders plain value text, no input', () => {
    setup();
    // The Source attr is readOnly — its value should render as text.
    expect(screen.getByText('scan')).toBeTruthy();
    // No input with aria-label for Source.
    expect(screen.queryByRole('textbox', { name: /edit source/i })).toBeNull();
  });

  it('renders empty state when attrs is empty', () => {
    render(<PageAttributesPanel attrs={[]} onChange={vi.fn()} />);
    expect(screen.getByText('No attributes')).toBeTruthy();
    // No list rendered.
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('does not call onChange if value is unchanged on blur', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const input = screen.getByRole('textbox', { name: /edit skew/i });
    // Focus then blur without changing the value.
    await user.click(input);
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
  });
});
