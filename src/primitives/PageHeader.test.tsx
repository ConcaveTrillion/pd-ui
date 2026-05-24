import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { PageHeader } from './PageHeader.js';

describe('PageHeader', () => {
  it('renders a <div> with .page-header class', () => {
    render(<PageHeader title="Projects" data-testid="ph" />);
    const el = screen.getByTestId('ph');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('page-header')).toBe(true);
  });

  it('renders the title in an <h1>', () => {
    render(<PageHeader title="My Projects" />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('My Projects');
  });

  it('does not render subtitle element when sub is omitted', () => {
    render(<PageHeader title="T" />);
    expect(screen.queryByTestId('page-header-sub')).toBeNull();
  });

  it('renders subtitle when sub is provided', () => {
    render(<PageHeader title="T" sub="A subtitle" />);
    const sub = screen.getByTestId('page-header-sub');
    expect(sub.textContent).toBe('A subtitle');
  });

  it('does not render action slot when action is omitted', () => {
    render(<PageHeader title="T" />);
    expect(screen.queryByTestId('page-header-action')).toBeNull();
  });

  it('renders action slot when action is provided', () => {
    render(<PageHeader title="T" action={<button>New</button>} />);
    const slot = screen.getByTestId('page-header-action');
    expect(slot.querySelector('button')?.textContent).toBe('New');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PageHeader ref={ref} title="T" />);
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current?.classList.contains('page-header')).toBe(true);
  });

  it('merges custom className', () => {
    render(<PageHeader title="T" className="extra" data-testid="ph" />);
    const el = screen.getByTestId('ph');
    expect(el.classList.contains('page-header')).toBe(true);
    expect(el.classList.contains('extra')).toBe(true);
  });

  it('passes through arbitrary HTML div attributes', () => {
    render(<PageHeader title="T" aria-label="page header" data-testid="ph" />);
    expect(screen.getByTestId('ph').getAttribute('aria-label')).toBe('page header');
  });
});
