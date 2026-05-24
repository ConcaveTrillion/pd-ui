import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThumbGrid } from './ThumbGrid.js';

describe('ThumbGrid', () => {
  it('renders with thumb-grid class', () => {
    const { container } = render(
      <ThumbGrid items={[]} renderItem={() => <div />} />,
    );
    expect(container.querySelector('.thumb-grid')).toBeTruthy();
  });

  it('renders correct number of items', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    render(
      <ThumbGrid
        items={items}
        renderItem={(item) => <span key={item.id}>{item.id}</span>}
      />,
    );
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.getByText('b')).toBeTruthy();
    expect(screen.getByText('c')).toBeTruthy();
  });

  it('renders empty state when no items and emptyState provided', () => {
    render(
      <ThumbGrid
        items={[]}
        renderItem={() => <div />}
        emptyState={<p>No thumbnails</p>}
      />,
    );
    expect(screen.getByText('No thumbnails')).toBeTruthy();
  });

  it('renders nothing for empty list without emptyState', () => {
    const { container } = render(
      <ThumbGrid items={[]} renderItem={() => <div />} />,
    );
    const grid = container.querySelector('.thumb-grid');
    expect(grid).toBeTruthy();
    // No items rendered
    expect(grid?.children.length).toBe(0);
  });

  it('applies thumbSize as CSS custom property', () => {
    const { container } = render(
      <ThumbGrid items={[]} renderItem={() => <div />} thumbSize={160} />,
    );
    const grid = container.querySelector<HTMLElement>('.thumb-grid');
    expect(grid?.style.getPropertyValue('--thumb-size')).toBe('160px');
  });

  it('forwards className', () => {
    const { container } = render(
      <ThumbGrid items={[]} renderItem={() => <div />} className="extra" />,
    );
    expect(container.querySelector('.extra')).toBeTruthy();
  });

  it('renders each item inside a thumb-grid__cell wrapper', () => {
    const items = [{ id: 'x' }];
    const { container } = render(
      <ThumbGrid
        items={items}
        renderItem={(item) => <span>{item.id}</span>}
      />,
    );
    expect(container.querySelector('.thumb-grid__cell')).toBeTruthy();
  });
});
