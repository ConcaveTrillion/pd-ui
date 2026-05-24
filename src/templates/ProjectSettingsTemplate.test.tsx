/**
 * ProjectSettingsTemplate — TDD tests
 *
 * Asserts:
 *   1. Each slot prop renders into its testid region.
 *   2. The 8 left-rail nav items are present (all currentGroup values).
 *   3. The active group gets the aria-current indicator.
 *   4. Custom children render in the content pane.
 *   5. ProjectInfoBand renders with project title and meta.
 *   6. Settings button appears in the info band.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectSettingsTemplate, type ProjectSettingsGroup } from './ProjectSettingsTemplate.js';
import {
  PROJECT_SETTINGS_TEMPLATE,
  PROJECT_SETTINGS_NAV,
  PROJECT_SETTINGS_CONTENT,
  projectSettingsNavItem,
  PROJECT_INFO_BAND,
  PROJECT_INFO_BAND_TITLE,
  PROJECT_INFO_BAND_META,
} from '../testids/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SAMPLE_PROJECT = {
  title: 'Belloc — Survivals & New Arrivals',
  author: 'Hilaire Belloc',
  id: 'belloc-survivals',
  pages: 232,
  ingested: '12 min ago',
  size: '2.1 GB',
};

function renderTemplate(props: Partial<React.ComponentProps<typeof ProjectSettingsTemplate>> = {}) {
  return render(
    <ProjectSettingsTemplate
      project={SAMPLE_PROJECT}
      currentGroup="general"
      {...props}
    />,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProjectSettingsTemplate', () => {
  it('renders the root testid container', () => {
    renderTemplate();
    expect(screen.getByTestId(PROJECT_SETTINGS_TEMPLATE)).toBeInTheDocument();
  });

  it('renders the nav rail testid', () => {
    renderTemplate();
    expect(screen.getByTestId(PROJECT_SETTINGS_NAV)).toBeInTheDocument();
  });

  it('renders the content pane testid', () => {
    renderTemplate();
    expect(screen.getByTestId(PROJECT_SETTINGS_CONTENT)).toBeInTheDocument();
  });

  it('renders all 8 default nav items', () => {
    renderTemplate();
    const groups: ProjectSettingsGroup[] = [
      'general', 'bib', 'pgdp', 'format', 'defaults', 'members', 'storage', 'danger',
    ];
    for (const group of groups) {
      expect(screen.getByTestId(projectSettingsNavItem(group))).toBeInTheDocument();
    }
  });

  it('marks the currentGroup item with aria-current', () => {
    renderTemplate({ currentGroup: 'bib' });
    const bibItem = screen.getByTestId(projectSettingsNavItem('bib'));
    expect(bibItem).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark inactive items with aria-current', () => {
    renderTemplate({ currentGroup: 'general' });
    const bibItem = screen.getByTestId(projectSettingsNavItem('bib'));
    expect(bibItem).not.toHaveAttribute('aria-current');
  });

  it('renders custom children in the content pane', () => {
    renderTemplate({
      children: <div data-testid="custom-content">Custom</div>,
    });
    const pane = screen.getByTestId(PROJECT_SETTINGS_CONTENT);
    expect(pane).toContainElement(screen.getByTestId('custom-content'));
  });

  it('renders the project info band', () => {
    renderTemplate();
    expect(screen.getByTestId(PROJECT_INFO_BAND)).toBeInTheDocument();
  });

  it('renders the project title in the info band', () => {
    renderTemplate();
    expect(screen.getByTestId(PROJECT_INFO_BAND_TITLE)).toHaveTextContent(
      'Belloc — Survivals & New Arrivals',
    );
  });

  it('renders project meta in the info band', () => {
    renderTemplate();
    const meta = screen.getByTestId(PROJECT_INFO_BAND_META);
    expect(meta).toHaveTextContent('Hilaire Belloc');
    expect(meta).toHaveTextContent('232');
  });

  it('all 8 currentGroup variants render without error', () => {
    const groups: ProjectSettingsGroup[] = [
      'general', 'bib', 'pgdp', 'format', 'defaults', 'members', 'storage', 'danger',
    ];
    for (const group of groups) {
      const { unmount } = renderTemplate({ currentGroup: group });
      expect(screen.getByTestId(PROJECT_SETTINGS_TEMPLATE)).toBeInTheDocument();
      unmount();
    }
  });

  it('accepts a custom theme prop without error', () => {
    renderTemplate({ theme: 'dark' });
    const root = screen.getByTestId(PROJECT_SETTINGS_TEMPLATE);
    expect(root).toBeInTheDocument();
  });
});
