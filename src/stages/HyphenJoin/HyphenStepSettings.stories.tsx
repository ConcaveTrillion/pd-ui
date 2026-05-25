import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  HyphenStepSettings,
  HYPHEN_STEP_SETTINGS_DEFAULT,
  type HyphenSettings,
} from './HyphenStepSettings.js';

const meta: Meta<typeof HyphenStepSettings> = {
  title: 'Stages/HyphenJoin/HyphenStepSettings',
  component: HyphenStepSettings,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof HyphenStepSettings>;

export const DefaultSettings: Story = {
  args: {
    settings: HYPHEN_STEP_SETTINGS_DEFAULT,
    onChange: () => {},
  },
};

export const ManyRules: Story = {
  args: {
    settings: {
      ...HYPHEN_STEP_SETTINGS_DEFAULT,
      rules: [
        { id: 'always-join-beginnings', label: 'Always-join beginnings', enabled: true },
        { id: 'always-join-endings', label: 'Always-join endings', enabled: true },
        { id: 'always-join-words', label: 'Always-join words', enabled: false },
        { id: 'always-keep-hyphens', label: 'Always-keep hyphens', enabled: true },
        { id: 'cross-page', label: 'Cross-page hyphens', enabled: false },
        { id: 'dash-mismatch', label: 'Dash-mismatch flag', enabled: true },
        { id: 'author-style', label: 'Author-style override', enabled: true },
        { id: 'book-overrides', label: 'Book-level overrides', enabled: false },
      ],
    },
    onChange: () => {},
  },
};

export function Interactive(): React.ReactElement {
  const [settings, setSettings] = React.useState<HyphenSettings>(HYPHEN_STEP_SETTINGS_DEFAULT);

  return (
    <div style={{ maxWidth: 720 }}>
      <HyphenStepSettings
        settings={settings}
        onChange={setSettings}
        data-testid="hyphen-step-settings-interactive"
      />
    </div>
  );
}
Interactive.storyName = 'Interactive';
