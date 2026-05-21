import type * as React from 'react';

/** Minimum shape any column definition must satisfy. */
export interface KanbanColumnDef {
  id: string;
  label: string;
}

/** Minimum shape any item must satisfy. */
export interface KanbanItemDef {
  id: string;
  columnId: string;
}

/** Emitted by onMove. */
export interface KanbanMoveEvent<
  TColumnId extends string,
  TItemId extends string,
> {
  itemIds: TItemId[];
  fromColumnId: TColumnId | null;
  toColumnId: TColumnId;
  via: 'pointer' | 'keyboard';
}

/** Emitted by onSelect on chip click. */
export interface KanbanSelectEvent<TItemId extends string> {
  itemId: TItemId;
  extend: boolean;
}

/** Passed to renderColumnHeader. */
export interface KanbanColumnHeaderProps<TColumn extends KanbanColumnDef> {
  column: TColumn;
  itemCount: number;
}

/** Passed to renderChip. */
export interface KanbanChipRenderProps<TItem extends KanbanItemDef> {
  item: TItem;
  isSelected: boolean;
  isPending: boolean;
}

export interface KanbanBoardProps<
  TColumn extends KanbanColumnDef,
  TItem extends KanbanItemDef,
> {
  columns: TColumn[];
  items: Map<TColumn['id'], TItem[]>;
  onMove: (event: KanbanMoveEvent<TColumn['id'], TItem['id']>) => void;
  renderColumnHeader: (props: KanbanColumnHeaderProps<TColumn>) => React.ReactNode;
  renderChip: (props: KanbanChipRenderProps<TItem>) => React.ReactNode;
  selectedIds?: ReadonlySet<TItem['id']>;
  onSelect?: (event: KanbanSelectEvent<TItem['id']>) => void;
  className?: string;
}

export interface KanbanColumnProps<
  TColumn extends KanbanColumnDef,
  TItem extends KanbanItemDef,
> {
  column: TColumn;
  items: TItem[];
  renderHeader: (props: KanbanColumnHeaderProps<TColumn>) => React.ReactNode;
  renderChip: (props: KanbanChipRenderProps<TItem>) => React.ReactNode;
  selectedIds?: ReadonlySet<TItem['id']>;
  onSelect?: (event: KanbanSelectEvent<TItem['id']>) => void;
  'data-testid'?: string;
  className?: string;
}

export interface PageChipProps {
  id: string;
  isSelected: boolean;
  isPending: boolean;
  isDragging: boolean;
  children: React.ReactNode;
  /**
   * Optional selection callback. KanbanBoard wires this so a click (or
   * Space/Enter) on the chip emits the board's `onSelect`. `extend` is true
   * when Shift is held. Standalone PageChip consumers may omit it.
   */
  onSelect?: (extend: boolean) => void;
  'data-testid'?: string;
  className?: string;
}
