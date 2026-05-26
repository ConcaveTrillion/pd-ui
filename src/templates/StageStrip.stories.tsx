/**
 * Storybook stories for StageStrip.
 *
 * DCArtboard variants (matching wf02/variations.jsx states):
 *   AllGreen   — flagged=null, dirty=null, running=false
 *   Warnings   — flagged=null, dirty=2, running=false
 *   Errors     — flagged=2, dirty=0, running=false
 *   Running    — running=true, flagged=null, dirty=null
 *   EarlyStage — currentStage = source (first stage)
 *   LateStage  — currentStage = archive (last stage)
 *   WithActions — custom actions slot
 */
import type { Meta, StoryObj } from '@storybook/react';
import { StageStrip, PIPELINE_STAGES } from './StageStrip.js';

const meta: Meta<typeof StageStrip> = {
  title: 'Templates/StageStrip',
  component: StageStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    current: {
      control: 'select',
      options: PIPELINE_STAGES.map((s) => s.id),
    },
    running: { control: 'boolean' },
    flagged: { control: 'number' },
    dirty: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '0' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── DCArtboard variants ────────────────────────────────────────────────────

/** All checks green — no errors, no warnings, not running. */
export const AllGreen: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'validation',
    running: false,
  },
};

/** Warning state — dirty count set, no errors. */
export const Warnings: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'validation',
    running: false,
    dirty: 2,
  },
};

/** Error state — flagged count set; Next button is disabled. */
export const Errors: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'validation',
    running: false,
    flagged: 2,
    dirty: 0,
  },
};

/** Running state — stage dot pulses with --ocr color. */
export const Running: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'ocr',
    running: true,
  },
};

/** Early stage — source is the first stage. */
export const EarlyStage: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'source',
  },
};

/** Late stage — archive is the last stage. */
export const LateStage: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'archive',
  },
};

/** Both errors and warnings simultaneously. */
export const BothErrorsAndWarnings: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'text_review',
    flagged: 3,
    dirty: 7,
  },
};

/** With custom actions slot. */
export const WithActions: Story = {
  render: () => (
    <StageStrip
      stages={[...PIPELINE_STAGES]}
      current="ocr"
      actions={
        <button
          type="button"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-2)',
            background: 'var(--bg-raised)',
            color: 'var(--ink-2)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Stage settings
        </button>
      }
    />
  ),
};

/** Short stage list — custom minimal pipeline (3 stages). */
export const ShortPipeline: Story = {
  args: {
    stages: [
      { id: 'ingest', short: 'ingest', group: 'Source' },
      { id: 'process', short: 'process', group: 'OCR' },
      { id: 'export', short: 'export', group: 'Pack' },
    ],
    current: 'process',
  },
};

/**
 * Configure-page context variant (Phase 2 M10).
 *
 * Design source: wf03/wf03-variations.jsx:375-451 — StageContextStrip used
 * inside the Project Configure → Pages tab. Applies the
 * `stage-strip--configure` CSS modifier; visual rendering is identical to
 * the default in pdomain-ui's base theme, but consuming apps can target the
 * modifier for context-specific overrides.
 */
export const ConfigureVariant: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    current: 'source',
    variant: 'configure',
    flagged: 47,
    dirty: 167,
  },
};
