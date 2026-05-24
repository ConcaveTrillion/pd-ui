import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader.js';
import { Button } from './Button.js';

const meta: Meta<typeof PageHeader> = {
  title: 'Primitives/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    sub: { control: 'text' },
    action: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Projects',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Projects',
    sub: 'Manage your active OCR projects',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Projects',
    action: <Button variant="primary">New project</Button>,
  },
};

export const WithSubtitleAndAction: Story = {
  args: {
    title: 'Projects',
    sub: 'Manage your active OCR projects',
    action: <Button variant="primary">New project</Button>,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Optical Character Recognition Processing Queue',
    sub: 'All pending and in-progress jobs across all books',
    action: <Button variant="ghost">View all</Button>,
  },
};
