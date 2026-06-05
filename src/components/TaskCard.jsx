import { useState } from 'react'
import { CATEGORIES } from '../data/defaultTasks'
import ContextMenu from './ContextMenu'

// Drag handle icon
function DragHandle({ listeners, attributes }) {
  return (
    <div
      {...listeners} {...attributes}
      className="flex-shrink-0 flex flex-col gap-[3px] justify-center px-1 py-2 cursor-grab active:cursor-grabbing touch-none"
      style={{ opacity: 0.28 }}
    >
      {[0,1,2].map(i => (
        <div key={i} className="flex gap-[3px]">
          <span className="w-[3px] h-[3px] rounded-full bg-white" />
          <span className="w-[3px] h-[3px] rounded-full bg-white" />
        </div>
      ))}
    </div>
  )
}

export default function TaskCard({ task, onUpdate, onRemove, onMoveToTomorrow, dragHandleProps }) {
  const [expanded, setExpanded] = useState(false)
  const [ctx, setCtx] = useState(null)
  const cat = CATEGORIES[task.category] || CATEGORIES.routine
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const doneSubs = hasSubtasks ? task.subtaskProgress.filter(Boolean).length : 0
  const progress = hasSubtasks ? doneSubs / task.subtasks.length : task.done ? 1 : 0

  function toggleSubtask(i) {
    const next = [...task.subtaskProgress]
    next[i] = !next[i]
    onUpdate({ subtaskProgress: next, done: next.every(Boolean) })
  }

  function toggleDone() {
    if (hasSubtasks) {
      const d = !task.done
      onUpdate({ done: d, subtaskProgress: task.subtasks.map(() => d) })
    } else {
      onUpdate({ done: !task.done })
    }
  }

  return (
    <div
      className="rounded-2xl mb-2 overflow-hidden"
      style={{
        backgroundColor: task.done ? 'rgba(44,44,46,0.6)' : cat.bg,
        border: `1px solid ${task.done ? 'rgba(84,84,88,0.4)' : cat.border}`,
        boxShadow: task.done ? 'none' : '0 2px 8px rgba(0,0,0,0.25)',
      }}
      onContextMenu={e => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY }) }}
    >
      {ctx && onRemove && (
        <ContextMenu x={ctx.x} y={ctx.y} onDelete={onRemove} onClose={() => setCtx(null)} />
      )}
      <div className="flex items-center gap-2 pr-3.5 pl-1.5 py-2.5">
        {/* Drag handle */}
        {dragHandleProps && <DragHandle {...dragHandleProps} />}

        {/* Completion circle */}
        <button
          onClick={toggleDone}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all active:scale-90"
          style={{
            borderColor: task.done ? cat.color : cat.color + '55',
            backgroundColor: task.done ? cat.color : 'transparent',
          }}
        >
          {task.done && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0" onClick={() => (hasSubtasks || onRemove) && setExpanded(e => !e)}>
          <p
            className="text-[15px] font-medium leading-snug"
            style={{
              color: task.done ? 'rgba(235,235,245,0.3)' : 'rgba(255,255,255,0.92)',
              textDecoration: task.done ? 'line-through' : 'none',
              fontFamily: 'SF Pro Text, SF Pro Display, sans-serif',
            }}
          >
            {task.title}
          </p>
          {hasSubtasks && !task.done && (
            <p className="text-[11px] mt-0.5" style={{ color: cat.color + 'CC' }}>
              {doneSubs}/{task.subtasks.length} done
            </p>
          )}
          {task.time && (
            <p className="text-[11px] mt-0.5 font-semibold" style={{ color: cat.color }}>
              {task.time}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        {(hasSubtasks || onRemove) && (
          <button onClick={() => setExpanded(e => !e)} className="p-1 flex-shrink-0">
            <svg
              width="14" height="14" viewBox="0 0 16 16" fill="none"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.18s' }}
            >
              <path d="M4 6L8 10L12 6" stroke="rgba(235,235,245,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {hasSubtasks && (
        <div className="px-4 pb-2.5 -mt-1">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%`, backgroundColor: cat.color }}
            />
          </div>
        </div>
      )}

      {/* Expanded subtasks */}
      {expanded && (
        <div className="px-4 pb-3 pt-2 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {hasSubtasks && task.subtasks.map((sub, i) => (
            <button key={i} onClick={() => toggleSubtask(i)} className="flex items-center gap-2.5 w-full text-left">
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                style={{
                  borderColor: task.subtaskProgress[i] ? cat.color : 'rgba(255,255,255,0.2)',
                  backgroundColor: task.subtaskProgress[i] ? cat.color : 'transparent',
                }}
              >
                {task.subtaskProgress[i] && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className="text-[13px]"
                style={{
                  color: task.subtaskProgress[i] ? 'rgba(235,235,245,0.3)' : 'rgba(235,235,245,0.75)',
                  textDecoration: task.subtaskProgress[i] ? 'line-through' : 'none',
                }}
              >{sub}</span>
            </button>
          ))}
          <div className="flex items-center gap-4 pt-1 flex-wrap">
            {onMoveToTomorrow && !task.done && (
              <button onClick={onMoveToTomorrow} className="text-[12px] font-semibold flex items-center gap-1" style={{ color: '#409CFF' }}>
                <span>→</span> Move to tomorrow
              </button>
            )}
            {onRemove && (
              <button onClick={onRemove} className="text-[12px] font-medium" style={{ color: '#FF453A' }}>
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
