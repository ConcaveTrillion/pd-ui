import type { Meta, StoryObj } from '@storybook/react';
import { QualityBanner } from './QualityBanner.js';

const meta: Meta<typeof QualityBanner> = {
  title: 'Primitives/QualityBanner',
  component: QualityBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof QualityBanner>;

const SOURCE_FLAGS = [
  { kind: 'blurry' as const, count: 22 },
  { kind: 'skew' as const, count: 11 },
  { kind: 'dark' as const, count: 8 },
  { kind: 'sparse' as const, count: 14 },
];

export const Warning: Story = {
  args: {
    title: 'Source quality issues',
    flagged: 33,
    total: 232,
    flags: SOURCE_FLAGS,
    sub: 'Detected before pipeline run · blur, contrast, skew, sparse content.',
    actionLabel: 'View flagged',
    onAction: () => {},
    onTune: () => {},
    onDismiss: () => {},
  },
};

export const Extreme: Story = {
  args: {
    title: 'Source quality issues',
    flagged: 180,
    total: 232,
    flags: [
      ...SOURCE_FLAGS,
      { kind: 'errored' as const, count: 3 },
    ],
    sub: 'High failure rate — review thresholds before proceeding.',
    severe: true,
    actionLabel: 'View flagged',
    onAction: () => {},
    onDismiss: () => {},
  },
};

export const NoActions: Story = {
  args: {
    title: 'OCR low-confidence pages',
    flagged: 18,
    total: 232,
    flags: [
      { kind: 'low-conf' as const, count: 18 },
      { kind: 'no-text' as const, count: 2 },
    ],
    sub: 'Pages OCR fell back on, or returned implausible character distributions.',
  },
};
