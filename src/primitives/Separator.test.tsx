import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Separator } from './Separator.js';

describe('Separator', () => {
  it('renders a <div> with .separator class', () => {
    render(<Separator data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('separator')).toBe(true);
  });

  it('defaults to horizontal orientation', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep').dataset['orientation']).toBe('horizontal');
  });

  it('sets data-orientation="vertical" when orientation="vertical"', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    expect(screen.getByTestId('sep').dataset['orientation']).toBe('vertical');
  });

  it('is decorative by default (role=none)', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep').getAttribute('role')).toBe('none');
  });

  it('has role=separator when decorative=false', () => {
    render(<Separator decorative={false} data-testid="sep" />);
    expect(screen.getByTestId('sep').getAttribute('role')).toBe('separator');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    render(<Separator className="extra" data-testid="sep" />);
    expect(screen.getByTestId('sep').classList.contains('separator')).toBe(true);
    expect(screen.getByTestId('sep').classList.contains('extra')).toBe(true);
  });
});
