import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  LayerBlock,
  LayerPara,
  LayerLine,
  LayerWord,
  ModeSelect,
  ModeRebox,
  ModeErase,
  ModeCharFixer,
  MatchStatusExact,
  MatchStatusFuzzy,
  MatchStatusMismatch,
} from './bespoke.js';

const allIcons = [
  LayerBlock,
  LayerPara,
  LayerLine,
  LayerWord,
  ModeSelect,
  ModeRebox,
  ModeErase,
  ModeCharFixer,
  MatchStatusExact,
  MatchStatusFuzzy,
  MatchStatusMismatch,
];

describe('bespoke OCR SVG icons', () => {
  it('renders an <svg> element for each icon with default props', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
    }
  });

  it('applies size prop as width and height attributes', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon size={32} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('height')).toBe('32');
    }
  });

  it('defaults to size 24', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
    }
  });

  it('applies className prop to the svg element', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon className="test-icon" />);
      const svg = container.querySelector('svg');
      expect(svg?.classList.contains('test-icon')).toBe(true);
    }
  });

  it('uses currentColor for stroke or fill (inherits CSS color)', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg');
      // Check that currentColor appears somewhere in the SVG content
      const html = svg?.outerHTML ?? '';
      expect(html.includes('currentColor')).toBe(true);
    }
  });

  it('passes extra SVG props through (aria-label)', () => {
    for (const Icon of allIcons) {
      const { container } = render(<Icon aria-label="test" />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).toBe('test');
    }
  });
});
