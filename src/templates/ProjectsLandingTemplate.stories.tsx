import type { Meta, StoryObj } from '@storybook/react';
import {
  ProjectsLandingTemplate,
  type ProjectsLandingTemplatePopulatedProps,
  type ProjectsLandingTemplateEmptyProps,
} from './ProjectsLandingTemplate.js';
import type { ProjectsDrawerProject } from './ProjectsDrawer.js';

// ─── Sample data ─────────────────────────────────────────────────────────────

const PROJECTS: ProjectsDrawerProject[] = [
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
    flagged: 18,
    size: '22.6 MB',
    updatedRel: 'yesterday',
  },
  {
    id: 'dickens-pickwick',
    title: 'The Pickwick Papers',
    author: 'Charles Dickens',
    pages: 624,
    totalStages: 23,
    currentStage: 19,
    status: 'error',
    flagged: 3,
    size: '41.2 MB',
    updatedRel: '3d ago',
  },
  {
    id: 'ruskin-modern-painters',
    title: 'Modern Painters',
    author: 'John Ruskin',
    pages: 156,
    totalStages: 23,
    currentStage: 22,
    status: 'submitted',
    size: '9.8 MB',
    updatedRel: 'May 10',
  },
  {
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
    archivedOn: 'May 02, 2026',
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectsLandingTemplate> = {
  title: 'Templates/ProjectsLandingTemplate',
  component: ProjectsLandingTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Use explicit component types to avoid discriminated-union args resolving to never.
type PopulatedStory = StoryObj<typeof ProjectsLandingTemplate> & {
  args: ProjectsLandingTemplatePopulatedProps;
};
type EmptyStory = StoryObj<typeof ProjectsLandingTemplate> & {
  args: ProjectsLandingTemplateEmptyProps;
};

// ─── Populated state stories ──────────────────────────────────────────────────

/**
 * Populated state — default: activity tab, first active project selected.
 * This matches the design's V4 layout (left rail + right detail pane).
 */
export const Populated: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'austen-emma-vol2',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

/** Populated state — attributes tab open by default. */
export const PopulatedAttributesTab: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'austen-emma-vol2',
    defaultTab: 'attributes',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

/** Populated state — manage tab open by default (active project). */
export const PopulatedManageTab: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'twain-puddnhead',
    defaultTab: 'manage',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

/** Populated state — archived project selected; manage tab shows Restore/Delete actions. */
export const PopulatedArchivedSelected: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'stevenson-kidnapped',
    defaultTab: 'manage',
    drawerDefaultTab: 'archived',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

/** Populated state — error-status project selected. */
export const PopulatedErrorProject: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'dickens-pickwick',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

/** Populated — light theme override. */
export const PopulatedLight: PopulatedStory = {
  args: {
    state: 'populated',
    projects: PROJECTS,
    selectedId: 'austen-emma-vol2',
    theme: 'light',
    onSelect: (id: string) => console.log('onSelect', id),
  },
};

// ─── Empty state stories ──────────────────────────────────────────────────────

/**
 * Empty state — first-time user, no projects.
 * Full-width hero with Create CTA + secondary "Paste URL" affordance.
 */
export const Empty: EmptyStory = {
  args: {
    state: 'empty',
    onCreateProject: () => console.log('onCreateProject'),
  },
};

/** Empty state — light theme override. */
export const EmptyLight: EmptyStory = {
  args: {
    state: 'empty',
    theme: 'light',
    onCreateProject: () => console.log('onCreateProject'),
  },
};
