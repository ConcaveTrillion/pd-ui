import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BlockTypePickerPanel } from './BlockTypePickerPanel.js';
import type { BlockTypeOption } from './BlockTypePickerPanel.js';
import {
  BLOCK_TYPE_PICKER_PANEL,
  blockTypePickerOptionTestId,
} from '../../testids/index.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BASIC_TYPES: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'footnote', label: 'Footnote' },
];

const ICON_TYPES: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph', icon: 'fileText' },
  { value: 'illustration', label: 'Illustration', icon: 'image' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderPanel(
  overrides: Partial<React.ComponentProps<typeof BlockTypePickerPanel>> = {},
) {
  const onSelect = vi.fn();
  const defaults: React.ComponentProps<typeof BlockTypePickerPanel> = {
    types: BASIC_TYPES,
    onSelect,
    ...overrides,
  };
  const result = render(<BlockTypePickerPanel {...defaults} />);
  return { ...result, onSelect };
}

// ── Title ─────────────────────────────────────────────────────────────────────

describe('BlockTypePickerPanel — title', () => {
  it('defaults to "Block type" when no title prop given', () => {
    renderPanel();
    expect(screen.getByRole('heading', { name: 'Block type' })).toBeInTheDocument();
  });

  it('renders the supplied title', () => {
    renderPanel({ title: 'Reassign block' });
    expect(screen.getByRole('heading', { name: 'Reassign block' })).toBeInTheDocument();
  });
});

// ── Type options ──────────────────────────────────────────────────────────────

describe('BlockTypePickerPanel — type options', () => {
  it('renders a button for each type', () => {
    renderPanel();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Footnote')).toBeInTheDocument();
  });

  it('renders nothing when types is empty', () => {
    renderPanel({ types: [] });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// ── onSelect ──────────────────────────────────────────────────────────────────

describe('BlockTypePickerPanel — onSelect', () => {
  it('calls onSelect with the value when a type button is clicked', async () => {
    const { onSelect } = renderPanel();
    await userEvent.click(screen.getByTestId(blockTypePickerOptionTestId('heading')));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith('heading');
  });

  it('calls onSelect for every individual click', async () => {
    const { onSelect } = renderPanel();
    await userEvent.click(screen.getByTestId(blockTypePickerOptionTestId('paragraph')));
    await userEvent.click(screen.getByTestId(blockTypePickerOptionTestId('footnote')));
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, 'paragraph');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'footnote');
  });
});

// ── selectedType / aria-pressed ───────────────────────────────────────────────

describe('BlockTypePickerPanel — selectedType', () => {
  it('aria-pressed=true on the selected option', () => {
    renderPanel({ selectedType: 'heading' });
    const btn = screen.getByTestId(blockTypePickerOptionTestId('heading'));
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('aria-pressed=false on non-selected options', () => {
    renderPanel({ selectedType: 'heading' });
    const para = screen.getByTestId(blockTypePickerOptionTestId('paragraph'));
    expect(para).toHaveAttribute('aria-pressed', 'false');
    const fn = screen.getByTestId(blockTypePickerOptionTestId('footnote'));
    expect(fn).toHaveAttribute('aria-pressed', 'false');
  });

  it('no option has aria-pressed=true when selectedType is omitted', () => {
    renderPanel();
    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('aria-pressed', 'false');
    }
  });
});

// ── Icon ──────────────────────────────────────────────────────────────────────

describe('BlockTypePickerPanel — icon', () => {
  it('renders an icon wrapper span when icon is provided', () => {
    renderPanel({ types: ICON_TYPES });
    const paraBtn = screen.getByTestId(blockTypePickerOptionTestId('paragraph'));
    expect(paraBtn.querySelector('.type-grid__cell-icon')).not.toBeNull();
  });

  it('does not render an icon wrapper when icon is omitted', () => {
    renderPanel({ types: BASIC_TYPES });
    const paraBtn = screen.getByTestId(blockTypePickerOptionTestId('paragraph'));
    expect(paraBtn.querySelector('.type-grid__cell-icon')).toBeNull();
  });
});

// ── data-testid ───────────────────────────────────────────────────────────────

describe('BlockTypePickerPanel — data-testid', () => {
  it('default testid is BLOCK_TYPE_PICKER_PANEL', () => {
    renderPanel();
    expect(screen.getByTestId(BLOCK_TYPE_PICKER_PANEL)).toBeInTheDocument();
  });

  it('custom data-testid overrides the default', () => {
    renderPanel({ 'data-testid': 'custom-picker' });
    expect(screen.getByTestId('custom-picker')).toBeInTheDocument();
    expect(screen.queryByTestId(BLOCK_TYPE_PICKER_PANEL)).not.toBeInTheDocument();
  });

  it('each option button gets a stable testid from blockTypePickerOptionTestId', () => {
    renderPanel();
    expect(screen.getByTestId(blockTypePickerOptionTestId('paragraph'))).toBeInTheDocument();
    expect(screen.getByTestId(blockTypePickerOptionTestId('heading'))).toBeInTheDocument();
    expect(screen.getByTestId(blockTypePickerOptionTestId('footnote'))).toBeInTheDocument();
  });
});
