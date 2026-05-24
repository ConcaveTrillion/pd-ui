import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectConfigureFrame } from './ProjectConfigureFrame.js';

describe('ProjectConfigureFrame', () => {
  it('renders with project-configure-frame class', () => {
    const { container } = render(
      <ProjectConfigureFrame
        diskSize="1.2 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={() => {}}
      />,
    );
    expect(container.querySelector('.project-configure-frame')).toBeTruthy();
  });

  it('renders DiskCostBanner with disk size', () => {
    render(
      <ProjectConfigureFrame
        diskSize="2.5 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={() => {}}
      />,
    );
    expect(screen.getByText('2.5 GB')).toBeTruthy();
  });

  it('renders RunAllDirtyPanel with dirty count', () => {
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={7}
        onRunAll={() => {}}
        onBuild={() => {}}
      />,
    );
    expect(screen.getByText(/7/)).toBeTruthy();
  });

  it('renders BuildPackagePanel', () => {
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /build package/i })).toBeTruthy();
  });

  it('calls onRunAll when RunAllDirtyPanel button clicked', () => {
    const onRunAll = vi.fn();
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={3}
        onRunAll={onRunAll}
        onBuild={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /run all/i }));
    expect(onRunAll).toHaveBeenCalledTimes(1);
  });

  it('calls onBuild when BuildPackagePanel button clicked', () => {
    const onBuild = vi.fn();
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={onBuild}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /build package/i }));
    expect(onBuild).toHaveBeenCalledTimes(1);
  });

  it('renders children slot when provided', () => {
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={() => {}}
      >
        <div data-testid="slot-content">custom content</div>
      </ProjectConfigureFrame>,
    );
    expect(screen.getByTestId('slot-content')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={0}
        onRunAll={() => {}}
        onBuild={() => {}}
        className="custom"
      />,
    );
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('passes running to RunAllDirtyPanel', () => {
    render(
      <ProjectConfigureFrame
        diskSize="1 GB"
        dirtyCount={3}
        onRunAll={() => {}}
        onBuild={() => {}}
        running
      />,
    );
    // When running=true the button text changes to "Running…"
    const runBtn = screen.getByRole('button', { name: /running/i });
    expect(runBtn.hasAttribute('disabled')).toBe(true);
  });
});
