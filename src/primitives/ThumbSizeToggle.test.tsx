import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThumbSizeToggle, THUMB_SIZES } from './ThumbSizeToggle.js';

describe('ThumbSizeToggle', () => {
  it('renders the default set of size options', () => {
    render(<ThumbSizeToggle value={THUMB_SIZES[0]!.id} onValueChange={() => {}} />);
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  it('marks the active option as pressed', () => {
    render(<ThumbSizeToggle value="md" onValueChange={() => {}} />);
    const mdItem = screen.getByRole('radio', { name: /md/i });
    expect(mdItem.getAttribute('data-state')).toBe('on');
  });

  it('renders with thumb-size-toggle class', () => {
    const { container } = render(<ThumbSizeToggle value="md" onValueChange={() => {}} />);
    expect(container.querySelector('.thumb-size-toggle')).toBeTruthy();
  });

  it('calls onValueChange when a size is clicked', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<ThumbSizeToggle value="sm" onValueChange={handler} />);
    const lgButton = screen.getByRole('radio', { name: /lg/i });
    await user.click(lgButton);
    expect(handler).toHaveBeenCalled();
  });

  it('forwards className', () => {
    const { container } = render(
      <ThumbSizeToggle value="md" onValueChange={() => {}} className="extra" />,
    );
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
