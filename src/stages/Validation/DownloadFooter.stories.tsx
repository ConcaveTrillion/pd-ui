/**
 * DownloadFooter Storybook stories.
 *
 * Stories:
 *   1. Pass  — all checks green; primary Download button
 *   2. Warn  — warnings present; ghost Download anyway + primary Fix & rebuild
 *   3. Error — errors present; Download disabled + primary Fix all (N)
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DownloadFooter } from './DownloadFooter.js';

const meta: Meta<typeof DownloadFooter> = {
  title: 'Stages/Validation/DownloadFooter',
  component: DownloadFooter,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, border: '1px solid var(--border-1)', borderRadius: 6 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DownloadFooter>;

// ── Pass ──────────────────────────────────────────────────────────────────────

export const Pass: Story = {
  args: {
    state: 'pass',
    onDownload: () => console.log('download'),
  },
};

// ── Warn ──────────────────────────────────────────────────────────────────────

export const Warn: Story = {
  args: {
    state: 'warn',
    onDownload: () => console.log('download anyway'),
    onFix: () => console.log('fix & rebuild'),
  },
};

// ── Error ─────────────────────────────────────────────────────────────────────

export const Error: Story = {
  name: 'Error',
  args: {
    state: 'error',
    fixableCount: 3,
    onFix: () => console.log('fix all'),
  },
};
