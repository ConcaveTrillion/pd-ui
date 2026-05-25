import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Search, ChevronRight, Trash2 } from '../icons/lucide.js';
import { Button } from './Button.js';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    full: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost Button' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger Button' },
};

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Small' },
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Large' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    icon: <Plus size={14} />,
    children: 'New Project',
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'ghost',
    iconRight: <ChevronRight size={14} />,
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    icon: <Search size={14} />,
    iconRight: <ChevronRight size={14} />,
    children: 'Search',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    full: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const FullWidthWithIcon: Story = {
  args: {
    variant: 'danger',
    full: true,
    icon: <Trash2 size={14} />,
    children: 'Delete Everything',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm">
        Primary SM
      </Button>
      <Button variant="primary">Primary MD</Button>
      <Button variant="primary" size="lg">
        Primary LG
      </Button>
      <Button variant="ghost" size="sm">
        Ghost SM
      </Button>
      <Button variant="ghost">Ghost MD</Button>
      <Button variant="ghost" size="lg">
        Ghost LG
      </Button>
      <Button variant="danger" size="sm">
        Danger SM
      </Button>
      <Button variant="danger">Danger MD</Button>
      <Button variant="danger" size="lg">
        Danger LG
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary" icon={<Plus size={14} />}>
        Add Item
      </Button>
      <Button variant="ghost" iconRight={<ChevronRight size={14} />}>
        Continue
      </Button>
      <Button variant="primary" icon={<Search size={14} />} iconRight={<ChevronRight size={14} />}>
        Search
      </Button>
      <Button variant="danger" icon={<Trash2 size={14} />} size="sm">
        Delete
      </Button>
    </div>
  ),
};
