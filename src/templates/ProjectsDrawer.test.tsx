/**
 * Tests for ProjectsDrawer molecule.
 *
 * Acceptance criteria (GH #356):
 *  - exports a typed `ProjectsDrawer`
 *  - tests cover project selection and create-project slot
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsDrawer, type ProjectsDrawerProject } from './ProjectsDrawer.js';

// ─── sample data ──────────────────────────────────────────────────────────────

const ACTIVE_PROJECTS: ProjectsDrawerProject[] = [
  {
    id: 'belloc-survivals',
    title: 'Survivals & New Arrivals',
    author: 'Hilaire Belloc',
    pages: 387,
    totalStages: 23,
    currentStage: 22,
    status: 'ready',
    size: '28.4 MB',
    updatedRel: '2h ago',
  },
  {
    id: 'twain-puddnhead',
    title: "Pudd'nhead Wilson",
    author: 'Mark Twain',
    pages: 218,
    totalStages: 23,
    currentStage: 10,
    status: 'running',
    size: '14.1 MB',
    updatedRel: 'running',
  },
  {
    id: 'austen-emma-vol2',
    title: 'Emma · Vol. II',
    author: 'Jane Austen',
    pages: 412,
    totalStages: 23,
    currentStage: 11,
    status: 'review',
    size: '22.6 MB',
    updatedRel: 'yesterday',
  },
];

const ARCHIVED_PROJECT: ProjectsDrawerProject = {
  id: 'stevenson-kidnapped',
  title: 'Kidnapped',
  author: 'Robert Louis Stevenson',
  pages: 248,
  totalStages: 23,
  currentStage: 22,
  status: 'submitted',
  size: '15.2 MB',
  updatedRel: 'Apr 28',
  archived: true,
};

// ─── render helper ────────────────────────────────────────────────────────────

function renderEmpty() {
  return render(<ProjectsDrawer projects={[]} selectedId={null} onSelect={vi.fn()} />);
}

function renderPopulated(selectedId = 'austen-emma-vol2') {
  const onSelect = vi.fn();
  const utils = render(
    <ProjectsDrawer projects={ACTIVE_PROJECTS} selectedId={selectedId} onSelect={onSelect} />,
  );
  return { ...utils, onSelect };
}

// ─── structure ────────────────────────────────────────────────────────────────

describe('ProjectsDrawer — structure', () => {
  it('renders a root element with data-testid="projects-drawer"', () => {
    renderPopulated();
    expect(screen.getByTestId('projects-drawer')).toBeTruthy();
  });

  it('renders a "New project" button (create-project slot)', () => {
    renderPopulated();
    const btn = screen.getByRole('button', { name: /new project/i });
    expect(btn).toBeTruthy();
  });

  it('renders project rows for each active project', () => {
    renderPopulated();
    // Each project title should be visible
    expect(screen.getByText('Survivals & New Arrivals')).toBeTruthy();
    expect(screen.getByText("Pudd'nhead Wilson")).toBeTruthy();
    expect(screen.getByText('Emma · Vol. II')).toBeTruthy();
  });

  it('marks the selected project row with data-selected="true"', () => {
    renderPopulated('twain-puddnhead');
    const rows = document.querySelectorAll('[data-selected="true"]');
    expect(rows.length).toBe(1);
    expect(rows[0]?.textContent).toContain("Pudd'nhead Wilson");
  });
});

// ─── empty state ─────────────────────────────────────────────────────────────

describe('ProjectsDrawer — empty state', () => {
  it('shows an empty-state message when projects is []', () => {
    renderEmpty();
    expect(screen.getByTestId('projects-drawer-empty')).toBeTruthy();
  });

  it('still renders the "New project" button when empty', () => {
    renderEmpty();
    expect(screen.getByRole('button', { name: /new project/i })).toBeTruthy();
  });

  it('does not render project rows when empty', () => {
    renderEmpty();
    expect(document.querySelectorAll('[data-testid="project-row"]').length).toBe(0);
  });
});

// ─── project selection ────────────────────────────────────────────────────────

describe('ProjectsDrawer — project selection', () => {
  it('calls onSelect with the project id when a row is clicked', () => {
    const { onSelect } = renderPopulated();
    fireEvent.click(screen.getByText('Survivals & New Arrivals'));
    expect(onSelect).toHaveBeenCalledWith('belloc-survivals');
  });

  it('calls onSelect for a different project when clicked', () => {
    const { onSelect } = renderPopulated();
    fireEvent.click(screen.getByText("Pudd'nhead Wilson"));
    expect(onSelect).toHaveBeenCalledWith('twain-puddnhead');
  });

  it('does not crash when selectedId does not match any project', () => {
    const { container } = render(
      <ProjectsDrawer projects={ACTIVE_PROJECTS} selectedId="does-not-exist" onSelect={vi.fn()} />,
    );
    expect(container.querySelector('[data-testid="projects-drawer"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-selected="true"]').length).toBe(0);
  });

  it('does not crash when selectedId is null', () => {
    const { container } = render(
      <ProjectsDrawer projects={ACTIVE_PROJECTS} selectedId={null} onSelect={vi.fn()} />,
    );
    expect(container.querySelector('[data-testid="projects-drawer"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-selected="true"]').length).toBe(0);
  });
});

// ─── create-project slot ──────────────────────────────────────────────────────

describe('ProjectsDrawer — create-project slot', () => {
  it('calls onCreateProject when "New project" is clicked (default slot)', () => {
    const onCreateProject = vi.fn();
    render(
      <ProjectsDrawer
        projects={ACTIVE_PROJECTS}
        selectedId={null}
        onSelect={vi.fn()}
        onCreateProject={onCreateProject}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /new project/i }));
    expect(onCreateProject).toHaveBeenCalledTimes(1);
  });

  it('renders a custom createSlot when provided', () => {
    render(
      <ProjectsDrawer
        projects={ACTIVE_PROJECTS}
        selectedId={null}
        onSelect={vi.fn()}
        createSlot={<button data-testid="custom-create">Import</button>}
      />,
    );
    expect(screen.getByTestId('custom-create')).toBeTruthy();
    // default "New project" button is replaced
    expect(screen.queryByRole('button', { name: /new project/i })).toBeNull();
  });
});

// ─── archived tab ─────────────────────────────────────────────────────────────

describe('ProjectsDrawer — archived tab', () => {
  it('renders archived projects in the Archived tab', () => {
    render(
      <ProjectsDrawer
        projects={[...ACTIVE_PROJECTS, ARCHIVED_PROJECT]}
        selectedId={null}
        onSelect={vi.fn()}
        defaultTab="archived"
      />,
    );
    // Archived project shows in initial render
    expect(screen.getByText('Kidnapped')).toBeTruthy();
  });

  it('active projects are visible on the Active tab (default)', () => {
    render(
      <ProjectsDrawer
        projects={[...ACTIVE_PROJECTS, ARCHIVED_PROJECT]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Emma · Vol. II')).toBeTruthy();
    // Archived project not visible on active tab
    expect(screen.queryByText('Kidnapped')).toBeNull();
  });

  it('shows tab counts for active and archived', () => {
    render(
      <ProjectsDrawer
        projects={[...ACTIVE_PROJECTS, ARCHIVED_PROJECT]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    );
    // Should show count "3" for active tab
    expect(screen.getByTestId('tab-active-count').textContent).toBe('3');
    expect(screen.getByTestId('tab-archived-count').textContent).toBe('1');
  });
});
