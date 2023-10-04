import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
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

export function SortableListNoContext<T extends BaseItem>({
  items,
  renderItem,
  strategy = verticalListSortingStrategy,
}: Props<T>) {
  return (
    <SortableContext items={items} strategy={strategy}>
      <div className='SortableList n-flex' role='application'>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </div>
    </SortableContext>
  );
}

SortableListNoContext.Item = SortableItem;
SortableListNoContext.DragHandle = DragHandle;
