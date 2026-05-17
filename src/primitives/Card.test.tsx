import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Card } from './Card.js';

describe('Card', () => {
  it('renders a <div> with .card class', () => {
    render(<Card data-testid="c">content</Card>);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('card')).toBe(true);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>content</Card>);
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    render(<Card className="extra" data-testid="c">x</Card>);
    const el = screen.getByTestId('c');
    expect(el.classList.contains('card')).toBe(true);
    expect(el.classList.contains('extra')).toBe(true);
  });

  it('renders children', () => {
    render(<Card data-testid="c"><span data-testid="child">hello</span></Card>);
    expect(screen.getByTestId('child').textContent).toBe('hello');
  });
});
