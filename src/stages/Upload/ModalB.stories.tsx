import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ModalB } from './ModalB.js';

const meta: Meta<typeof ModalB> = {
  title: 'Stages/Upload/ModalB',
  component: ModalB,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalB>;

// ─── Open ─────────────────────────────────────────────────────────────────────

export const Open: Story = {
  name: 'Open — drop zone visible',
  render: () => (
    <ModalB
      open={true}
      onOpenChange={() => undefined}
      onFiles={() => undefined}
    />
  ),
};

// ─── Closed (interactive trigger) ────────────────────────────────────────────

const ClosedStory = () => {
  const [open, setOpen] = React.useState(false);
  const [received, setReceived] = React.useState<string[]>([]);

  const handleFiles = (files: FileList | File[]) => {
    const names = Array.from(files).map(f => f.name);
    setReceived(prev => [...prev, ...names]);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          background: 'var(--accent)',
          color: 'var(--ink-1)',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Open Upload Modal
      </button>

      {received.length > 0 && (
        <ul
          style={{
            marginTop: 16,
            fontSize: 12,
            color: 'var(--ink-2)',
            paddingLeft: 16,
          }}
        >
          {received.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      )}

      <ModalB
        open={open}
        onOpenChange={setOpen}
        onFiles={handleFiles}
      />
    </div>
  );
};

export const Closed: Story = {
  name: 'Closed — interactive trigger',
  render: () => <ClosedStory />,
};
