import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StageJumpPopover } from './StageJumpPopover.js';

const stages = [
  { id: 'source', short: 'source', group: 'Source' },
  { id: 'threshold', short: 'thresh', group: 'Image' },
  { id: 'ocr', short: 'ocr', group: 'OCR' },
];

describe('StageJumpPopover', () => {
  it('renders the trigger button', () => {
    render(
      <StageJumpPopover stages={stages} currentStage="threshold" onJump={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /jump to stage/i })).toBeTruthy();
  });

  it('renders a custom trigger when provided', () => {
    render(
      <StageJumpPopover
        stages={stages}
        currentStage="threshold"
        onJump={() => {}}
        trigger={<button type="button">Go to…</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Go to…' })).toBeTruthy();
  });

  it('renders with stage-jump-popover class on root', () => {
    const { container } = render(
      <StageJumpPopover stages={stages} currentStage="threshold" onJump={() => {}} />,
    );
    expect(container.querySelector('.stage-jump-popover')).toBeTruthy();
  });

  it('calls onJump with stage id when a stage item is clicked', () => {
    const onJump = vi.fn();
    render(
      <StageJumpPopover stages={stages} currentStage="source" onJump={onJump} defaultOpen />,
    );
    // Stage list should be visible since defaultOpen=true; items show the "short" label
    const stageItem = screen.getByText('thresh');
    fireEvent.click(stageItem.closest('button') as HTMLElement);
    expect(onJump).toHaveBeenCalledWith('threshold');
  });

  it('does not call onJump for current stage', () => {
    const onJump = vi.fn();
    render(
      <StageJumpPopover stages={stages} currentStage="threshold" onJump={onJump} defaultOpen />,
    );
    // "thresh" is the short label for the "threshold" stage
    const currentItem = screen.getByText('thresh').closest('button') as HTMLElement;
    fireEvent.click(currentItem);
    expect(onJump).not.toHaveBeenCalled();
  });
});
