import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './Dialog.js';

describe('Dialog', () => {
  it('content is not in DOM when closed', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent aria-describedby="desc">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription id="desc">Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByText('Title')).toBeNull();
  });

  it('clicking Trigger opens Content with dialog class', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent aria-describedby="desc">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription id="desc">A description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByText('Open'));
    const content = screen.getByRole('dialog');
    expect(content).toBeTruthy();
    expect(content.classList.contains('dialog')).toBe(true);
  });

  it('DialogTitle renders with dialog-title class', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent aria-describedby="desc">
          <DialogTitle>My Title</DialogTitle>
          <DialogDescription id="desc">desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByText('Open'));
    const title = screen.getByText('My Title');
    expect(title.classList.contains('dialog-title')).toBe(true);
  });
});
