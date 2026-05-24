import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BuildPackagePanel } from './BuildPackagePanel.js';

describe('BuildPackagePanel', () => {
  it('renders "Build Package" button', () => {
    render(<BuildPackagePanel onBuild={() => {}} />);
    expect(screen.getByRole('button', { name: /build package/i })).toBeTruthy();
  });

  it('calls onBuild when button clicked', () => {
    const onBuild = vi.fn();
    render(<BuildPackagePanel onBuild={onBuild} />);
    fireEvent.click(screen.getByRole('button', { name: /build package/i }));
    expect(onBuild).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<BuildPackagePanel onBuild={() => {}} disabled />);
    const btn = screen.getByRole('button', { name: /build package/i });
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('disables button when building prop is true', () => {
    render(<BuildPackagePanel onBuild={() => {}} building />);
    const btn = screen.getByRole('button', { name: /building/i });
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('renders status badge when status provided', () => {
    render(<BuildPackagePanel onBuild={() => {}} status="clean" statusLabel="Ready" />);
    expect(screen.getByText('Ready')).toBeTruthy();
  });

  it('omits status badge when status not provided', () => {
    const { container } = render(<BuildPackagePanel onBuild={() => {}} />);
    expect(container.querySelector('.build-package-panel__status')).toBeNull();
  });

  it('renders with build-package-panel class', () => {
    const { container } = render(<BuildPackagePanel onBuild={() => {}} />);
    expect(container.querySelector('.build-package-panel')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<BuildPackagePanel onBuild={() => {}} className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
