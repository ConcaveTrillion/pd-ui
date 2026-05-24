import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Button } from './Button.js';

// Minimal icon stub — avoids lucide-react import in test file (ESLint rule)
const FakeIcon = () => <svg data-testid="icon-left" aria-hidden="true" />;
const FakeIconRight = () => <svg data-testid="icon-right" aria-hidden="true" />;

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

  // ── New props: icon, iconRight, full ────────────────────────────────────

  it('renders an icon before children when icon prop is provided', () => {
    render(<Button icon={<FakeIcon />}>Label</Button>);
    expect(screen.getByTestId('icon-left')).toBeTruthy();
    // Button text still present
    expect(screen.getByRole('button', { name: /label/i })).toBeTruthy();
  });

  it('renders an icon after children when iconRight prop is provided', () => {
    render(<Button iconRight={<FakeIconRight />}>Label</Button>);
    expect(screen.getByTestId('icon-right')).toBeTruthy();
  });

  it('renders both icon and iconRight around children', () => {
    render(
      <Button icon={<FakeIcon />} iconRight={<FakeIconRight />}>Label</Button>
    );
    const btn = screen.getByRole('button');
    const svgs = btn.querySelectorAll('svg');
    expect(svgs).toHaveLength(2);
    // Left icon is first child SVG, right icon is last
    expect(svgs[0]?.getAttribute('data-testid')).toBe('icon-left');
    expect(svgs[1]?.getAttribute('data-testid')).toBe('icon-right');
  });

  it('adds the "full" class when full prop is true', () => {
    render(<Button full>x</Button>);
    expect(screen.getByRole('button').classList.contains('full')).toBe(true);
  });

  it('does NOT add "full" class when full prop is false or absent', () => {
    render(<Button>x</Button>);
    expect(screen.getByRole('button').classList.contains('full')).toBe(false);
  });

  it('does NOT add "full" class when full={false}', () => {
    render(<Button full={false}>x</Button>);
    expect(screen.getByRole('button').classList.contains('full')).toBe(false);
  });

  it('renders icon-only button (no children) with icon prop', () => {
    render(<Button aria-label="add" icon={<FakeIcon />} />);
    const btn = screen.getByRole('button', { name: /add/i });
    expect(btn.querySelector('svg')).toBeTruthy();
  });

  it('combines full with variant and size correctly', () => {
    render(<Button variant="primary" size="lg" full>Save</Button>);
    const btn = screen.getByRole('button', { name: /save/i });
    expect(btn.classList.contains('primary')).toBe(true);
    expect(btn.classList.contains('lg')).toBe(true);
    expect(btn.classList.contains('full')).toBe(true);
  });
});
