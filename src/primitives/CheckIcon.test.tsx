import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckIcon } from './CheckIcon.js';
import { CHECK_ICON } from '../testids/index.js';

describe('CheckIcon', () => {
  // Each state should render a wrapper with data-testid=CHECK_ICON and data-state=<state>
  const states = ['pass', 'warn', 'error', 'running', 'skip'] as const;

  it.each(states)('renders for state="%s" with correct data-testid and data-state', (state) => {
    render(<CheckIcon state={state} />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-state')).toBe(state);
  });

  it.each(states)('renders an SVG icon for state="%s"', (state) => {
    const { container } = render(<CheckIcon state={state} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('applies var(--exact) for state="pass"', () => {
    render(<CheckIcon state="pass" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.style.color).toBe('var(--exact)');
  });

  it('applies var(--fuzzy) for state="warn"', () => {
    render(<CheckIcon state="warn" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.style.color).toBe('var(--fuzzy)');
  });

  it('applies var(--mismatch) for state="error"', () => {
    render(<CheckIcon state="error" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.style.color).toBe('var(--mismatch)');
  });

  it('applies var(--ink-2) for state="running"', () => {
    render(<CheckIcon state="running" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.style.color).toBe('var(--ink-2)');
  });

  it('applies var(--ink-2) for state="skip"', () => {
    render(<CheckIcon state="skip" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.style.color).toBe('var(--ink-2)');
  });

  it('adds check-icon--running class for state="running" (for CSS spin)', () => {
    render(<CheckIcon state="running" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.classList.contains('check-icon--running')).toBe(true);
  });

  it('adds state modifier class', () => {
    render(<CheckIcon state="pass" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.classList.contains('check-icon--pass')).toBe(true);
  });

  it('merges custom className', () => {
    render(<CheckIcon state="pass" className="my-extra" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.classList.contains('check-icon')).toBe(true);
    expect(el.classList.contains('my-extra')).toBe(true);
  });

  it('forwards a custom size to the icon', () => {
    const { container } = render(<CheckIcon state="pass" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('sets aria-label on the wrapper span', () => {
    render(<CheckIcon state="pass" />);
    const el = screen.getByTestId(CHECK_ICON);
    expect(el.getAttribute('aria-label')).toBe('Pass');
  });

  it('aria-label reflects the correct label for each state', () => {
    const labelMap: Record<typeof states[number], string> = {
      pass: 'Pass',
      warn: 'Warning',
      error: 'Error',
      running: 'Running',
      skip: 'Skip',
    };
    for (const [state, label] of Object.entries(labelMap)) {
      const { unmount } = render(<CheckIcon state={state as typeof states[number]} />);
      expect(screen.getByTestId(CHECK_ICON).getAttribute('aria-label')).toBe(label);
      unmount();
    }
  });
});
