import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageSplitView } from './PageSplitView.js';

describe('PageSplitView', () => {
  function renderView() {
    return render(
      <PageSplitView
        toolbar={<button>Toolbar Button</button>}
        canvas={<div>Canvas Content</div>}
        editor={<div>Editor Content</div>}
      />,
    );
  }

  it('renders with data-testid="page-split-view"', () => {
    renderView();
    expect(screen.getByTestId('page-split-view')).toBeTruthy();
  });

  it('renders toolbar slot content', () => {
    renderView();
    expect(screen.getByText('Toolbar Button')).toBeTruthy();
  });

  it('renders canvas slot content', () => {
    renderView();
    expect(screen.getByText('Canvas Content')).toBeTruthy();
  });

  it('renders editor slot content', () => {
    renderView();
    expect(screen.getByText('Editor Content')).toBeTruthy();
  });

  it('has a role="toolbar" div wrapping the toolbar slot', () => {
    renderView();
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.classList.contains('page-split-view__toolbar')).toBe(true);
  });

  it('toolbar is inside the root page-split-view container', () => {
    renderView();
    const root = screen.getByTestId('page-split-view');
    const toolbar = screen.getByRole('toolbar');
    expect(root.contains(toolbar)).toBe(true);
  });

  it('root element has page-split-view class', () => {
    renderView();
    const root = screen.getByTestId('page-split-view');
    expect(root.classList.contains('page-split-view')).toBe(true);
  });
});
