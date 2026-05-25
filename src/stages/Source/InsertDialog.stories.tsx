import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { InsertDialog } from './InsertDialog.js';
import type { InsertAnchorOption } from './InsertDialog.js';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const ANCHORS: InsertAnchorOption[] = [
  { value: 'p001.png', label: 'p001.png' },
  { value: 'p002.png', label: 'p002.png' },
  { value: 'p003.png', label: 'p003.png' },
  { value: 'p004.png', label: 'p004.png' },
  { value: 'p019.png', label: 'p019.png' },
  { value: 'p020.png', label: 'p020.png' },
];

const meta: Meta<typeof InsertDialog> = {
  title: 'Stages/Source/InsertDialog',
  component: InsertDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InsertDialog>;

// ─── Open (no anchor preselected) ────────────────────────────────────────────

export const Open: Story = {
  name: 'Open — no default anchor',
  render: () => (
    <InsertDialog
      open={true}
      onOpenChange={() => undefined}
      anchorOptions={ANCHORS}
      onInsert={() => undefined}
    />
  ),
};

// ─── Closed ───────────────────────────────────────────────────────────────────

export const Closed: Story = {
  name: 'Closed — dialog not visible',
  render: () => (
    <div style={{ padding: 24, color: 'var(--ink-2)', fontSize: 13 }}>
      Dialog is closed — no content rendered.
      <InsertDialog
        open={false}
        onOpenChange={() => undefined}
        anchorOptions={ANCHORS}
        onInsert={() => undefined}
      />
    </div>
  ),
};

// ─── WithDefaultAnchor ────────────────────────────────────────────────────────

export const WithDefaultAnchor: Story = {
  name: 'With default anchor (p019.png preselected)',
  render: () => (
    <InsertDialog
      open={true}
      onOpenChange={() => undefined}
      anchorOptions={ANCHORS}
      defaultAnchor="p019.png"
      onInsert={() => undefined}
    />
  ),
};

// ─── FullForm (state-bound) ───────────────────────────────────────────────────

const FullFormStory = () => {
  const [open, setOpen] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div>
      {!open && (
        <div style={{ padding: 24 }}>
          <button type="button" onClick={() => setOpen(true)}>
            Re-open dialog
          </button>
          {submitted && (
            <p style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-2)' }}>
              Submitted — check console for details.
            </p>
          )}
        </div>
      )}
      <InsertDialog
        open={open}
        onOpenChange={setOpen}
        anchorOptions={ANCHORS}
        defaultAnchor="p001.png"
        onInsert={s => {
          setSubmitted(true);
          setOpen(false);
          void s; // available for debugging in browser console via React DevTools
        }}
      />
    </div>
  );
};

export const FullForm: Story = {
  name: 'Full form — state-bound with submit',
  render: () => <FullFormStory />,
};

// ─── OverCharLimit ────────────────────────────────────────────────────────────

const OverCharLimitStory = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <InsertDialog
      open={open}
      onOpenChange={setOpen}
      anchorOptions={ANCHORS}
      defaultAnchor="p002.png"
      onInsert={() => undefined}
    />
  );
};

export const OverCharLimit: Story = {
  name: 'Over char limit — counter turns red, Insert disabled',
  render: () => <OverCharLimitStory />,
};
