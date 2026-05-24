import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SummaryStrip } from './SummaryStrip.js';

describe('SummaryStrip', () => {
  const cells = [
    { label: 'Pages', value: '128' },
    { label: 'Words', value: '14k', sub: 'of 15k' },
    { label: 'Errors', value: '3', tone: 'dirty' as const },
  ];

  it('renders all cell labels and values', () => {
    render(<SummaryStrip cells={cells} />);
    expect(screen.getByText('Pages')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    expect(screen.getByText('Words')).toBeTruthy();
    expect(screen.getByText('14k')).toBeTruthy();
    expect(screen.getByText('Errors')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('passes sub to SummaryCell', () => {
    render(<SummaryStrip cells={cells} />);
    expect(screen.getByText('of 15k')).toBeTruthy();
  });

  it('renders with summary-strip container class', () => {
    const { container } = render(<SummaryStrip cells={cells} />);
    expect(container.querySelector('.summary-strip')).toBeTruthy();
  });

  it('forwards className to root element', () => {
    const { container } = render(<SummaryStrip cells={cells} className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('renders empty strip with no cells', () => {
    const { container } = render(<SummaryStrip cells={[]} />);
    expect(container.querySelector('.summary-strip')).toBeTruthy();
    expect(container.querySelectorAll('.summary-cell')).toHaveLength(0);
  });
});
