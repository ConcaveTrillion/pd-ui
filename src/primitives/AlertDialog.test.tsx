import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog.js';

describe('AlertDialog', () => {
  function renderAlert() {
    return render(
      <AlertDialog>
        <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
  }

  it('content is not in DOM initially', () => {
    renderAlert();
    expect(screen.queryByText('Are you sure?')).toBeNull();
  });

  it('clicking trigger opens content with dialog class', async () => {
    const user = userEvent.setup();
    renderAlert();
    await user.click(screen.getByText('Open Alert'));
    const content = screen.getByRole('alertdialog');
    expect(content.classList.contains('dialog')).toBe(true);
  });

  it('action button has btn primary class', async () => {
    const user = userEvent.setup();
    renderAlert();
    await user.click(screen.getByText('Open Alert'));
    const actionBtn = screen.getByText('Confirm');
    expect(actionBtn.classList.contains('btn')).toBe(true);
    expect(actionBtn.classList.contains('primary')).toBe(true);
  });
});
