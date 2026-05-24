/**
 * BlockTypePickerPanel — right-drawer type picker for PageWorkbench.
 *
 * Phase 2 M2 — spec §6.2 line 345.
 *
 * Renders a titled `<aside>` containing a header and a TypeGrid of block
 * type options. Fully controlled: callers supply `selectedType` and `onSelect`.
 */
import * as React from 'react';
import { TypeGrid } from './TypeGrid.js';
import { BLOCK_TYPE_PICKER_PANEL } from '../../testids/index.js';

// ── Public types ──────────────────────────────────────────────────────────────

export interface BlockTypeOption {
  /** Stable id (e.g. 'paragraph','heading','footnote','illustration'). */
  value: string;
  /** Display label. */
  label: string;
  /** Optional icon name from the Icon dispatcher. */
  icon?: string;
  /** Optional short description shown on hover/under-label. */
  description?: string;
}

export interface BlockTypePickerPanelProps {
  /** Available block types. */
  types: ReadonlyArray<BlockTypeOption>;
  /** Currently-selected type value (controlled). */
  selectedType?: string;
  onSelect: (value: string) => void;
  /** Optional header label. Defaults to "Block type". */
  title?: string;
  'data-testid'?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * BlockTypePickerPanel — right-drawer chrome for block type re-assignment.
 *
 * Slot-based: the set of available types is supplied via the `types` prop.
 * The panel is fully controlled; consumers own selected state.
 */
export const BlockTypePickerPanel = React.forwardRef<
  HTMLElement,
  BlockTypePickerPanelProps
>(function BlockTypePickerPanel(
  {
    types,
    selectedType,
    onSelect,
    title,
    'data-testid': testId = BLOCK_TYPE_PICKER_PANEL,
  },
  ref,
) {
  const headingId = React.useId();

  return (
    <aside
      ref={ref}
      className="block-type-picker-panel"
      aria-labelledby={headingId}
      data-testid={testId}
    >
      <header className="block-type-picker-panel__header">
        <h2
          id={headingId}
          className="block-type-picker-panel__title"
        >
          {title ?? 'Block type'}
        </h2>
      </header>

      <div className="block-type-picker-panel__body">
        <TypeGrid
          types={types}
          selectedType={selectedType}
          onSelect={onSelect}
        />
      </div>
    </aside>
  );
});

BlockTypePickerPanel.displayName = 'BlockTypePickerPanel';
