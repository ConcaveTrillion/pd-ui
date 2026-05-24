import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input.js';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Some value', placeholder: 'Placeholder' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <Input placeholder="Default" />
      <Input defaultValue="With value" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Read-only" readOnly defaultValue="Read-only value" />
    </div>
  ),
};

/* ─── suffix slot ───────────────────────────────────────────────────────── */

export const WithSuffix: Story = {
  args: { placeholder: '0', suffix: 'px' },
};

export const WithSuffixAndValue: Story = {
  args: { defaultValue: '250', suffix: 'ms' },
};

export const WithSuffixDisabled: Story = {
  args: { placeholder: '0', suffix: '%', disabled: true },
};

/* ─── autoFocusRing ─────────────────────────────────────────────────────── */

export const AutoFocusRing: Story = {
  args: { placeholder: 'Always-focused appearance', autoFocusRing: true },
};

export const AutoFocusRingWithSuffix: Story = {
  args: { defaultValue: '100', suffix: 'px', autoFocusRing: true },
};

/* ─── composite gallery ─────────────────────────────────────────────────── */

export const SuffixGallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <Input placeholder="Width" suffix="px" />
      <Input placeholder="Opacity" suffix="%" defaultValue="100" />
      <Input placeholder="Duration" suffix="ms" />
      <Input placeholder="Scale" suffix="×" defaultValue="1.5" />
      <Input placeholder="Focus-ring always on" suffix="px" autoFocusRing />
      <Input placeholder="Bare — no suffix (back-compat)" />
    </div>
  ),
};
