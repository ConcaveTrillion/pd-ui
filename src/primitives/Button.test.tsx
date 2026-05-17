import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a <button> element with the .btn class', () => {
    render(<Button>click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.classList.contains('btn')).toBe(true);
  });

  it('adds the variant class for variant="primary"', () => {
    render(<Button variant="primary">x</Button>);
    const btn = screen.getByRole('button', { name: /x/i });
    expect(btn.classList.contains('primary')).toBe(true);
    expect(btn.classList.contains('btn')).toBe(true);
  });

  it('adds the variant class for variant="ghost"', () => {
    render(<Button variant="ghost">x</Button>);
    expect(screen.getByRole('button').classList.contains('ghost')).toBe(true);
  });

  it('adds the variant class for variant="danger"', () => {
    render(<Button variant="danger">x</Button>);
    expect(screen.getByRole('button').classList.contains('danger')).toBe(true);
  });

  it('adds the size class for size="sm"', () => {
    render(<Button size="sm">x</Button>);
    expect(screen.getByRole('button').classList.contains('sm')).toBe(true);
  });

  it('does NOT add a size class for size="md" (md is the default/base)', () => {
    render(<Button size="md">x</Button>);
    const btn = screen.getByRole('button');
    expect(btn.classList.contains('md')).toBe(false);
  });

  it('adds the size class for size="lg"', () => {
    render(<Button size="lg">x</Button>);
    expect(screen.getByRole('button').classList.contains('lg')).toBe(true);
  });

  it('forwards ref to the underlying <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('passes HTML props through (disabled)', () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true);
  });

  it('merges custom className', () => {
    render(<Button className="my-class">x</Button>);
    const btn = screen.getByRole('button');
    expect(btn.classList.contains('btn')).toBe(true);
    expect(btn.classList.contains('my-class')).toBe(true);
  });
});
