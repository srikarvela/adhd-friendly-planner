import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlanner } from './hooks/usePlanner'
import { useAutoAI } from './hooks/useAutoAI'
import { CATEGORIES, OBLIGATIONS, todayStr, tomorrowStr, dayName } from './data/defaultTasks'
import { SortableList } from './components/SortableList'
import TaskCard from './components/TaskCard'
import InlineAdd from './components/InlineAdd'
import SectionBlock from './components/SectionBlock'
import SchoolSection from './components/SchoolSection'
import PersonalSection from './components/PersonalSection'
import AIPlanner from './components/AIPlanner'

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  if (dateStr === todayStr()) return 'Today'
  if (dateStr === tomorrowStr()) return 'Tomorrow'
  return `${DAY_LABELS[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

// 14 days back + 2 days ahead
function getAllDates() {
  const today = new Date(todayStr() + 'T00:00:00')
  return Array.from({ length: 17 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 14 + i)
    return d.toISOString().slice(0, 10)
  })
}

function Divider() {
  return <div className="my-5 mx-1" style={{ height: 1, backgroundColor: 'rgba(84,84,88,0.4)' }} />
}

// Future dates are locked until 10pm local time
function isDateAvailable(dateStr) {
  if (dateStr <= todayStr()) return true
  return new Date().getHours() >= 22
}

// Routine/health template tasks (daily repeating) are NOT moveable
function isMoveable(task) {
  if (!task) return false
  if (task.section === 'meds') return false
  if (task.section === 'night') return false
  if (task.section === 'morning' && task.templateId !== null && (task.category === 'routine' || task.category === 'chores')) return false
  return true
}

function UnavailableScreen() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  const hrs = 21 - now.getHours()
  const mins = 59 - now.getMinutes()
  return (
    <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
      <div className="text-[56px] mb-4">🔒</div>
      <p className="text-[20px] font-bold mb-2" style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.85)' }}>
        Tomorrow's plan isn't ready yet
      </p>
      <p className="text-[15px]" style={{ color: 'rgba(235,235,245,0.4)', fontFamily: 'SF Pro Text, sans-serif' }}>
        Available at 10:00 PM
      </p>
      {hrs >= 0 && (
        <p className="text-[13px] mt-2 tabular-nums" style={{ color: 'rgba(235,235,245,0.25)', fontFamily: 'SF Pro Text, sans-serif' }}>
          {hrs}h {mins}m away
        </p>
      )}
    </div>
  )
}

export default function App() {
  const {
    day, activeDate, setActiveDate, store,
    updateTask, addSectionTask, removeSectionTask, reorderTasks,
    addSchoolTask, updateSchoolTask, removeSchoolTask, reorderSchoolTasks,
    addPersonalTask, updatePersonalTask, removePersonalTask, reorderPersonalTasks,
    addBreakfastItem, toggleBreakfastItem, removeBreakfastItem,
    injectAITasks, moveToNextDay, updateNotes,
  } = usePlanner()

  const available = isDateAvailable(activeDate)
  const allDates = getAllDates()
  const stripRef = useRef(null)
  const [aiToast, setAiToast] = useState(false)

  // Auto-scroll date strip to show today on mount
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const todayIdx = allDates.indexOf(todayStr())
    // each pill is ~46px wide with 4px gap = 50px
    strip.scrollLeft = Math.max(0, todayIdx * 50 - strip.clientWidth / 2 + 25)
  }, [])

  // Auto-AI at 10pm
  const handleAIDone = useCallback(() => {
    setAiToast(true)
    setTimeout(() => setAiToast(false), 5000)
  }, [])
  useAutoAI(day.tasks, store, injectAITasks, handleAIDone)

  const [showAI, setShowAI] = useState(false)

  const sectionTasks = (s) => day.tasks.filter(t => t.section === s)
  const countDone = (tasks) => tasks.filter(t => t.done).length

  const allTasks = [
    ...day.tasks,
    ...Object.values(day.school || {}).flat(),
    ...day.personal,
    ...day.breakfast,
  ]
  const totalDone = allTasks.filter(t => t.done).length
  const totalAll  = allTasks.length
  const progress  = totalAll ? totalDone / totalAll : 0

  const todayObs = OBLIGATIONS.filter(o => o.recur === dayName(activeDate))

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#000' }}>
      {/* ── Sticky glass header ─────────────────────────────────────────── */}
      <div className="glass sticky top-0 z-30" style={{ borderRadius: '0 0 24px 24px', borderTop: 'none' }}>
        <div className="px-5 pt-5 pb-4">
          {/* Date row */}
          <div className="flex items-center justify-between mb-1">
            <h1
              className="text-[32px] font-bold tracking-tight leading-tight"
              style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}
            >
              {formatDate(activeDate)}
            </h1>
            <button
              onClick={() => setShowAI(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[17px]"
              style={{ background: 'linear-gradient(135deg, #BF5AF2, #409CFF)', boxShadow: '0 4px 16px rgba(191,90,242,0.4)' }}
            >✨</button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%`, background: progress === 1 ? '#30D158' : 'linear-gradient(90deg, #409CFF, #30D158)' }}
              />
            </div>
            <span className="text-[12px] font-medium tabular-nums" style={{ color: 'rgba(235,235,245,0.4)', fontFamily: 'SF Pro Text, sans-serif' }}>
              {totalDone}/{totalAll}
            </span>
          </div>

          {/* Date strip — 14 days back + 2 ahead, scrollable */}
          <div ref={stripRef} className="flex gap-1 overflow-x-auto pb-0.5 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {allDates.map(d => {
              const date = new Date(d + 'T00:00:00')
              const isActive = d === activeDate
              const isToday  = d === todayStr()
              const isPast   = d < todayStr()
              const hasData  = !!(store[d]?.tasks?.length)
              const dayDone  = store[d] ? store[d].tasks.filter(t => t.done).length : 0
              const dayTotal = store[d] ? store[d].tasks.length : 0
              const allDone  = hasData && dayDone === dayTotal
              return (
                <button
                  key={d}
                  onClick={() => setActiveDate(d)}
                  className="flex flex-col items-center flex-shrink-0 w-[44px] py-1 rounded-2xl transition-all"
                >
                  {isActive ? (
                    <div className="glass-blue flex flex-col items-center w-full rounded-2xl py-1.5">
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'SF Pro Text, sans-serif' }}>{DAY_LABELS[date.getDay()]}</span>
                      <span className="text-[18px] font-bold" style={{ fontFamily: 'SF Pro Display, sans-serif', color: '#fff' }}>{date.getDate()}</span>
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.55)' }} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full rounded-2xl py-1.5" style={{ backgroundColor: isToday ? 'rgba(64,156,255,0.12)' : 'transparent' }}>
                      <span className="text-[10px] font-semibold" style={{ color: isPast ? 'rgba(235,235,245,0.25)' : 'rgba(235,235,245,0.4)', fontFamily: 'SF Pro Text, sans-serif' }}>{DAY_LABELS[date.getDay()]}</span>
                      <span className="text-[18px] font-bold" style={{ fontFamily: 'SF Pro Display, sans-serif', color: isPast ? 'rgba(255,255,255,0.38)' : isToday ? '#409CFF' : 'rgba(255,255,255,0.85)' }}>{date.getDate()}</span>
                      {hasData && (
                        <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: allDone ? '#30D158' : isPast ? 'rgba(255,69,58,0.6)' : 'rgba(235,235,245,0.2)' }} />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── AI auto-plan toast ────────────────────────────────────────── */}
      {aiToast && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ background: 'linear-gradient(135deg,rgba(191,90,242,0.9),rgba(64,156,255,0.9))', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span>✨</span>
          <span className="text-[13px] font-semibold text-white" style={{ fontFamily: 'SF Pro Text, sans-serif' }}>Tomorrow's plan generated</span>
        </div>
      )}

      {/* ── Obligations banner ─────────────────────────────────────────── */}
      {todayObs.length > 0 && (
        <div className="px-4 pt-4">
          <div className="rounded-2xl px-4 py-3 flex flex-wrap gap-x-4 gap-y-1" style={{ backgroundColor: 'rgba(255,214,10,0.10)', border: '1px solid rgba(255,214,10,0.22)' }}>
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: 'rgba(255,214,10,0.6)', fontFamily: 'SF Pro Text, sans-serif', width: '100%' }}>Today's obligations</span>
            {todayObs.map(ob => (
              <span key={ob.id} className="text-[14px] font-semibold" style={{ color: '#FFD60A', fontFamily: 'SF Pro Text, sans-serif' }}>
                {ob.time ? `${ob.time} · ` : ''}{ob.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Main scroll content ────────────────────────────────────────── */}
      <div className="px-4 pt-6 pb-36">

        {!available ? <UnavailableScreen /> : (<>

        {/* Carried-over banner */}
        {sectionTasks('morning').some(t => t.carriedOver) && (
          <div className="rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2" style={{ backgroundColor: 'rgba(64,156,255,0.10)', border: '1px solid rgba(64,156,255,0.20)' }}>
            <span className="text-[14px]">↩️</span>
            <span className="text-[13px] font-medium" style={{ color: 'rgba(64,156,255,0.9)', fontFamily: 'SF Pro Text, sans-serif' }}>
              Some tasks were moved from yesterday
            </span>
          </div>
        )}

        {/* MORNING */}
        <SectionBlock icon="☀️" title="Morning" count={countDone(sectionTasks('morning'))} total={sectionTasks('morning').length} accentColor="#FF9F0A">
          <SortableList
            items={sectionTasks('morning')}
            onReorder={reorderTasks}
            renderItem={(task, dndProps) => (
              <TaskCard
                task={task} dragHandleProps={dndProps}
                onUpdate={p => updateTask(task.id, p)}
                onRemove={task.templateId === null || task.carriedOver ? () => removeSectionTask(task.id) : null}
                onMoveToTomorrow={isMoveable(task) ? () => moveToNextDay('task', task) : null}
              />
            )}
            renderOverlay={(task) => task && <TaskCard task={task} onUpdate={() => {}} />}
          />
          <InlineAdd placeholder="Add morning task…" onAdd={title => addSectionTask('morning', { title, category: 'routine', subtasks: [] })} accentColor="#FF9F0A" />
        </SectionBlock>

        <Divider />

        {/* PRAYER */}
        <SectionBlock icon="🪔" title="Prayer" count={countDone(sectionTasks('prayer'))} total={sectionTasks('prayer').length} accentColor="#FFD60A">
          <SortableList
            items={sectionTasks('prayer')}
            onReorder={reorderTasks}
            renderItem={(task, dndProps) => (
              <TaskCard
                task={task} dragHandleProps={dndProps}
                onUpdate={p => updateTask(task.id, p)}
                onRemove={task.templateId === null ? () => removeSectionTask(task.id) : null}
                onMoveToTomorrow={() => moveToNextDay('task', task)}
              />
            )}
            renderOverlay={(task) => task && <TaskCard task={task} onUpdate={() => {}} />}
          />
          <InlineAdd placeholder="Add prayer / mantra…" onAdd={title => addSectionTask('prayer', { title, category: 'prayer', subtasks: [] })} accentColor="#FFD60A" />
        </SectionBlock>

        <Divider />

        {/* MEDS */}
        <SectionBlock icon="💊" title="Meds" count={countDone(sectionTasks('meds'))} total={sectionTasks('meds').length} accentColor="#32ADE6">
          {sectionTasks('meds').map(t => (
            <TaskCard key={t.id} task={t} onUpdate={p => updateTask(t.id, p)} />
          ))}
        </SectionBlock>

        <Divider />

        {/* BREAKFAST */}
        <SectionBlock icon="🥣" title="Breakfast" count={day.breakfast.filter(i => i.done).length} total={day.breakfast.length} accentColor="#FF8C55">
          {day.breakfast.map(item => {
            const cat = CATEGORIES.routine
            return (
              <div key={item.id} className="rounded-2xl mb-2 overflow-hidden" style={{ backgroundColor: item.done ? 'rgba(44,44,46,0.6)' : cat.bg, border: `1px solid ${item.done ? 'rgba(84,84,88,0.4)' : cat.border}`, boxShadow: item.done ? 'none' : '0 2px 8px rgba(0,0,0,0.25)' }}>
                <div className="flex items-center gap-3 pr-3.5 pl-3.5 py-2.5">
                  <button onClick={() => toggleBreakfastItem(item.id)} className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 active:scale-90" style={{ borderColor: item.done ? cat.color : cat.color + '55', backgroundColor: item.done ? cat.color : 'transparent' }}>
                    {item.done && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                  <p className="flex-1 text-[15px] font-medium" style={{ fontFamily: 'SF Pro Text, sans-serif', color: item.done ? 'rgba(235,235,245,0.3)' : 'rgba(255,255,255,0.92)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.title}</p>
                  <button onClick={() => removeBreakfastItem(item.id)} className="text-[14px]" style={{ color: 'rgba(235,235,245,0.2)' }}>✕</button>
                </div>
              </div>
            )
          })}
          <InlineAdd placeholder="Add to breakfast…" onAdd={addBreakfastItem} accentColor="#FF8C55" />
        </SectionBlock>

        <Divider />

        {/* SCHOOL */}
        <SchoolSection
          school={day.school || {}}
          onAdd={addSchoolTask}
          onUpdate={updateSchoolTask}
          onRemove={removeSchoolTask}
          onReorder={reorderSchoolTasks}
          onMoveToTomorrow={(task, classId) => moveToNextDay('school', task, classId)}
        />

        <Divider />

        {/* PERSONAL */}
        <PersonalSection
          personalTasks={day.personal || []}
          onAdd={addPersonalTask}
          onUpdate={updatePersonalTask}
          onRemove={removePersonalTask}
          onReorder={reorderPersonalTasks}
          onMoveToTomorrow={(task) => moveToNextDay('personal', task)}
        />

        {/* OBLIGATIONS tasks */}
        {sectionTasks('obligation').length > 0 && (
          <>
            <Divider />
            <SectionBlock icon="📌" title="Obligations" count={countDone(sectionTasks('obligation'))} total={sectionTasks('obligation').length} accentColor="#FFD60A">
              {sectionTasks('obligation').map(t => (
                <TaskCard key={t.id} task={t} onUpdate={p => updateTask(t.id, p)} />
              ))}
            </SectionBlock>
          </>
        )}

        <Divider />

        {/* NIGHT ROUTINE */}
        <SectionBlock icon="🌙" title="Night Routine" count={countDone(sectionTasks('night'))} total={sectionTasks('night').length} accentColor="#5E5CE6" defaultOpen={false}>
          {sectionTasks('night').map(t => (
            <TaskCard key={t.id} task={t} onUpdate={p => updateTask(t.id, p)} />
          ))}
          <InlineAdd placeholder="Add night task…" onAdd={title => addSectionTask('night', { title, category: 'routine', subtasks: [] })} accentColor="#5E5CE6" />
        </SectionBlock>

        {/* SELF NOTES */}
        <Divider />
        <div className="mb-2 px-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[21px]">📝</span>
            <span className="text-[19px] font-bold tracking-tight" style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}>Notes</span>
          </div>
          <textarea
            value={available ? (day.notes || '') : ''}
            onChange={e => available && updateNotes(e.target.value)}
            readOnly={!available}
            placeholder="Thoughts, reflections, reminders for yourself…"
            rows={4}
            className="w-full rounded-2xl px-4 py-3 text-[15px] resize-none focus:outline-none leading-relaxed"
            style={{
              fontFamily: 'SF Pro Text, sans-serif',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.85)',
              caretColor: '#409CFF',
            }}
          />
        </div>

        </>)}
      </div>

      {/* ── AI Modal ─────────────────────────────────────────────────────── */}
      {showAI && (
        <AIPlanner todayTasks={day.tasks} onInject={injectAITasks} onClose={() => setShowAI(false)} />
      )}
    </div>
  )
}
