/**
 * PageAttributesBar Storybook stories.
 *
 * Stories:
 *   1. Default — 5 mixed attrs (text / number / select)
 *   2. Collapsed — same attrs but starts collapsed
 *   3. WithReadOnly — includes a read-only chip
 *   4. WithSelectEditor — focuses on the select-mode attr
 *   5. Empty — no attrs
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageAttributesBar } from './PageAttributesBar.js';
import type { PageAttribute, PageAttributesBarProps } from './PageAttributesBar.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIVE_ATTRS: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '2.5' },
  { id: 'dpi', label: 'DPI', value: '300', editor: 'number' },
  { id: 'lang', label: 'Lang', value: 'en', editor: 'select', options: [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'es', label: 'Spanish' },
  ]},
  { id: 'quality', label: 'Quality', value: '92', editor: 'number' },
  { id: 'color', label: 'Color', value: 'grayscale' },
];

const WITH_READONLY: PageAttribute[] = [
  { id: 'skew', label: 'Skew', value: '1.2' },
  { id: 'source', label: 'Source', value: 'scan_2024', readOnly: true },
  { id: 'dpi', label: 'DPI', value: '600', editor: 'number' },
  { id: 'pages', label: 'Pages', value: '247', readOnly: true },
];

// ── Controlled wrapper ────────────────────────────────────────────────────────

function Controlled({ attrs: initialAttrs, ...rest }: PageAttributesBarProps) {
  const [attrs, setAttrs] = useState<PageAttribute[]>(initialAttrs as PageAttribute[]);

  const handleChange = (id: string, nextValue: string) => {
    setAttrs((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value: nextValue } : a)),
    );
  };

  return <PageAttributesBar {...rest} attrs={attrs} onChange={handleChange} />;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageAttributesBar> = {
  title: 'Stages/PageWorkbench/PageAttributesBar',
  component: PageAttributesBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageAttributesBar>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <Controlled {...args} attrs={FIVE_ATTRS} onChange={() => {}} />,
  name: 'Default (5 attrs)',
};

export const Collapsed: Story = {
  render: (args) => (
    <Controlled {...args} attrs={FIVE_ATTRS} onChange={() => {}} defaultCollapsed />
  ),
  name: 'Collapsed',
};

export const WithReadOnly: Story = {
  render: (args) => (
    <Controlled {...args} attrs={WITH_READONLY} onChange={() => {}} />
  ),
  name: 'With ReadOnly',
};

export const WithSelectEditor: Story = {
  render: (args) => (
    <Controlled
      {...args}
      attrs={[
        { id: 'lang', label: 'Lang', value: 'en', editor: 'select', options: [
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
        ]},
        { id: 'script', label: 'Script', value: 'latin', editor: 'select', options: [
          { value: 'latin', label: 'Latin' },
          { value: 'cyrillic', label: 'Cyrillic' },
          { value: 'arabic', label: 'Arabic' },
        ]},
      ]}
      onChange={() => {}}
    />
  ),
  name: 'With Select Editor',
};

export const Empty: Story = {
  render: (args) => <PageAttributesBar {...args} attrs={[]} onChange={() => {}} />,
  name: 'Empty',
};
