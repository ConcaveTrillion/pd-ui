/**
 * BlockTypePickerPanel Storybook stories.
 *
 * Stories:
 *   1. Default    — 5 types, no selection
 *   2. Empty      — zero types
 *   3. WithIcons  — types have icon names
 *   4. WithDescriptions — types have descriptions
 *   5. ManyTypes  — 12 types (3-column grid wraps naturally)
 *   6. CustomTitle — custom title prop
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BlockTypePickerPanel } from './BlockTypePickerPanel.js';
import type { BlockTypeOption } from './BlockTypePickerPanel.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const STRUCTURAL: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'block-quote', label: 'Block quote' },
  { value: 'footnote', label: 'Footnote' },
  { value: 'illustration', label: 'Illustration' },
];

const WITH_ICONS: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph', icon: 'fileText' },
  { value: 'heading', label: 'Heading', icon: 'fileText' },
  { value: 'block-quote', label: 'Block quote', icon: 'fileText' },
  { value: 'illustration', label: 'Illustration', icon: 'image' },
  { value: 'footnote', label: 'Footnote', icon: 'fileText' },
];

const WITH_DESCRIPTIONS: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph', description: 'Body text block' },
  { value: 'heading', label: 'Heading', description: 'Section title' },
  { value: 'block-quote', label: 'Block quote', description: 'Extended quotation' },
  { value: 'footnote', label: 'Footnote', description: 'Bottom-of-page note' },
  { value: 'illustration', label: 'Illustration', description: 'Image or figure' },
  { value: 'caption', label: 'Caption', description: 'Figure caption text' },
];

const MANY_TYPES: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'subheading', label: 'Subheading' },
  { value: 'block-quote', label: 'Block quote' },
  { value: 'footnote', label: 'Footnote' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'caption', label: 'Caption' },
  { value: 'table', label: 'Table' },
  { value: 'list', label: 'List' },
  { value: 'running-head', label: 'Running head' },
  { value: 'page-number', label: 'Page number' },
  { value: 'ornament', label: 'Ornament' },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof BlockTypePickerPanel> = {
  title: 'Stages/PageWorkbench/BlockTypePickerPanel',
  component: BlockTypePickerPanel,
  parameters: {
    layout: 'centered',
  },
  args: {
    types: STRUCTURAL,
    onSelect: (value: string) => {
      console.log('onSelect', value);
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlockTypePickerPanel>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    types: STRUCTURAL,
  },
};

export const Empty: Story = {
  args: {
    types: [],
  },
};

export const WithSelection: Story = {
  args: {
    types: STRUCTURAL,
    selectedType: 'block-quote',
  },
};

export const WithIcons: Story = {
  args: {
    types: WITH_ICONS,
    selectedType: 'paragraph',
  },
};

export const WithDescriptions: Story = {
  args: {
    types: WITH_DESCRIPTIONS,
    selectedType: 'heading',
  },
};

export const ManyTypes: Story = {
  args: {
    types: MANY_TYPES,
    selectedType: 'table',
  },
};

export const CustomTitle: Story = {
  args: {
    types: STRUCTURAL,
    title: 'Reassign layout type',
    selectedType: 'illustration',
  },
};
