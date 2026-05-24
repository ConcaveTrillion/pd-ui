import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PageChip } from './PageChip.js';

describe('PageChip', () => {
  describe('rendering', () => {
    it('renders the prefix text', () => {
      render(<PageChip prefix="p019" />);
      expect(screen.getByText('p019')).toBeTruthy();
    });

    it('renders as a span when no onClick provided', () => {
      render(<PageChip prefix="p042" data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.tagName.toLowerCase()).toBe('span');
    });

    it('renders as a button when onClick provided', () => {
      render(<PageChip prefix="p007" onClick={() => undefined} data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.tagName.toLowerCase()).toBe('button');
      expect((el as HTMLButtonElement).type).toBe('button');
    });

    it('applies the page-chip class', () => {
      render(<PageChip prefix="p001" data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('page-chip')).toBe(true);
    });

    it('forwards data-testid', () => {
      render(<PageChip prefix="p001" data-testid="my-chip" />);
      expect(screen.getByTestId('my-chip')).toBeTruthy();
    });

    it('accepts an extra className', () => {
      render(<PageChip prefix="p001" className="extra" data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('extra')).toBe(true);
    });
  });

  describe('onClick interaction', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handler = vi.fn();
      render(<PageChip prefix="p019" onClick={handler} data-testid="chip" />);
      await user.click(screen.getByTestId('chip'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not throw when clicked with no onClick (span)', async () => {
      const user = userEvent.setup();
      render(<PageChip prefix="p019" data-testid="chip" />);
      // span with no handler — should not throw
      await user.click(screen.getByTestId('chip'));
    });
  });

  describe('selected variant', () => {
    it('adds page-chip--selected class when selected=true', () => {
      render(<PageChip prefix="p019" selected data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('page-chip--selected')).toBe(true);
    });

    it('does not add selected class when selected=false', () => {
      render(<PageChip prefix="p019" selected={false} data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('page-chip--selected')).toBe(false);
    });

    it('does not add selected class when selected is omitted', () => {
      render(<PageChip prefix="p019" data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('page-chip--selected')).toBe(false);
    });

    it('sets aria-pressed on the button when selected', () => {
      render(<PageChip prefix="p019" onClick={() => undefined} selected data-testid="chip" />);
      const btn = screen.getByTestId('chip');
      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('mono font', () => {
    it('the chip element exists for mono-font CSS targeting', () => {
      // The component renders with the page-chip class; the actual
      // var(--mono-font) is applied via CSS (not inline style).
      // This test confirms the class hook is in place.
      render(<PageChip prefix="p019" data-testid="chip" />);
      const el = screen.getByTestId('chip');
      expect(el.classList.contains('page-chip')).toBe(true);
    });
  });
});
