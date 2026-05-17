import type { Meta, StoryObj } from '@storybook/react';
import { StatusPip } from './StatusPip.js';

const meta: Meta<typeof StatusPip> = {
  title: 'Primitives/StatusPip',
  component: StatusPip,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['exact', 'fuzzy', 'mismatch', 'ocr', 'gt'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Exact: Story = {
  args: { status: 'exact', label: 'Exact' },
};

export const Fuzzy: Story = {
  args: { status: 'fuzzy', label: 'Fuzzy' },
};

export const Mismatch: Story = {
  args: { status: 'mismatch', label: 'Mismatch' },
};

export const Ocr: Story = {
  args: { status: 'ocr', label: 'OCR' },
};

export const Gt: Story = {
  args: { status: 'gt', label: 'GT' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusPip status="exact" label="Exact" />
      <StatusPip status="fuzzy" label="Fuzzy" />
      <StatusPip status="mismatch" label="Mismatch" />
      <StatusPip status="ocr" label="OCR" />
      <StatusPip status="gt" label="GT" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <StatusPip status="exact" />
      <StatusPip status="fuzzy" />
      <StatusPip status="mismatch" />
      <StatusPip status="ocr" />
      <StatusPip status="gt" />
    </div>
  ),
};
