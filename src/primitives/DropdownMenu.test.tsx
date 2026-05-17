import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './DropdownMenu.js';

describe('DropdownMenu', () => {
  function renderDropdown() {
    return render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item One</DropdownMenuItem>
          <DropdownMenuItem>Item Two</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
  }

  it('content is not visible initially', () => {
    renderDropdown();
    expect(screen.queryByText('Item One')).toBeNull();
  });

  it('clicking trigger opens content with dropdown class', async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByText('Open Menu'));
    const content = await screen.findByRole('menu');
    expect(content.classList.contains('dropdown')).toBe(true);
  });

  it('menu items have dropdown-item class', async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByText('Open Menu'));
    const item = await screen.findByText('Item One');
    expect(item.classList.contains('dropdown-item')).toBe(true);
  });
});
