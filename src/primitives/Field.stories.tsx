import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field.js';
import { Input } from './Input.js';

const meta: Meta<typeof Field> = {
  title: 'Primitives/Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field label="Email" htmlFor="email">
      <Input id="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Email" htmlFor="email-err" error="Please enter a valid email address.">
      <Input id="email-err" defaultValue="not-an-email" />
    </Field>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <Field>
      <Input placeholder="No label" />
    </Field>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
      <Field label="Username" htmlFor="username">
        <Input id="username" placeholder="Enter username" />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" type="password" placeholder="Enter password" />
      </Field>
      <Field label="Email" htmlFor="email-form" error="Email is required.">
        <Input id="email-form" placeholder="Enter email" />
      </Field>
    </div>
  ),
};
