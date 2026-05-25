import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import React from 'react';

test('testing library works', () => {
  render(<div data-testid="x">ok</div>);
  expect(screen.getByTestId('x').textContent).toBe('ok');
});
