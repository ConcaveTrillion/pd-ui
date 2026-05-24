import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatTile } from './StatTile.js';

describe('StatTile', () => {
  it('renders label and value', () => {
    render(<StatTile label="Files" value="387" />);
    expect(screen.getByText('Files')).toBeTruthy();
    expect(screen.getByText('387')).toBeTruthy();
  });

  it('renders sub-label when provided', () => {
    render(<StatTile label="Size" value="2.1 GB" sub="raw / 210 MB zipped" />);
    expect(screen.getByText('raw / 210 MB zipped')).toBeTruthy();
  });

  it('omits sub-label when not provided', () => {
    const { container } = render(<StatTile label="JP2" value="380" />);
    expect(container.querySelector('.stat-tile__sub')).toBeNull();
  });

  it('applies clean tone modifier', () => {
    const { container } = render(<StatTile label="Files" value="387" tone="clean" />);
    expect(container.querySelector('.stat-tile--clean')).toBeTruthy();
  });

  it('applies dirty tone modifier', () => {
    const { container } = render(<StatTile label="Skipped" value="3" tone="dirty" />);
    expect(container.querySelector('.stat-tile--dirty')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<StatTile label="A" value="1" className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
