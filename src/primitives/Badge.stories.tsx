import type { Meta, StoryObj } from '@storybook/react';
import { Badge, type BadgeTone } from './Badge.js';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger'],
    },
    tone: {
      control: 'select',
      options: [
        'neutral', 'brand', 'clean', 'exact', 'dirty', 'fuzzy',
        'review', 'running', 'ocr', 'failed', 'mismatch', 'error', 'gt',
      ],
    },
    dot: { control: 'boolean' },
    mono: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default', children: 'Default' },
};

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};

const ALL_TONES: BadgeTone[] = [
  'neutral', 'brand', 'clean', 'exact', 'dirty', 'fuzzy',
  'review', 'running', 'ocr', 'failed', 'mismatch', 'error', 'gt',
];

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {ALL_TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const AllTonesWithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {ALL_TONES.map((tone) => (
        <Badge key={tone} tone={tone} dot>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const AllTonesWithMono: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {ALL_TONES.map((tone) => (
        <Badge key={tone} tone={tone} mono>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const DotProp: Story = {
  args: { tone: 'exact', dot: true, children: 'Done' },
};

export const MonoProp: Story = {
  args: { tone: 'ocr', mono: true, children: 'running' },
};
