import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttributesPanel } from './AttributesPanel.js';

// Minimal project entry shape for testing.
const SAMPLE_PROJECT = {
  id: 'austen-emma-vol2',
  title: 'Emma · Vol. II',
  author: 'Jane Austen',
};

describe('AttributesPanel', () => {
  it('renders section labels for all three default groups', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    expect(screen.getByText('Bibliographic')).toBeTruthy();
    expect(screen.getByText('PGDP project')).toBeTruthy();
    expect(screen.getByText('Format & content')).toBeTruthy();
  });

  it('renders the project comments section', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    expect(screen.getByText('Project comments')).toBeTruthy();
  });

  it('renders field labels when a section is expanded', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    // Default is open, so Title label should appear.
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Author')).toBeTruthy();
  });

  it('renders project title and author values', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    expect(screen.getByText('Emma · Vol. II')).toBeTruthy();
    expect(screen.getByText('Jane Austen')).toBeTruthy();
  });

  it('renders project id in the PGDP section', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    expect(screen.getByText('austen-emma-vol2')).toBeTruthy();
  });

  it('collapses a section when its header is clicked', async () => {
    const user = userEvent.setup();
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    // Click the Bibliographic header to collapse it.
    const bibHeader = screen.getByRole('button', { name: /bibliographic/i });
    await user.click(bibHeader);
    // After collapse, field labels inside that section should disappear.
    expect(screen.queryByText('Title')).toBeNull();
  });

  it('expands a collapsed section on a second click', async () => {
    const user = userEvent.setup();
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    const bibHeader = screen.getByRole('button', { name: /bibliographic/i });
    // Collapse then expand.
    await user.click(bibHeader);
    await user.click(bibHeader);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('renders an Edit action button in each section header', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} />);
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    // 4 sections (bib, pgdp, fmt, comments) each have Edit.
    expect(editButtons.length).toBeGreaterThanOrEqual(4);
  });

  it('accepts a custom actions slot for a group via sectionActions prop', () => {
    const actions = vi.fn(() => <button>Custom action</button>);
    render(<AttributesPanel project={SAMPLE_PROJECT} sectionActions={{ bib: actions() }} />);
    expect(screen.getByText('Custom action')).toBeTruthy();
  });

  it('renders children (comments slot) when provided', () => {
    render(
      <AttributesPanel project={SAMPLE_PROJECT}>
        <span>Custom comment block</span>
      </AttributesPanel>,
    );
    expect(screen.getByText('Custom comment block')).toBeTruthy();
  });

  it('forwards data-testid to the root element', () => {
    render(<AttributesPanel project={SAMPLE_PROJECT} data-testid="ap-root" />);
    expect(document.querySelector('[data-testid="ap-root"]')).toBeTruthy();
  });
});
