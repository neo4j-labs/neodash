import React, { PropsWithChildren } from 'react';
import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

interface Props {
  id: UniqueIdentifier;
}
const DroppableZone = ({ children, id }: PropsWithChildren<Props>) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const style = {
    listStyleType: 'none',
    backgroundColor: isOver ? 'rgb(var(--palette-warning-bg-weak))' : 'inherit',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default DroppableZone;
