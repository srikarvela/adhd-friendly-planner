import { useState } from 'react'
import { SCHOOL_CLASSES, CATEGORIES } from '../data/defaultTasks'
import { SortableList } from './SortableList'
import InlineAdd from './InlineAdd'

function SchoolTask({ task, onUpdate, onRemove, onMoveToTomorrow, dragHandleProps }) {
  const cat = CATEGORIES.school
  return (
    <div
      className="rounded-2xl mb-2 overflow-hidden"
      style={{ backgroundColor: task.done ? 'rgba(44,44,46,0.6)' : cat.bg, border: `1px solid ${task.done ? 'rgba(84,84,88,0.4)' : cat.border}`, boxShadow: task.done ? 'none' : '0 2px 8px rgba(0,0,0,0.25)' }}
    >
      <div className="flex items-center gap-2 pr-3.5 pl-1.5 py-2.5">
        {dragHandleProps && (
          <div
            {...(dragHandleProps.dragHandleProps || dragHandleProps)}
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
        )}
        <button
          onClick={() => onUpdate({ done: !task.done })}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center active:scale-90"
          style={{ borderColor: task.done ? cat.color : cat.color + '55', backgroundColor: task.done ? cat.color : 'transparent' }}
        >
          {task.done && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
        <p className="flex-1 text-[15px] font-medium" style={{ color: task.done ? 'rgba(235,235,245,0.3)' : 'rgba(255,255,255,0.92)', textDecoration: task.done ? 'line-through' : 'none', fontFamily: 'SF Pro Text, sans-serif' }}>
          {task.title}
        </p>
        <div className="flex items-center gap-2">
          {onMoveToTomorrow && !task.done && (
            <button onClick={onMoveToTomorrow} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: '#409CFF', backgroundColor: 'rgba(64,156,255,0.12)' }}>→ tmrw</button>
          )}
          <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center text-[13px]" style={{ color: 'rgba(235,235,245,0.2)' }}>✕</button>
        </div>
      </div>
    </div>
  )
}

export default function SchoolSection({ school, onAdd, onUpdate, onRemove, onReorder, onMoveToTomorrow }) {
  const [openClasses, setOpenClasses] = useState(() => SCHOOL_CLASSES.reduce((a, c) => ({ ...a, [c.id]: true }), {}))

  const totalDone = SCHOOL_CLASSES.reduce((n, cls) => n + (school[cls.id]||[]).filter(t => t.done).length, 0)
  const totalAll  = SCHOOL_CLASSES.reduce((n, cls) => n + (school[cls.id]||[]).length, 0)

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 px-1 mb-3">
        <span className="text-[21px]">📚</span>
        <span className="flex-1 text-[19px] font-bold tracking-tight" style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}>School</span>
        {totalAll > 0 && (
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: totalDone === totalAll ? '#30D158' : '#409CFF' }}>{totalDone}/{totalAll}</span>
        )}
      </div>

      {SCHOOL_CLASSES.map(cls => {
        const tasks = school[cls.id] || []
        const done = tasks.filter(t => t.done).length
        const isOpen = openClasses[cls.id]
        return (
          <div key={cls.id} className="mb-4 ml-1">
            <button
              onClick={() => setOpenClasses(p => ({ ...p, [cls.id]: !p[cls.id] }))}
              className="flex items-center gap-2 w-full mb-2"
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#409CFF' }} />
              <span className="flex-1 text-left text-[15px] font-semibold" style={{ fontFamily: 'SF Pro Text, sans-serif', color: 'rgba(235,235,245,0.8)' }}>{cls.name}</span>
              {tasks.length > 0 && (
                <span className="text-[12px] font-semibold mr-1 tabular-nums" style={{ color: done === tasks.length && tasks.length > 0 ? '#30D158' : '#409CFF' }}>{done}/{tasks.length}</span>
              )}
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}>
                <path d="M4 6L8 10L12 6" stroke="rgba(235,235,245,0.25)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isOpen && (
              <div className="ml-4">
                <SortableList
                  items={tasks}
                  onReorder={(a, o) => onReorder(cls.id, a, o)}
                  renderItem={(task, dndProps) => (
                    <SchoolTask
                      task={task}
                      dragHandleProps={dndProps}
                      onUpdate={p => onUpdate(cls.id, task.id, p)}
                      onRemove={() => onRemove(cls.id, task.id)}
                      onMoveToTomorrow={onMoveToTomorrow ? () => onMoveToTomorrow(task, cls.id) : null}
                    />
                  )}
                  renderOverlay={(task) => task && <SchoolTask task={task} onUpdate={() => {}} onRemove={() => {}} />}
                />
                <InlineAdd placeholder={`Add ${cls.name} task…`} onAdd={title => onAdd(cls.id, title)} accentColor="#409CFF" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
