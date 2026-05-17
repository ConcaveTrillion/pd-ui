import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Chip } from './Chip.js';

describe('Chip', () => {
  it('renders a <span> with .chip class', () => {
    render(<Chip data-testid="c">text</Chip>);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('SPAN');
    expect(el.classList.contains('chip')).toBe(true);
  });

  it('adds the dashed class for variant="dashed"', () => {
    render(<Chip variant="dashed" data-testid="c">x</Chip>);
    expect(screen.getByTestId('c').classList.contains('dashed')).toBe(true);
  });

  it('does NOT add a class for variant="static"', () => {
    render(<Chip variant="static" data-testid="c">x</Chip>);
    expect(screen.getByTestId('c').classList.contains('static')).toBe(false);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Chip ref={ref}>x</Chip>);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    render(<Chip className="extra" data-testid="c">x</Chip>);
    expect(screen.getByTestId('c').classList.contains('chip')).toBe(true);
    expect(screen.getByTestId('c').classList.contains('extra')).toBe(true);
  });
});
