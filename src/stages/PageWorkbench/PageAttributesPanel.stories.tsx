/**
 * PageAttributesPanel Storybook stories.
 *
 * Stories:
 *   1. Default — default title + mixed attrs (text / number / select / readOnly)
 *   2. Mixed — text + number + select in an expanded form
 *   3. WithReadOnly — multiple readOnly attrs alongside editable ones
 *   4. Empty — no attrs
 *   5. Controlled — state-bound; edits reflect live in the panel
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageAttributesPanel } from './PageAttributesPanel.js';
import type { PageAttributesPanelProps } from './PageAttributesPanel.js';
import type { PageAttribute } from './PageAttributesBar.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MIXED_ATTRS: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '2.5' },
  { id: 'dpi', label: 'DPI', value: '300', editor: 'number' },
  {
    id: 'lang',
    label: 'Lang',
    value: 'en',
    editor: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'es', label: 'Spanish' },
    ],
  },
  { id: 'quality', label: 'Quality', value: '92', editor: 'number' },
  { id: 'color', label: 'Color', value: 'grayscale' },
];

const WITH_READONLY_ATTRS: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '1.2' },
  { id: 'source', label: 'Source', value: 'scan_2024', readOnly: true },
  { id: 'dpi', label: 'DPI', value: '600', editor: 'number' },
  { id: 'pages', label: 'Pages', value: '247', readOnly: true },
  {
    id: 'lang',
    label: 'Lang',
    value: 'en',
    editor: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
    ],
  },
];

// ── Controlled wrapper ────────────────────────────────────────────────────────

function Controlled({ attrs: initialAttrs, ...rest }: PageAttributesPanelProps) {
  const initial: PageAttribute[] = initialAttrs.map((a) => ({ ...a }));
  const [attrs, setAttrs] = useState<PageAttribute[]>(initial);

  const handleChange = (id: string, nextValue: string) => {
    setAttrs((prev: PageAttribute[]) =>
      prev.map((a: PageAttribute): PageAttribute => (a.id === id ? { ...a, value: nextValue } : a)),
    );
  };

  return <PageAttributesPanel {...rest} attrs={attrs} onChange={handleChange} />;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageAttributesPanel> = {
  title: 'Stages/PageWorkbench/PageAttributesPanel',
  component: PageAttributesPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageAttributesPanel>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <Controlled {...args} attrs={MIXED_ATTRS} onChange={() => {}} />,
  name: 'Default',
};

export const Mixed: Story = {
  render: (args) => (
    <Controlled {...args} attrs={MIXED_ATTRS} onChange={() => {}} title="Text + Number + Select" />
  ),
  name: 'Mixed (text + number + select)',
};

export const WithReadOnly: Story = {
  render: (args) => <Controlled {...args} attrs={WITH_READONLY_ATTRS} onChange={() => {}} />,
  name: 'With ReadOnly',
};

export const Empty: Story = {
  render: (args) => <PageAttributesPanel {...args} attrs={[]} onChange={() => {}} />,
  name: 'Empty',
};

export const Controlled_: Story = {
  render: (args) => <Controlled {...args} attrs={MIXED_ATTRS} onChange={() => {}} />,
  name: 'Controlled (state-bound)',
};
