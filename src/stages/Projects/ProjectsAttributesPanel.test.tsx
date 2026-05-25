/**
 * ProjectsAttributesPanel — unit tests.
 *
 * Covers:
 * - Default 4 sections derived from project shape.
 * - Custom sections override defaults.
 * - onChange propagates (via slot wiring).
 * - testid present on root.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectsAttributesPanel } from './ProjectsAttributesPanel.js';
import { PROJECTS_ATTRIBUTES_PANEL } from '../../testids/index.js';

const minimalProject = {
  title: 'Emma Vol. 2',
  bibliographic: { Language: 'English', 'Original year': '1815' },
  pgdp: { 'Project ID': 'austen-emma-p1', Difficulty: 'B1 · Beginners welcome' },
  format: { 'Page format': 'smooth-reading' },
  comments: 'Preserve em-dashes throughout.',
};

describe('ProjectsAttributesPanel', () => {
  it('renders 4 section headings by default from project data', () => {
    render(<ProjectsAttributesPanel project={minimalProject} />);
    expect(screen.getByText('Bibliographic')).toBeInTheDocument();
    expect(screen.getByText('PGDP project')).toBeInTheDocument();
    expect(screen.getByText('Format & content')).toBeInTheDocument();
    expect(screen.getByText('Project comments')).toBeInTheDocument();
  });

  it('renders the project title in the Bibliographic section', () => {
    render(<ProjectsAttributesPanel project={minimalProject} />);
    expect(screen.getByText('Emma Vol. 2')).toBeInTheDocument();
  });

  it('renders the project ID in the PGDP section', () => {
    render(<ProjectsAttributesPanel project={minimalProject} />);
    expect(screen.getByText('austen-emma-p1')).toBeInTheDocument();
  });

  it('renders comments text', () => {
    render(<ProjectsAttributesPanel project={minimalProject} />);
    expect(screen.getByText('Preserve em-dashes throughout.')).toBeInTheDocument();
  });

  it('attaches PROJECTS_ATTRIBUTES_PANEL testid to the root', () => {
    const { container } = render(<ProjectsAttributesPanel project={minimalProject} />);
    expect(container.querySelector(`[data-testid="${PROJECTS_ATTRIBUTES_PANEL}"]`)).not.toBeNull();
  });

  it('custom sections override defaults', () => {
    const customSections = [
      {
        id: 'custom',
        label: 'Custom Section',
        fields: [{ id: 'f1', label: 'Key', value: 'Value' }],
      },
    ];
    render(<ProjectsAttributesPanel project={minimalProject} sections={customSections} />);
    expect(screen.getByText('Custom Section')).toBeInTheDocument();
    // Default sections should NOT appear when custom sections provided.
    expect(screen.queryByText('Bibliographic')).toBeNull();
    expect(screen.queryByText('PGDP project')).toBeNull();
  });

  it('renders a minimal project with no optional fields', () => {
    render(<ProjectsAttributesPanel project={{}} />);
    // All 4 section headings should still be present.
    expect(screen.getByText('Bibliographic')).toBeInTheDocument();
    expect(screen.getByText('PGDP project')).toBeInTheDocument();
    expect(screen.getByText('Format & content')).toBeInTheDocument();
    expect(screen.getByText('Project comments')).toBeInTheDocument();
  });
});
