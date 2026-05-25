import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageImageCanvas } from './PageImageCanvas.js';
import { BBoxLayer } from './layers/BBoxLayer.js';
import type { CanvasPage, CanvasWord, SelectionState } from './types.js';

// ── Fixture data ──────────────────────────────────────────────────────────────

const FIXTURE_PAGE: CanvasPage = {
  width: 600,
  height: 400,
  page_index: 0,
  name: 'page-001',
};

const FIXTURE_WORDS: CanvasWord[] = [
  {
    text: 'Hello',
    bounding_box: { top_left: { x: 50, y: 60 }, bottom_right: { x: 140, y: 90 } },
    ocr_confidence: 0.98,
  },
  {
    text: 'World',
    bounding_box: { top_left: { x: 155, y: 60 }, bottom_right: { x: 255, y: 90 } },
    ocr_confidence: 0.95,
  },
  {
    text: 'from',
    bounding_box: { top_left: { x: 270, y: 60 }, bottom_right: { x: 340, y: 90 } },
    ocr_confidence: 0.91,
  },
  {
    text: 'Storybook',
    bounding_box: { top_left: { x: 355, y: 60 }, bottom_right: { x: 520, y: 90 } },
    ocr_confidence: 0.88,
  },
  {
    text: 'A second line of text for this fixture page',
    bounding_box: { top_left: { x: 50, y: 120 }, bottom_right: { x: 450, y: 155 } },
    ocr_confidence: 0.76,
  },
  {
    text: 'Low confidence word',
    bounding_box: { top_left: { x: 50, y: 200 }, bottom_right: { x: 250, y: 230 } },
    ocr_confidence: 0.42,
  },
];

// Blank white PNG (1x1) as a placeholder image
const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageImageCanvas> = {
  title: 'Canvas/PageImageCanvas',
  component: PageImageCanvas,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** No overlay slots — just the page image (blank placeholder). */
export const NoOverlay: Story = {
  render: () => (
    <div style={{ width: '700px', height: '500px', background: 'var(--bg)' }}>
      <PageImageCanvas src={BLANK_PNG} page={FIXTURE_PAGE} words={FIXTURE_WORDS} />
    </div>
  ),
};

/** BBoxLayer overlay — draws a coloured rect over each word. */
export const WithBBoxOverlay: Story = {
  render: () => (
    <div style={{ width: '700px', height: '500px', background: 'var(--bg)' }}>
      <PageImageCanvas src={BLANK_PNG} page={FIXTURE_PAGE} words={FIXTURE_WORDS}>
        {{
          overlay: (p) => (
            <BBoxLayer {...p} fill="rgba(93,159,223,0.15)" stroke="var(--accent, #5d9fdf)" />
          ),
        }}
      </PageImageCanvas>
    </div>
  ),
};

/** With controlled external selection state. */
export const WithSelection: Story = {
  render: function WithSelectionStory() {
    const [sel, setSel] = useState<SelectionState>({ ids: new Set<string>() });

    return (
      <div style={{ width: '700px', height: '520px', background: 'var(--bg)' }}>
        <div style={{ height: '500px' }}>
          <PageImageCanvas
            src={BLANK_PNG}
            page={FIXTURE_PAGE}
            words={FIXTURE_WORDS}
            selection={sel}
            onSelectionChange={setSel}
          >
            {{
              overlay: (p) => (
                <BBoxLayer
                  {...p}
                  fill="rgba(93,159,223,0.15)"
                  stroke={p.isSelected ? 'var(--exact, #48b878)' : 'var(--accent, #5d9fdf)'}
                  selectedStrokeWidth={2}
                />
              ),
            }}
          </PageImageCanvas>
        </div>
        <div style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--ink-3)' }}>
          Selected: {[...sel.ids].join(', ') || 'none'} — click to select, drag to marquee
        </div>
      </div>
    );
  },
};
