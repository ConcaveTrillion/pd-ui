import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Badge } from './Badge.js';

describe('Badge', () => {
  it('renders a <span> with .badge class', () => {
    render(<Badge data-testid="b">text</Badge>);
    const el = screen.getByTestId('b');
    expect(el.tagName).toBe('SPAN');
    expect(el.classList.contains('badge')).toBe(true);
  });

  it('adds the variant class for variant="primary"', () => {
    render(
      <Badge variant="primary" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('primary')).toBe(true);
  });

  it('adds the variant class for variant="danger"', () => {
    render(
      <Badge variant="danger" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('danger')).toBe(true);
  });

  it('does NOT add a variant class for variant="default"', () => {
    render(
      <Badge variant="default" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('default')).toBe(false);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>x</Badge>);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    render(
      <Badge className="extra" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('badge')).toBe(true);
    expect(screen.getByTestId('b').classList.contains('extra')).toBe(true);
  });

  // ── tone prop ─────────────────────────────────────────────────────────
  const tones = [
    'neutral',
    'brand',
    'clean',
    'exact',
    'dirty',
    'fuzzy',
    'review',
    'running',
    'ocr',
    'failed',
    'mismatch',
    'error',
    'gt',
  ] as const;

  for (const tone of tones) {
    it(`adds tone class badge--tone-${tone} for tone="${tone}"`, () => {
      render(
        <Badge tone={tone} data-testid="b">
          x
        </Badge>,
      );
      expect(screen.getByTestId('b').classList.contains(`badge--tone-${tone}`)).toBe(true);
    });
  }

  it('does not add any tone class when tone is omitted', () => {
    render(<Badge data-testid="b">x</Badge>);
    const el = screen.getByTestId('b');
    expect([...el.classList].some((c) => c.startsWith('badge--tone-'))).toBe(false);
  });

  it('dot prop adds badge--dot class', () => {
    render(
      <Badge dot data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('badge--dot')).toBe(true);
  });

  it('dot prop absent means no badge--dot class', () => {
    render(<Badge data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('badge--dot')).toBe(false);
  });

  it('mono prop adds badge--mono class', () => {
    render(
      <Badge mono data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').classList.contains('badge--mono')).toBe(true);
  });

  it('mono prop absent means no badge--mono class', () => {
    render(<Badge data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').classList.contains('badge--mono')).toBe(false);
  });

  it('tone and variant can coexist', () => {
    render(
      <Badge variant="primary" tone="exact" data-testid="b">
        x
      </Badge>,
    );
    const el = screen.getByTestId('b');
    expect(el.classList.contains('primary')).toBe(true);
    expect(el.classList.contains('badge--tone-exact')).toBe(true);
  });

  it('dot prop renders a dot span inside when tone is set', () => {
    render(
      <Badge tone="exact" dot data-testid="b">
        label
      </Badge>,
    );
    const badge = screen.getByTestId('b');
    const dot = badge.querySelector('.badge__dot');
    expect(dot).not.toBeNull();
  });

  it('dot prop does NOT render a dot span when tone is neutral', () => {
    render(
      <Badge tone="neutral" dot data-testid="b">
        label
      </Badge>,
    );
    const badge = screen.getByTestId('b');
    expect(badge.querySelector('.badge__dot')).toBeNull();
  });
});
