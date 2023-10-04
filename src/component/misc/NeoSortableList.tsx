import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragHandle, SortableItem } from './NeoSortableItem';
import { SortableOverlay } from './NeoSortableOverlay';
import { createPortal } from 'react-dom';
import { SortingStrategy } from '@dnd-kit/sortable/dist/types';

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[], activeIndex: number, overIndex: number): void;
  renderItem(item: T, index: number): ReactNode;
  strategy: SortingStrategy;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  strategy = verticalListSortingStrategy,
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: {
        start: ['Space'],
        cancel: ['Escape'],
        end: ['Space'],
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);
          onChange(arrayMove(items, activeIndex, overIndex), activeIndex, overIndex);
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items} strategy={strategy}>
        <div className='SortableList n-flex' role='application'>
          {items.map((item, index) => (
            <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
          ))}
        </div>
      </SortableContext>
      {createPortal(
        <SortableOverlay>
          {activeItem !== undefined ? renderItem(activeItem, items.indexOf(activeItem)) : null}
        </SortableOverlay>,
        document.body
      )}
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
