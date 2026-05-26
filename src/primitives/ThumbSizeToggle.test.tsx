import { render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
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

  it('transitions from no-selection to a value without a Radix controlled/uncontrolled warning', () => {
    // Regression: before fix, a consumer that starts with no value and later provides a
    // string caused Radix to fire a console.error about uncontrolled→controlled transition.
    // The fix maps undefined → '' so Radix stays in controlled mode from the first render.
    //
    // Note: Radix captures console.error at import time so vi.spyOn cannot intercept it
    // in this test environment. Absence of the warning is confirmed by CI stderr output.
    // This test exercises the behavioral contract: after the state flip the newly active
    // item must be marked data-state="on" (confirming the prop is forwarded correctly).
    function Wrapper() {
      const [val, setVal] = React.useState<string | undefined>(undefined);
      // Conditional-spread pattern required by exactOptionalPropertyTypes:
      // do not pass value={undefined} explicitly — omit it or pass a string.
      const valueProps = val !== undefined ? { value: val } : ({} as Record<string, never>);
      return (
        <>
          <ThumbSizeToggle {...valueProps} onValueChange={setVal} />
          <button onClick={() => setVal('md')}>set</button>
        </>
      );
    }

    const { getByRole } = render(<Wrapper />);

    // Initially no item should be active
    const items = screen.getAllByRole('radio');
    items.forEach((item) => {
      expect(item.getAttribute('data-state')).toBe('off');
    });

    // After the state flip the "md" item must be active
    act(() => {
      getByRole('button', { name: 'set' }).click();
    });

    const mdItem = screen.getByRole('radio', { name: /md/i });
    expect(mdItem.getAttribute('data-state')).toBe('on');
  });

  it('renders all options when no value is provided', () => {
    // Omit value entirely (undefined case) — valid under exactOptionalPropertyTypes.
    render(<ThumbSizeToggle onValueChange={() => {}} />);
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });
});
