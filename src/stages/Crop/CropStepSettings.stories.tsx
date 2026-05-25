import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CropStepSettings, CROP_SETTINGS_DEFAULT, type CropSettings } from './CropStepSettings.js';

const meta: Meta<typeof CropStepSettings> = {
  title: 'Stages/Crop/CropStepSettings',
  component: CropStepSettings,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CropStepSettings>;

export const Default: Story = {
  args: {
    settings: CROP_SETTINGS_DEFAULT,
    onChange: () => {},
    stale: false,
  },
};

export const ManualStrategy: Story = {
  args: {
    settings: {
      ...CROP_SETTINGS_DEFAULT,
      strategy: 'manual',
      marginSlackPct: 12,
      symmetryGuard: false,
    },
    onChange: () => {},
    stale: false,
  },
};

export const StaleSettings: Story = {
  args: {
    settings: {
      ...CROP_SETTINGS_DEFAULT,
      strategy: 'mlModel',
      marginSlackPct: 16,
      autoAccept: true,
    },
    onChange: () => {},
    stale: true,
    onRerun: () => {},
  },
};

export function Interactive(): React.ReactElement {
  const [settings, setSettings] = React.useState<CropSettings>(CROP_SETTINGS_DEFAULT);
  const [stale, setStale] = React.useState(false);

  function handleChange(next: CropSettings) {
    setSettings(next);
    setStale(true);
  }

  function handleRerun() {
    setStale(false);
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <CropStepSettings
        settings={settings}
        onChange={handleChange}
        stale={stale}
        onRerun={handleRerun}
        data-testid="crop-step-settings-interactive"
      />
    </div>
  );
}
Interactive.storyName = 'Interactive';
