/**
 * PipelineTemplate stories.
 *
 * Covers every `DCArtboard` variant from the design-handoff pipeline app.jsx:
 *   1. Default — threshold stage, default tabs, empty slot
 *   2. text_review stage — Review queue + Comments tabs
 *   3. build_package stage — Manifest + Pre-flight tabs
 *   4. Custom children — caller supplies body content
 *   5. Custom tabsSlot — caller supplies own tabs band
 *   6. Light theme
 */
import type { Meta, StoryObj } from '@storybook/react';
import { PipelineTemplate, PipelineEmptySlot } from './PipelineTemplate.js';
import { PIPELINE_STAGES } from './StageStrip.js';

const SAMPLE_PROJECT = {
  title: 'Belloc — Survivals & New Arrivals',
  author: 'Hilaire Belloc',
  id: 'belloc-survivals',
  pages: 232,
  ingested: '12 min ago',
  size: '2.1 GB',
  status: 'review',
};

const meta: Meta<typeof PipelineTemplate> = {
  title: 'Templates/PipelineTemplate',
  component: PipelineTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    project: SAMPLE_PROJECT,
    stages: [...PIPELINE_STAGES],
    stage: 'threshold',
  },
};

export default meta;

type Story = StoryObj<typeof PipelineTemplate>;

/** 1 · Pipeline template · threshold (default tabs + empty slot) */
export const Threshold: Story = {
  name: '1 · threshold · default tabs',
  args: {
    stage: 'threshold',
  },
};

/** 2 · Pipeline template · text_review (Review queue + Comments) */
export const TextReview: Story = {
  name: '2 · text_review · Review queue',
  args: {
    stage: 'text_review',
    currentTab: 'queue',
  },
};

/** 3 · Pipeline template · build_package (Manifest + Pre-flight) */
export const BuildPackage: Story = {
  name: '3 · build_package · Manifest',
  args: {
    stage: 'build_package',
    currentTab: 'manifest',
  },
};

/** 4 · Custom children (caller supplies body content) */
export const CustomChildren: Story = {
  name: '4 · Custom children slot',
  args: {
    stage: 'threshold',
    children: (
      <div
        style={{
          padding: 24,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-3)',
          fontSize: 14,
        }}
      >
        ← Caller-supplied content replaces PipelineEmptySlot
      </div>
    ),
  },
};

/** 5 · Custom tabsSlot (caller supplies own tabs band) */
export const CustomTabsSlot: Story = {
  name: '5 · Custom tabsSlot',
  args: {
    stage: 'threshold',
    tabsSlot: (
      <div
        style={{
          padding: '12px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-1)',
          color: 'var(--ink-3)',
          fontSize: 12,
        }}
      >
        Custom tabs slot — caller owns this band entirely
      </div>
    ),
  },
};

/** 6 · Light theme */
export const LightTheme: Story = {
  name: '6 · Light theme',
  parameters: {
    backgrounds: { default: 'light' },
  },
  args: {
    theme: 'light',
    stage: 'ocr',
    currentTab: 'recognition',
  },
};

/** 7 · With running stage (pulsing OCR color dot) */
export const RunningStage: Story = {
  name: '7 · Running stage',
  args: {
    stage: 'ocr',
    running: true,
    flagged: 0,
    dirty: 3,
  },
};

/** 8 · With flagged pages (Next disabled) */
export const FlaggedPages: Story = {
  name: '8 · Flagged pages (Next disabled)',
  args: {
    stage: 'threshold',
    flagged: 31,
    dirty: 167,
  },
};

/** 9 · PipelineEmptySlot in isolation */
export const EmptySlot: Story = {
  name: '9 · PipelineEmptySlot (isolated)',
  render: () => (
    <div style={{ height: 600, display: 'flex' }}>
      <PipelineEmptySlot />
    </div>
  ),
};
