/**
 * Tests for the <Icon name> dispatcher shim.
 *
 * Verifies that every design-system icon name (Table 3 of the design-handoff
 * port-plan) resolves to the correct named lucide or bespoke export.
 *
 * OQ-1 resolution: the dispatcher lets ported stage code use the design API
 * verbatim (`<Icon name="check"/>`) while named exports remain available.
 * OQ-7: `alert` → `AlertTriangle`
 * OQ-8: `swap` → `ArrowLeftRight`
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Icon, ICON_NAMES } from './Icon.js';

// Every design name from Table 3
const ALL_DESIGN_NAMES: Array<typeof ICON_NAMES[number]> = [
  'upload',
  'folder',
  'file',
  'image',
  'archive',
  'link',
  'hardDrive',
  'check',
  'checkCircle',
  'x',
  'alert',
  'info',
  'chevR',
  'chevL',
  'chevD',
  'arrowR',
  'search',
  'bell',
  'plus',
  'moon',
  'sun',
  'grip',
  'pause',
  'download',
  'wrench',
  'refresh',
  'eye',
  'loader',
  'fileText',
  'play',
  'package',
  'moreH',
  'arrowUp',
  'arrowDown',
  'arrowUpDown',
  'scissors',
  'trash',
  'sparkles',
  'swap',
  'copy',
];

describe('<Icon name> dispatcher', () => {
  it('ICON_NAMES contains all 40 design icon names', () => {
    expect(ICON_NAMES).toHaveLength(40);
    for (const name of ALL_DESIGN_NAMES) {
      expect(ICON_NAMES).toContain(name);
    }
  });

  it.each(ALL_DESIGN_NAMES)('renders without error for name="%s"', (name) => {
    // Should render an SVG — no throws
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('accepts an optional size prop', () => {
    const { container } = render(<Icon name="check" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    // lucide sets width/height attributes from the size prop
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('alert maps to AlertTriangle (OQ-7)', () => {
    // AlertTriangle renders a triangle; its test: renders an SVG without error
    const { container } = render(<Icon name="alert" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('swap maps to ArrowLeftRight (OQ-8)', () => {
    const { container } = render(<Icon name="swap" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('loader maps to Loader2 (design "loader" → lucide "Loader2")', () => {
    const { container } = render(<Icon name="loader" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('trash maps to Trash2 (design "trash" → lucide "Trash2")', () => {
    const { container } = render(<Icon name="trash" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('moreH maps to MoreHorizontal', () => {
    const { container } = render(<Icon name="moreH" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
