import type { Meta, StoryObj } from '@storybook/react';
import { SummaryStrip } from './SummaryStrip.js';

const meta: Meta<typeof SummaryStrip> = {
  title: 'Primitives/SummaryStrip',
  component: SummaryStrip,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SummaryStrip>;

export const Default: Story = {
  args: {
    cells: [
      { label: 'Pages', value: '128' },
      { label: 'Words', value: '14k', sub: 'of 15k' },
      { label: 'Exact', value: '112', tone: 'clean' },
      { label: 'Errors', value: '3', tone: 'dirty' },
      { label: 'Review', value: '8', tone: 'warn' },
    ],
  },
};

export const Minimal: Story = {
  args: {
    cells: [
      { label: 'Total', value: '256' },
      { label: 'Done', value: '200' },
    ],
  },
};

export const Empty: Story = {
  args: {
    cells: [],
  },
};
