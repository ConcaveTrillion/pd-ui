import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './Select.js';

// jsdom does not implement several pointer/scroll APIs; patch them so Radix Select does not crash
beforeAll(() => {
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = () => undefined;
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = () => undefined;
  }
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = () => undefined;
  }
});

describe('Select', () => {
  function renderSelect() {
    return render(
      <Select>
        <SelectTrigger aria-label="color">
          <SelectValue placeholder="Pick a color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectContent>
      </Select>,
    );
  }

  it('shows placeholder when no value selected', () => {
    renderSelect();
    expect(screen.getByText('Pick a color')).toBeTruthy();
  });

  it('SelectTrigger has select-trigger class', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger.classList.contains('select-trigger')).toBe(true);
  });

  it('SelectTrigger renders as a combobox with select-trigger class', () => {
    // Note: Radix Select has pointer-capture and scrollIntoView calls that
    // jsdom does not support, so we only verify static rendering + classes here.
    // The beforeAll patches hasPointerCapture/scrollIntoView for jsdom compat.
    renderSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger.classList.contains('select-trigger')).toBe(true);
  });
});
