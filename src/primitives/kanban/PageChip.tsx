import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../cn.js';
import type { PageChipProps } from './types.js';

/**
 * PageChip — the built-in chip shell rendered inside each virtualized row.
 * Supplies the dnd-kit drag handle, selection highlight, and pending-move
 * affordance. Depends on a dnd-kit `DndContext` ancestor being present
 * (KanbanBoard provides one).
 */
export const PageChip = React.forwardRef<HTMLDivElement, PageChipProps>(
  function PageChip(
    {
      id,
      isSelected,
      isPending,
      isDragging,
      children,
      className,
      onSelect,
      ...rest
    },
    forwardedRef,
  ) {
    const sortable = useSortable({ id });
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = sortable;

    /* dnd-kit's sortable attributes default `role` to "button" and set their
       own `tabIndex`; the chip is a `role="option"` instead, so drop both and
       keep only the drag-relevant aria attributes (aria-describedby, etc.). */
    const {
      role: _dndRole,
      tabIndex: _dndTabIndex,
      'aria-pressed': _dndPressed,
      ...dragAttributes
    } = attributes;
    void _dndRole;
    void _dndTabIndex;
    void _dndPressed;

    const dragging = isDragging || sortable.isDragging;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        setNodeRef(node);
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [setNodeRef, forwardedRef],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onSelect(event.shiftKey);
        }
      },
      [onSelect],
    );

    return (
      <div
        ref={setRefs}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        data-testid={rest['data-testid']}
        className={cn(
          'kanban-chip',
          isSelected && 'kanban-chip--selected',
          isPending && 'kanban-chip--pending',
          dragging && 'kanban-chip--dragging',
          className,
        )}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        onClick={
          onSelect ? (e) => { onSelect(e.shiftKey); } : undefined
        }
        onKeyDown={onSelect ? handleKeyDown : undefined}
        {...dragAttributes}
        {...listeners}
      >
        {children}
      </div>
    );
  },
);

PageChip.displayName = 'PageChip';
