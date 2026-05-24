/**
 * JobsPill stories — idle, running, and high-count variants.
 * Uses the `open` prop to force the popover visible for static artboards.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JobsPill } from './JobsPill.js';

const meta: Meta<typeof JobsPill> = {
  title: 'Shell/JobsPill',
  component: JobsPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleJobs = [
  {
    id: 'job-1',
    title: 'OCR pass 1',
    phase: 'Recognition · page 42/180',
    pct: 23,
    project: 'belloc-survivals',
  },
  {
    id: 'job-2',
    title: 'Ingest',
    phase: 'Image extraction · 100%',
    pct: 100,
    project: 'chesterton-heretics',
  },
];

/** Idle state: no active jobs, muted appearance. */
export const Idle: Story = {
  args: {
    activeJobs: [],
  },
};

/** Running: one active job, accent pill + pulse dot. */
export const Running: Story = {
  args: {
    activeJobs: [sampleJobs[0]!],
  },
};

/** Running with popover open (forced via `open` prop). */
export const RunningWithPopover: Story = {
  args: {
    activeJobs: [sampleJobs[0]!],
    open: true,
  },
};

/** Idle with popover open — shows "No active jobs" empty message. */
export const IdlePopoverOpen: Story = {
  args: {
    activeJobs: [],
    open: true,
  },
};

/** Multiple jobs — count badge and popover list. */
export const MultipleJobs: Story = {
  args: {
    activeJobs: sampleJobs,
    open: true,
  },
};

/** High count (10+ jobs) — count badge renders the full number. */
export const HighCount: Story = {
  args: {
    activeJobs: Array.from({ length: 12 }, (_, i) => ({
      id: `job-${i}`,
      title: `Job ${i + 1}`,
      phase: `Stage ${i + 1}`,
      pct: Math.round((i / 12) * 100),
      project: `project-${i}`,
    })),
  },
};
