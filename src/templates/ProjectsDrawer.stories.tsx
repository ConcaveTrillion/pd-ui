import type { Meta, StoryObj } from '@storybook/react';
import { ProjectsDrawer, type ProjectsDrawerProject } from './ProjectsDrawer.js';
import { Button } from '../primitives/Button.js';

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
];

const ARCHIVED: ProjectsDrawerProject = {
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
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectsDrawer> = {
  title: 'Templates/ProjectsDrawer',
  component: ProjectsDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, height: 600, display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    selectedId: { control: 'text' },
    defaultTab: {
      control: { type: 'radio' },
      options: ['active', 'archived'],
    },
    onSelect: { action: 'onSelect' },
    onCreateProject: { action: 'onCreateProject' },
    createSlot: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default empty state — no projects yet. */
export const Empty: Story = {
  args: {
    projects: [],
    selectedId: null,
  },
};

/** Populated list with the first project pre-selected. */
export const Populated: Story = {
  args: {
    projects: PROJECTS,
    selectedId: 'belloc-survivals',
  },
};

/** Populated list with a mid-list project selected. */
export const SelectedProject: Story = {
  args: {
    projects: PROJECTS,
    selectedId: 'austen-emma-vol2',
  },
};

/** Mix of active + archived projects; archive tab is open by default. */
export const WithArchived: Story = {
  args: {
    projects: [...PROJECTS, ARCHIVED],
    selectedId: null,
    defaultTab: 'archived',
  },
};

/** Active tab showing active projects alongside one archived project. */
export const ActiveTabWithSomeArchived: Story = {
  args: {
    projects: [...PROJECTS, ARCHIVED],
    selectedId: 'twain-puddnhead',
    defaultTab: 'active',
  },
};

/** Custom createSlot replaces the default "New project" button. */
export const CustomCreateSlot: Story = {
  args: {
    projects: PROJECTS,
    selectedId: null,
    createSlot: (
      <Button variant="primary" full>
        Import project…
      </Button>
    ),
  },
};

/** Only archived tab — active list is empty. */
export const ArchiveTabEmpty: Story = {
  args: {
    projects: PROJECTS,
    selectedId: null,
    defaultTab: 'archived',
  },
};
