/**
 * Tests for the KanbanBoard family (KanbanBoard / KanbanColumn / PageChip).
 *
 * @tanstack/react-virtual is mocked: jsdom has no layout engine, so the real
 * virtualizer reports zero visible rows. The mock renders every row so tests
 * can assert on content. dnd-kit itself renders fine in jsdom (drag gestures
 * are not exercised here — onMove derivation is unit-tested via the handler).
 */
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 40,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        key: index,
        size: 40,
        start: index * 40,
      })),
  }),
}));

import { KanbanBoard, KanbanColumn, PageChip } from './index.js';
import { DndContext } from '@dnd-kit/core';
import type { KanbanColumnDef, KanbanItemDef } from './types.js';

interface Col extends KanbanColumnDef {
  id: string;
  label: string;
}
interface Item extends KanbanItemDef {
  id: string;
  columnId: string;
}

const columns: Col[] = [
  { id: 'train', label: 'Train' },
  { id: 'val', label: 'Validation' },
  { id: 'unassigned', label: 'Unassigned' },
];

function makeItems(): Map<string, Item[]> {
  return new Map<string, Item[]>([
    [
      'train',
      [
        { id: 'p1', columnId: 'train' },
        { id: 'p2', columnId: 'train' },
      ],
    ],
    ['val', [{ id: 'p3', columnId: 'val' }]],
    ['unassigned', []],
  ]);
}

describe('KanbanBoard', () => {
  it('renders one column per column def with header counts', () => {
    render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        onMove={vi.fn()}
        renderColumnHeader={({ column, itemCount }) => (
          <span>
            {column.label}: {itemCount}
          </span>
        )}
        renderChip={({ item }) => <span>{item.id}</span>}
      />,
    );
    expect(screen.getByText('Train: 2')).toBeInTheDocument();
    expect(screen.getByText('Validation: 1')).toBeInTheDocument();
    expect(screen.getByText('Unassigned: 0')).toBeInTheDocument();
  });

  it('renders every chip via renderChip', () => {
    render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        onMove={vi.fn()}
        renderColumnHeader={({ column }) => <span>{column.label}</span>}
        renderChip={({ item }) => <span>chip-{item.id}</span>}
      />,
    );
    expect(screen.getByText('chip-p1')).toBeInTheDocument();
    expect(screen.getByText('chip-p2')).toBeInTheDocument();
    expect(screen.getByText('chip-p3')).toBeInTheDocument();
  });

  it('passes isSelected through to renderChip for selected ids', () => {
    render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        selectedIds={new Set(['p2'])}
        onMove={vi.fn()}
        renderColumnHeader={({ column }) => <span>{column.label}</span>}
        renderChip={({ item, isSelected }) => (
          <span>{isSelected ? `sel-${item.id}` : item.id}</span>
        )}
      />,
    );
    expect(screen.getByText('sel-p2')).toBeInTheDocument();
    expect(screen.getByText('p1')).toBeInTheDocument();
  });

  it('emits onSelect with extend=false on a plain chip click', () => {
    const onSelect = vi.fn();
    render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        onMove={vi.fn()}
        onSelect={onSelect}
        renderColumnHeader={({ column }) => <span>{column.label}</span>}
        renderChip={({ item }) => <span>{item.id}</span>}
      />,
    );
    fireEvent.click(screen.getByText('p1'));
    expect(onSelect).toHaveBeenCalledWith({ itemId: 'p1', extend: false });
  });

  it('emits onSelect with extend=true when Shift is held', () => {
    const onSelect = vi.fn();
    render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        onMove={vi.fn()}
        onSelect={onSelect}
        renderColumnHeader={({ column }) => <span>{column.label}</span>}
        renderChip={({ item }) => <span>{item.id}</span>}
      />,
    );
    fireEvent.click(screen.getByText('p3'), { shiftKey: true });
    expect(onSelect).toHaveBeenCalledWith({ itemId: 'p3', extend: true });
  });

  it('applies a custom className to the board root', () => {
    const { container } = render(
      <KanbanBoard<Col, Item>
        columns={columns}
        items={makeItems()}
        className="datasets-board"
        onMove={vi.fn()}
        renderColumnHeader={({ column }) => <span>{column.label}</span>}
        renderChip={({ item }) => <span>{item.id}</span>}
      />,
    );
    expect(container.querySelector('.kanban-board.datasets-board')).not.toBeNull();
  });
});

describe('KanbanColumn', () => {
  it('forwards data-testid to the column root', () => {
    render(
      <DndContext>
        <KanbanColumn<Col, Item>
          column={{ id: 'train', label: 'Train' }}
          items={[{ id: 'p1', columnId: 'train' }]}
          data-testid="kanban-detection-column"
          renderHeader={({ column }) => <span>{column.label}</span>}
          renderChip={({ item }) => <span>{item.id}</span>}
        />
      </DndContext>,
    );
    expect(screen.getByTestId('kanban-detection-column')).toBeInTheDocument();
  });

  it('gives the scroll region role=listbox and an aria-label', () => {
    render(
      <DndContext>
        <KanbanColumn<Col, Item>
          column={{ id: 'val', label: 'Validation' }}
          items={[]}
          renderHeader={({ column }) => <span>{column.label}</span>}
          renderChip={({ item }) => <span>{item.id}</span>}
        />
      </DndContext>,
    );
    expect(screen.getByRole('listbox', { name: 'Validation' })).toBeInTheDocument();
  });
});

describe('PageChip', () => {
  it('renders children with role=option and selection/pending classes', () => {
    const { container } = render(
      <DndContext>
        <PageChip id="p1" isSelected isPending isDragging={false} data-testid="chip-p1">
          <span>content</span>
        </PageChip>
      </DndContext>,
    );
    const chip = screen.getByTestId('chip-p1');
    expect(chip).toHaveAttribute('role', 'option');
    expect(chip).toHaveTextContent('content');
    expect(container.querySelector('.kanban-chip--selected.kanban-chip--pending')).not.toBeNull();
  });

  it('applies kanban-chip--dragging when isDragging is true', () => {
    const { container } = render(
      <DndContext>
        <PageChip id="p1" isSelected={false} isPending={false} isDragging>
          <span>x</span>
        </PageChip>
      </DndContext>,
    );
    expect(container.querySelector('.kanban-chip--dragging')).not.toBeNull();
  });
});
