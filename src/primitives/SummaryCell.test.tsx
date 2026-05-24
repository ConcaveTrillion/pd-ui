import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SummaryCell } from './SummaryCell.js';

describe('SummaryCell', () => {
  it('renders label and value', () => {
    render(<SummaryCell label="Pages" value="128" />);
    expect(screen.getByText('Pages')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
  });

  it('renders optional sub text', () => {
    render(<SummaryCell label="Words" value="14k" sub="of 15k expected" />);
    expect(screen.getByText('of 15k expected')).toBeTruthy();
  });

  it('omits sub when not provided', () => {
    const { container } = render(<SummaryCell label="Pages" value="128" />);
    expect(container.querySelector('.summary-cell__sub')).toBeNull();
  });

  it('applies tone modifier class', () => {
    const { container } = render(<SummaryCell label="Dirty" value="3" tone="dirty" />);
    expect(container.querySelector('.summary-cell--dirty')).toBeTruthy();
  });

  it('applies no tone class for neutral', () => {
    const { container } = render(<SummaryCell label="Total" value="10" tone="neutral" />);
    expect(container.querySelector('.summary-cell--neutral')).toBeNull();
  });

  it('forwards className', () => {
    const { container } = render(<SummaryCell label="A" value="1" className="extra" />);
    expect(container.querySelector('.extra')).toBeTruthy();
  });

  it('has role="status" for screen-reader announcement', () => {
    const { container } = render(<SummaryCell label="Files" value="99" />);
    expect(container.querySelector('[role="status"]')).toBeTruthy();
  });
});
