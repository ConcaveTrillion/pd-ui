import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Badge } from './Badge.js';

describe('Badge', () => {
  it('renders a <span> with .badge class', () => {
    render(<Badge data-testid="b">text</Badge>);
    const el = screen.getByTestId('b');
    expect(el.tagName).toBe('SPAN');
    expect(el.classList.contains('badge')).toBe(true);
  });

  it('adds the variant class for variant="primary"', () => {
    render(<Badge variant="primary" data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('primary')).toBe(true);
  });

  it('adds the variant class for variant="danger"', () => {
    render(<Badge variant="danger" data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('danger')).toBe(true);
  });

  it('does NOT add a variant class for variant="default"', () => {
    render(<Badge variant="default" data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('default')).toBe(false);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>x</Badge>);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    render(<Badge className="extra" data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('badge')).toBe(true);
    expect(screen.getByTestId('b').classList.contains('extra')).toBe(true);
  });
});
