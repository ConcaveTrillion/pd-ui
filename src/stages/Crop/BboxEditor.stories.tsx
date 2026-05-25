/**
 * BboxEditor stories — Crop stage interactive bbox editor.
 */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { BboxEditor } from './BboxEditor.js';
import type { BboxEditorPage, BboxMargins, BboxUnit, BboxScope } from './BboxEditor.js';

const meta: Meta<typeof BboxEditor> = {
  title: 'Stages/Crop/BboxEditor',
  component: BboxEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BboxEditor>;

// ── Shared fixtures ─────────────────────────────────────────────────────────

const SAMPLE_PAGE: BboxEditorPage = {
  id: 'page-1',
  pageNumber: 1,
  imageUrl: 'https://placehold.co/800x1100/1a1a2e/white?text=Page+1',
  pageWidth: 800,
  pageHeight: 1100,
  defaultMargins: { top: 40, right: 40, bottom: 40, left: 40 },
};

const DEFAULT_MARGINS: BboxMargins = { top: 40, right: 40, bottom: 40, left: 40 };

const DELTA_MARGINS: BboxMargins = { top: 60, right: 35, bottom: 40, left: 25 };

// ── Stories ─────────────────────────────────────────────────────────────────

export const DefaultMargins: Story = {
  name: 'DefaultMargins',
  args: {
    page: SAMPLE_PAGE,
    margins: DEFAULT_MARGINS,
    unit: 'px',
    scope: 'thisPage',
  },
};

export const WithDelta: Story = {
  name: 'WithDelta',
  args: {
    page: SAMPLE_PAGE,
    margins: DELTA_MARGINS,
    unit: 'px',
    scope: 'thisPage',
  },
};

export const PercentUnit: Story = {
  name: 'PercentUnit',
  args: {
    page: SAMPLE_PAGE,
    margins: { top: 5, right: 5, bottom: 5, left: 5 },
    unit: 'percent',
    scope: 'thisPage',
  },
};

export const SelectedScope: Story = {
  name: 'SelectedScope',
  args: {
    page: SAMPLE_PAGE,
    margins: DELTA_MARGINS,
    unit: 'px',
    scope: 'selectedN',
    selectedCount: 7,
  },
};

export const FlaggedScope: Story = {
  name: 'FlaggedScope',
  args: {
    page: SAMPLE_PAGE,
    margins: DEFAULT_MARGINS,
    unit: 'px',
    scope: 'allFlagged',
    flaggedCount: 23,
  },
};

export const Interactive: StoryObj = {
  name: 'Interactive',
  render: function InteractiveRender() {
    const [margins, setMargins] = React.useState<BboxMargins>(DELTA_MARGINS);
    const [unit, setUnit] = React.useState<BboxUnit>('px');
    const [scope, setScope] = React.useState<BboxScope>('thisPage');

    return (
      <BboxEditor
        page={SAMPLE_PAGE}
        margins={margins}
        onMarginsChange={setMargins}
        unit={unit}
        onUnitChange={setUnit}
        scope={scope}
        onScopeChange={setScope}
        selectedCount={4}
        flaggedCount={11}
        onApply={() => {
          /* Apply triggered with margins, unit, scope — handled by consumer */
        }}
      />
    );
  },
};
