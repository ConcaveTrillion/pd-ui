import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea.js';

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...', rows: 4 },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled textarea', disabled: true, rows: 4 },
};

export const WithValue: Story = {
  args: { defaultValue: 'Some pre-filled content\nAcross multiple lines.', rows: 4 },
};
