import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SettingsSlot } from './SettingsSlot.js';
import { SettingsModalContext } from './SettingsModalContext.js';

// ─── Stub modal context ───────────────────────────────────────────────────────

function WithModalCtx({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState('appearance');

  return (
    <SettingsModalContext.Provider value={{
      open,
      activePanel,
      openModal: () => { setOpen(true); },
      closeModal: () => { setOpen(false); },
      openPanel: (id) => { setActivePanel(id); setOpen(true); },
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          gap: '8px',
          background: 'var(--bg-surface)',
        }}
      >
        {children}
        {open && (
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            Modal open (panel: {activePanel})
          </span>
        )}
      </div>
    </SettingsModalContext.Provider>
  );
}

function withModalCtx(Story: React.ComponentType) {
  return <WithModalCtx><Story /></WithModalCtx>;
}

const meta: Meta<typeof SettingsSlot> = {
  title: 'Shell/SettingsSlot',
  component: SettingsSlot,
  decorators: [withModalCtx],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Gear button — click to open the shared SettingsModal. */
export const Default: Story = {};
