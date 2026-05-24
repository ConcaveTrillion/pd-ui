import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Segmented } from './Segmented.js';

const opts = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Segmented', () => {
  it('renders a group role', () => {
    render(<Segmented options={opts} defaultValue="a" />);
    expect(screen.getByRole('group')).toBeTruthy();
  });

  it('renders all option labels', () => {
    render(<Segmented options={opts} defaultValue="a" />);
    for (const o of opts) {
      expect(screen.getByText(o.label)).toBeTruthy();
    }
  });

  it('renders buttons with correct role', () => {
    render(<Segmented options={opts} defaultValue="a" />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(3);
  });

  it('active item has aria-checked=true', () => {
    render(<Segmented options={opts} defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    const beta = radios.find(r => r.textContent === 'Beta');
    expect(beta?.getAttribute('aria-checked')).toBe('true');
  });

  it('inactive items have aria-checked=false', () => {
    render(<Segmented options={opts} defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    const alpha = radios.find(r => r.textContent === 'Alpha');
    expect(alpha?.getAttribute('aria-checked')).toBe('false');
  });

  it('calls onChange with new value on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={opts} defaultValue="a" onChange={onChange} />);
    await user.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('controlled: value prop drives selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Segmented options={opts} value="a" onChange={onChange} />,
    );
    // Even after click, value stays until parent re-renders
    await user.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith('b');
    // Still shows a as selected (controlled)
    const radios = screen.getAllByRole('radio');
    const alpha = radios.find(r => r.textContent === 'Alpha');
    expect(alpha?.getAttribute('aria-checked')).toBe('true');

    // After rerender with new value, b is selected
    rerender(<Segmented options={opts} value="b" onChange={onChange} />);
    const radios2 = screen.getAllByRole('radio');
    const beta2 = radios2.find(r => r.textContent === 'Beta');
    expect(beta2?.getAttribute('aria-checked')).toBe('true');
  });

  it('keyboard: ArrowRight moves focus to next item', async () => {
    const user = userEvent.setup();
    render(<Segmented options={opts} defaultValue="a" />);
    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement?.textContent).toBe('Beta');
  });

  it('keyboard: ArrowLeft moves focus to previous item', async () => {
    const user = userEvent.setup();
    render(<Segmented options={opts} defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    radios[1]?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement?.textContent).toBe('Alpha');
  });

  it('keyboard: Enter selects the focused item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={opts} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    radios[1]?.focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('applies .segmented class to root', () => {
    render(<Segmented options={opts} defaultValue="a" />);
    expect(screen.getByRole('group').classList.contains('segmented')).toBe(true);
  });

  it('applies .segmented--full class when full=true', () => {
    render(<Segmented options={opts} defaultValue="a" full />);
    expect(
      screen.getByRole('group').classList.contains('segmented--full'),
    ).toBe(true);
  });

  it('applies size class', () => {
    render(<Segmented options={opts} defaultValue="a" size="sm" />);
    expect(
      screen.getByRole('group').classList.contains('segmented--sm'),
    ).toBe(true);
  });

  it('renders option icons when provided', () => {
    const optsWithIcons = [
      { value: 'x', label: 'X', icon: <span data-testid="icon-x" /> },
      { value: 'y', label: 'Y', icon: <span data-testid="icon-y" /> },
    ];
    render(<Segmented options={optsWithIcons} defaultValue="x" />);
    expect(screen.getByTestId('icon-x')).toBeTruthy();
    expect(screen.getByTestId('icon-y')).toBeTruthy();
  });
});
