import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StepDots } from './StepDots.js';

const meta: Meta<typeof StepDots> = {
  title: 'Primitives/StepDots',
  component: StepDots,
  tags: ['autodocs'],
  argTypes: {
    current: { control: { type: 'number', min: 0, max: 4, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS_2 = ['Name', 'Source'];
const STEPS_3 = ['Name', 'Source', 'Options'];
const STEPS_4 = ['Import', 'Align', 'Review', 'Export'];

/** Active = first step, all others pending. */
export const FirstActive: Story = {
  args: { steps: STEPS_3, current: 0 },
};

/** Active = middle step; first is done, last is pending. */
export const MiddleActive: Story = {
  args: { steps: STEPS_3, current: 1 },
};

/** Active = last step; all previous are done. */
export const LastActive: Story = {
  args: { steps: STEPS_3, current: 2 },
};

/** Two-step wizard — single connector. */
export const TwoSteps: Story = {
  args: { steps: STEPS_2, current: 0 },
};

/** Four-step wizard. */
export const FourSteps: Story = {
  args: { steps: STEPS_4, current: 1 },
};

/** Single step — no connectors. */
export const SingleStep: Story = {
  args: { steps: ['Only'], current: 0 },
};

/** Interactive: clicking a step updates current. */
function InteractiveDemo() {
  const [current, setCurrent] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StepDots steps={STEPS_4} current={current} onStepClick={setCurrent} />
      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
        Step {current + 1} of {STEPS_4.length}: {STEPS_4[current]}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

/** All states visible side by side (light + dark artboards). */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StepDots steps={STEPS_3} current={0} />
      <StepDots steps={STEPS_3} current={1} />
      <StepDots steps={STEPS_3} current={2} />
      <StepDots steps={STEPS_4} current={2} />
    </div>
  ),
};
