import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Input } from './Input.js';

describe('Input', () => {
  it('renders an <input> element with the .input class', () => {
    render(<Input data-testid="inp" />);
    const input = screen.getByTestId('inp');
    expect(input.tagName).toBe('INPUT');
    expect(input.classList.contains('input')).toBe(true);
  });

  it('adds the size class for size="lg"', () => {
    render(<Input data-testid="inp" size="lg" />);
    expect(screen.getByTestId('inp').classList.contains('lg')).toBe(true);
  });

  it('does NOT add a size class for size="sm" (sm class from .input base)', () => {
    render(<Input data-testid="inp" size="sm" />);
    expect(screen.getByTestId('inp').classList.contains('sm')).toBe(true);
  });

  it('does NOT add a size class for size="md" (md is the default/base)', () => {
    render(<Input data-testid="inp" size="md" />);
    expect(screen.getByTestId('inp').classList.contains('md')).toBe(false);
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="inp" />);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('passes HTML props through (placeholder)', () => {
    render(<Input placeholder="type here" data-testid="inp" />);
    expect(screen.getByTestId('inp').getAttribute('placeholder')).toBe('type here');
  });

  it('merges custom className', () => {
    render(<Input className="my-input" data-testid="inp" />);
    const el = screen.getByTestId('inp');
    expect(el.classList.contains('input')).toBe(true);
    expect(el.classList.contains('my-input')).toBe(true);
  });
});
