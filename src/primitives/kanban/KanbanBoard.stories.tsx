import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { KanbanBoard } from './KanbanBoard.js';
import { Badge } from '../Badge.js';
import type { KanbanColumnDef, KanbanItemDef } from './types.js';

interface DatasetColumn extends KanbanColumnDef {
  id: string;
  label: string;
}
interface DatasetPage extends KanbanItemDef {
  id: string;
  columnId: string;
}

const columns: DatasetColumn[] = [
  { id: 'train', label: 'Train' },
  { id: 'val', label: 'Validation' },
  { id: 'unassigned', label: 'Unassigned' },
];

function seed(): Map<string, DatasetPage[]> {
  const mk = (col: string, n: number, offset: number): DatasetPage[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `page-${String(offset + i)}`,
      columnId: col,
    }));
  return new Map<string, DatasetPage[]>([
    ['train', mk('train', 12, 0)],
    ['val', mk('val', 4, 100)],
    ['unassigned', mk('unassigned', 30, 200)],
  ]);
}

function BoardHarness(): React.ReactElement {
  const [items, setItems] = React.useState<Map<string, DatasetPage[]>>(seed);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlySet<string>>(new Set());

  return (
    <div style={{ height: 420, display: 'flex' }}>
      <KanbanBoard<DatasetColumn, DatasetPage>
        columns={columns}
        items={items}
        selectedIds={selectedIds}
        onSelect={({ itemId }) => {
          setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
          });
        }}
        onMove={({ itemIds, toColumnId }) => {
          setItems((prev) => {
            const moving = new Set(itemIds);
            const next = new Map<string, DatasetPage[]>();
            for (const col of columns) {
              next.set(
                col.id,
                (prev.get(col.id) ?? []).filter((p) => !moving.has(p.id)),
              );
            }
            const dest = next.get(toColumnId) ?? [];
            for (const id of itemIds) dest.push({ id, columnId: toColumnId });
            next.set(toColumnId, dest);
            return next;
          });
        }}
        renderColumnHeader={({ column, itemCount }) => (
          <>
            <span>{column.label}</span>
            <Badge>{itemCount}</Badge>
          </>
        )}
        renderChip={({ item, isSelected }) => (
          <span style={{ fontWeight: isSelected ? 600 : 400 }}>{item.id}</span>
        )}
      />
    </div>
  );
}

const meta: Meta<typeof KanbanBoard> = {
  title: 'Primitives/KanbanBoard',
  component: KanbanBoard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DatasetBoard: Story = {
  render: () => <BoardHarness />,
};

export const LightTheme: Story = {
  render: () => (
    <div data-theme="light">
      <BoardHarness />
    </div>
  ),
};
