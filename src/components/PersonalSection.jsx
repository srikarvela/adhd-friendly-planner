import { useState } from 'react'
import { PERSONAL_BACKLOG, CATEGORIES } from '../data/defaultTasks'
import { SortableList } from './SortableList'
import InlineAdd from './InlineAdd'

function PersonalTask({ task, onUpdate, onRemove, onMoveToTomorrow, dragHandleProps }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES.personal
  return (
    <div className="rounded-2xl mb-2 overflow-hidden" style={{ backgroundColor: task.done ? 'rgba(44,44,46,0.6)' : cat.bg, border: `1px solid ${task.done ? 'rgba(84,84,88,0.4)' : cat.border}`, boxShadow: task.done ? 'none' : '0 2px 8px rgba(0,0,0,0.25)' }}>
      <div className="flex items-center gap-2 pr-3.5 pl-1.5 py-2.5">
        {dragHandleProps?.dragHandleProps && (
          <div {...dragHandleProps.dragHandleProps} className="flex-shrink-0 flex flex-col gap-[3px] justify-center px-1 py-2 cursor-grab active:cursor-grabbing touch-none" style={{ opacity: 0.28 }}>
            {[0,1,2].map(i => <div key={i} className="flex gap-[3px]"><span className="w-[3px] h-[3px] rounded-full bg-white" /><span className="w-[3px] h-[3px] rounded-full bg-white" /></div>)}
          </div>
        )}
        <button
          onClick={() => onUpdate({ done: !task.done })}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center active:scale-90"
          style={{ borderColor: task.done ? cat.color : cat.color + '55', backgroundColor: task.done ? cat.color : 'transparent' }}
        >
          {task.done && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
        <div className="flex-1 min-w-0" onClick={() => setExpanded(e => !e)}>
          <p className="text-[15px] font-medium" style={{ fontFamily: 'SF Pro Text, sans-serif', color: task.done ? 'rgba(235,235,245,0.3)' : 'rgba(255,255,255,0.92)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</p>
          {task.note && <p className="text-[11px]" style={{ color: cat.color + 'AA' }}>{task.note}</p>}
        </div>
        <button onClick={() => setExpanded(e => !e)} className="p-1">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
            <path d="M4 6L8 10L12 6" stroke="rgba(235,235,245,0.25)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-3 pt-2 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {onMoveToTomorrow && !task.done && (
            <button onClick={onMoveToTomorrow} className="text-[12px] font-semibold flex items-center gap-1" style={{ color: '#409CFF' }}>
              <span>→</span> Move to tomorrow
            </button>
          )}
          <button onClick={onRemove} className="text-[12px] font-medium" style={{ color: '#FF453A' }}>Remove from today</button>
        </div>
      )}
    </div>
  )
}

export default function PersonalSection({ personalTasks, onAdd, onAddCustom, onUpdate, onRemove, onReorder, onMoveToTomorrow }) {
  const [showBacklog, setShowBacklog] = useState(false)
  const cat = CATEGORIES.personal
  const activatedIds = new Set(personalTasks.map(t => t.templateId))
  const done = personalTasks.filter(t => t.done).length

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 px-1 mb-3">
        <span className="text-[21px]">💼</span>
        <span className="flex-1 text-[19px] font-bold tracking-tight" style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}>Personal</span>
        {personalTasks.length > 0 && (
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: done === personalTasks.length && done > 0 ? '#30D158' : cat.color }}>{done}/{personalTasks.length}</span>
        )}
      </div>

      <SortableList
        items={personalTasks}
        onReorder={onReorder}
        renderItem={(task, dndProps) => (
          <PersonalTask task={task} dragHandleProps={dndProps} onUpdate={p => onUpdate(task.id, p)} onRemove={() => onRemove(task.id)} onMoveToTomorrow={onMoveToTomorrow ? () => onMoveToTomorrow(task) : null} />
        )}
        renderOverlay={(task) => task && <PersonalTask task={task} onUpdate={() => {}} onRemove={() => {}} />}
      />

      {/* Backlog picker with liquid glass */}
      <button
        onClick={() => setShowBacklog(s => !s)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full mb-2 text-left"
        style={{ border: `1px dashed ${cat.color}40`, backgroundColor: `${cat.color}0D` }}
      >
        <span className="text-[18px] font-light" style={{ color: cat.color }}>{showBacklog ? '−' : '+'}</span>
        <span className="text-[14px] font-medium" style={{ color: cat.color, fontFamily: 'SF Pro Text, sans-serif' }}>
          {showBacklog ? 'Hide project list' : 'Add from project list'}
        </span>
      </button>

      <InlineAdd
        placeholder="Add custom personal task…"
        onAdd={title => onAddCustom && onAddCustom(title)}
        accentColor={cat.color}
      />

      {showBacklog && (
        <div className="rounded-2xl overflow-hidden mb-2" style={{ backgroundColor: 'rgba(28,28,30,0.95)', border: '1px solid rgba(255,255,255,0.09)' }}>
          {PERSONAL_BACKLOG.map((item, idx) => {
            const isActive = activatedIds.has(item.id)
            return (
              <button
                key={item.id}
                onClick={() => { if (!isActive) { onAdd(item); setShowBacklog(false) } }}
                disabled={isActive}
                className="flex items-center gap-3 px-4 py-3.5 w-full text-left"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderBottom: idx < PERSONAL_BACKLOG.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium" style={{ fontFamily: 'SF Pro Text, sans-serif', color: isActive ? 'rgba(235,235,245,0.35)' : 'rgba(255,255,255,0.88)' }}>{item.title}</p>
                  {item.note && <p className="text-[12px]" style={{ color: 'rgba(235,235,245,0.35)' }}>{item.note}</p>}
                </div>
                {isActive
                  ? <span className="text-[11px] font-bold" style={{ color: '#30D158' }}>✓ Added</span>
                  : <span className="text-[20px] font-thin" style={{ color: cat.color }}>+</span>
                }
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
