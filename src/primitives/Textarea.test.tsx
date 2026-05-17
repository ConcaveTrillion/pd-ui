import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Textarea } from './Textarea.js';

describe('Textarea', () => {
  it('renders a <textarea> element with the .textarea class', () => {
    render(<Textarea data-testid="ta" />);
    const el = screen.getByTestId('ta');
    expect(el.tagName).toBe('TEXTAREA');
    expect(el.classList.contains('textarea')).toBe(true);
  });

  it('forwards ref to the underlying <textarea>', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} data-testid="ta" />);
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('passes HTML props through (rows)', () => {
    render(<Textarea rows={5} data-testid="ta" />);
    expect(screen.getByTestId('ta').getAttribute('rows')).toBe('5');
  });

  it('merges custom className', () => {
    render(<Textarea className="my-ta" data-testid="ta" />);
    const el = screen.getByTestId('ta');
    expect(el.classList.contains('textarea')).toBe(true);
    expect(el.classList.contains('my-ta')).toBe(true);
  });
});
