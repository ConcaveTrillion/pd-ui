import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckRow } from './CheckRow.js';
import type { CheckRowCheck } from './CheckRow.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const fewPages: CheckRowCheck['affectedPages'] = [
  { id: 'p1', prefix: 'p001' },
  { id: 'p2', prefix: 'p002' },
  { id: 'p3', prefix: 'p003' },
];

const manyPages: CheckRowCheck['affectedPages'] = Array.from({ length: 12 }, (_, i) => ({
  id: `p${i + 1}`,
  prefix: `p${String(i + 1).padStart(3, '0')}`,
}));

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof CheckRow> = {
  title: 'Stages/Validation/CheckRow',
  component: CheckRow,
  parameters: {
    layout: 'padded',
  },
  args: {
    onToggle: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof CheckRow>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * A warn check row in its default collapsed state.
 * Up to 5 affected page chips are visible; "+N more" badge appears when there are more.
 */
export const Collapsed: Story = {
  args: {
    check: {
      id: 'check-hyphen',
      name: 'Hyphen consistency',
      state: 'warn',
      affectedPages: fewPages,
    },
    expanded: false,
  },
};

/**
 * The same check row expanded — shows the full affected-pages list in a `<ul>`.
 */
export const Expanded: Story = {
  args: {
    check: {
      id: 'check-hyphen',
      name: 'Hyphen consistency',
      state: 'warn',
      affectedPages: fewPages,
    },
    expanded: true,
  },
};

/**
 * A check with 12 affected pages in collapsed state.
 * Shows 5 chips + "+7 more" overflow badge.
 */
export const ManyPages: Story = {
  args: {
    check: {
      id: 'check-chars',
      name: 'Character validation',
      state: 'error',
      affectedPages: manyPages,
    },
    expanded: false,
  },
};

/**
 * Showcase of all five check states side by side.
 */
export const AllStates: Story = {
  render: (args) => {
    const states: Array<CheckRowCheck['state']> = ['pass', 'warn', 'error', 'running', 'skip'];
    return (
      <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
        {states.map((state, idx) => (
          <CheckRow
            key={state}
            {...args}
            check={{
              id: `check-${state}`,
              name: `${state.charAt(0).toUpperCase()}${state.slice(1)} check`,
              state,
              ...(state !== 'pass' && state !== 'running' ? { affectedPages: fewPages } : {}),
            }}
            expanded={false}
            lastRow={idx === states.length - 1}
          />
        ))}
      </div>
    );
  },
};
