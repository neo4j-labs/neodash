import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: UniqueIdentifier;
  onDraggingOrSorting: (a: boolean, b: boolean) => void;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id, onDraggingOrSorting = () => {} }: PropsWithChildren<Props>) {
  const { attributes, isDragging, isSorting, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({
      id,
    });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    onDraggingOrSorting(isDragging, isSorting);
  }, [isDragging, isSorting]);

  return (
    <SortableItemContext.Provider value={context}>
      <div className='SortableItem' ref={setNodeRef} style={style}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button className='DragHandle' {...attributes} {...listeners} ref={ref}>
      <svg viewBox='0 0 20 20' width='12'>
        <path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z'></path>
      </svg>
    </button>
  );
}
