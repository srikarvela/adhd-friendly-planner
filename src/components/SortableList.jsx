import { useState } from 'react'
import {
  DndContext, closestCenter, DragOverlay,
  PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Wrap any card with sortable drag behaviour
export function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }
  return (
    <div ref={setNodeRef} style={style}>
      {/* pass drag handle props to children via render prop */}
      {typeof children === 'function' ? children({ dragHandleProps: { ...attributes, ...listeners } }) : children}
    </div>
  )
}

// Full sortable list context
export function SortableList({ items, onReorder, renderItem, renderOverlay }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 260, tolerance: 6 } }),
  )

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (over && active.id !== over.id) onReorder(active.id, over.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {(dndProps) => renderItem(item, dndProps)}
          </SortableItem>
        ))}
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
        {activeId && renderOverlay
          ? renderOverlay(items.find(i => i.id === activeId))
          : null}
      </DragOverlay>
    </DndContext>
  )
}
