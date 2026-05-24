/**
 * ProjectSettingsTemplate stories — covers every currentGroup variant
 * and both dark/light themes per spec §9 Phase-1 criteria.
 */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ProjectSettingsTemplate } from './ProjectSettingsTemplate.js';
import type { ProjectSettingsGroup } from './ProjectSettingsTemplate.js';

const SAMPLE_PROJECT = {
  title: 'Belloc — Survivals & New Arrivals',
  author: 'Hilaire Belloc',
  id: 'belloc-survivals',
  pages: 232,
  ingested: '12 min ago',
  size: '2.1 GB',
};

const meta: Meta<typeof ProjectSettingsTemplate> = {
  title: 'Templates/ProjectSettingsTemplate',
  component: ProjectSettingsTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    project: SAMPLE_PROJECT,
    currentGroup: 'general',
  },
};

export default meta;
type Story = StoryObj<typeof ProjectSettingsTemplate>;

// ── Base ────────────────────────────────────────────────────────────────────

/** Default — general group selected, placeholder content. */
export const Default: Story = {};

/** With custom right-pane content. */
export const WithCustomContent: Story = {
  args: {
    children: (
      <div style={{ padding: 24, color: 'var(--ink-2)', fontSize: 14 }}>
        <h2 style={{ margin: '0 0 8px', color: 'var(--ink-1)' }}>Custom settings content</h2>
        <p>This slot accepts any React node as right-pane content.</p>
      </div>
    ),
  },
};

// ── All 8 currentGroup variants ──────────────────────────────────────────────

const ALL_GROUPS: ProjectSettingsGroup[] = [
  'general', 'bib', 'pgdp', 'format', 'defaults', 'members', 'storage', 'danger',
];

export const General: Story = { args: { currentGroup: 'general' } };
export const Bibliographic: Story = { args: { currentGroup: 'bib' } };
export const PgdpSubmission: Story = { args: { currentGroup: 'pgdp' } };
export const FormatAndContent: Story = { args: { currentGroup: 'format' } };
export const StageDefaults: Story = { args: { currentGroup: 'defaults' } };
export const Members: Story = { args: { currentGroup: 'members' } };
export const StorageAndCleanup: Story = { args: { currentGroup: 'storage' } };
/** Danger zone — nav item renders in mismatch (danger) tone. */
export const DangerZone: Story = { args: { currentGroup: 'danger' } };

// ── AllGroups showcase ────────────────────────────────────────────────────────

/** Stacked showcase of all 8 group variants (visual regression target). */
export const AllGroupsShowcase: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {ALL_GROUPS.map(group => (
        <div key={group} style={{ height: 380, borderBottom: '1px solid var(--border-1)' }}>
          <ProjectSettingsTemplate {...args} currentGroup={group} />
        </div>
      ))}
    </div>
  ),
};

// ── Theme variants ────────────────────────────────────────────────────────────

/** Dark theme (default root). */
export const DarkTheme: Story = { args: { theme: 'dark' } };

/** Light theme. */
export const LightTheme: Story = { args: { theme: 'light' } };
