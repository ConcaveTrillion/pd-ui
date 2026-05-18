import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SettingsSlot } from './SettingsSlot.js';
import { UIPrefsStoreProvider } from '../stores/StoreContexts.js';
import { createUIPrefsStore } from '../stores/createUIPrefsStore.js';
import type { UIPrefsConfig } from './types.js';

const STUB_PREFS_CONFIG: UIPrefsConfig = {
  load: () =>
    Promise.resolve({
      theme: 'dark',
      density: 'normal',
      fontScale: 1.0,
    }),
  persistCommon: () => Promise.resolve(),
  persistApp: () => Promise.resolve(),
};

function withStore(Story: React.ComponentType) {
  const store = createUIPrefsStore(STUB_PREFS_CONFIG);
  return (
    <UIPrefsStoreProvider value={store}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          gap: '8px',
          background: 'var(--bg-surface)',
        }}
      >
        <Story />
      </div>
    </UIPrefsStoreProvider>
  );
}

const meta: Meta<typeof SettingsSlot> = {
  title: 'Shell/SettingsSlot',
  component: SettingsSlot,
  decorators: [withStore],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Gear button — click to open the settings popover. */
export const Default: Story = {};
