import type { Meta, StoryObj } from '@storybook/react';
import { BackendChip } from './BackendChip.js';

const meta: Meta<typeof BackendChip> = {
  title: 'Primitives/BackendChip',
  component: BackendChip,
  parameters: {
    docs: {
      description: {
        component:
          'GPU / CPU / auto status indicator chip. Promoted from stage-local usage to `src/primitives/` as suite-wide vocabulary (Phase 2 M2).',
      },
    },
  },
  argTypes: {
    backend: {
      control: 'select',
      options: ['gpu', 'cpu', 'auto'],
    },
    fallback: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BackendChip>;

export const GPU: Story = {
  args: {
    backend: 'gpu',
  },
};

export const CPU: Story = {
  args: {
    backend: 'cpu',
  },
};

export const CPUFallback: Story = {
  name: 'CPU (fallback)',
  args: {
    backend: 'cpu',
    fallback: true,
  },
};

export const Auto: Story = {
  args: {
    backend: 'auto',
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <BackendChip backend="gpu" />
      <BackendChip backend="cpu" />
      <BackendChip backend="cpu" fallback />
      <BackendChip backend="auto" />
    </div>
  ),
};
