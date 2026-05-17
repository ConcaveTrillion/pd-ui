import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { KeyCap } from './KeyCap.js';

describe('KeyCap', () => {
  it('renders a single key with the .key class', () => {
    render(<KeyCap keys="Ctrl" data-testid="kc" />);
    const el = screen.getByTestId('kc');
    const keyEl = el.querySelector('.key');
    expect(keyEl).not.toBeNull();
    expect(keyEl?.textContent).toBe('Ctrl');
  });

  it('renders multiple keys with + separator', () => {
    render(<KeyCap keys={['Ctrl', 'S']} data-testid="kc" />);
    const el = screen.getByTestId('kc');
    const keys = el.querySelectorAll('.key');
    expect(keys).toHaveLength(2);
    expect(keys[0]?.textContent).toBe('Ctrl');
    expect(keys[1]?.textContent).toBe('S');
    expect(el.textContent).toContain('+');
  });

  it('does NOT render a + separator for a single key', () => {
    render(<KeyCap keys="Escape" data-testid="kc" />);
    const el = screen.getByTestId('kc');
    expect(el.textContent).not.toContain('+');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<KeyCap keys="A" ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  it('merges custom className', () => {
    render(<KeyCap keys="A" className="extra" data-testid="kc" />);
    expect(screen.getByTestId('kc').classList.contains('extra')).toBe(true);
  });
});
