import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { buildDayTasks, buildSchoolData, todayStr, tomorrowStr } from '../data/defaultTasks'

const KEY = 'adhd_planner_v3'

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)) }

function ensureDay(store, dateStr) {
  if (store[dateStr]) return store
  return {
    ...store,
    [dateStr]: {
      tasks: buildDayTasks(dateStr),
      school: buildSchoolData(),
      personal: [],
      breakfast: [],
      notes: '',
      aiGenerated: false,
    }
  }
}

export function usePlanner() {
  const [store, setStore] = useState(() => ensureDay(load(), todayStr()))
  const [activeDate, setActiveDateRaw] = useState(todayStr())

  function setActiveDate(d) {
    setStore(prev => { const n = ensureDay(prev, d); save(n); return n })
    setActiveDateRaw(d)
  }

  const day = store[activeDate] || { tasks: [], school: {}, personal: [], breakfast: [] }

  function mut(fn) {
    setStore(prev => { const n = fn(prev); save(n); return n })
  }

  // ── Section tasks (morning/prayer/meds/night/obligation) ────────────────
  const updateTask = useCallback((id, patch) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], tasks: prev[activeDate].tasks.map(t => t.id === id ? { ...t, ...patch } : t) }
  })), [activeDate])

  const addSectionTask = useCallback((section, task) => mut(prev => {
    const d = prev[activeDate]
    const t = { ...task, id: `custom-${section}-${Date.now()}`, templateId: null, section, done: false, subtaskProgress: (task.subtasks||[]).map(()=>false), note: '' }
    return { ...prev, [activeDate]: { ...d, tasks: [...d.tasks, t] } }
  }), [activeDate])

  const removeSectionTask = useCallback((id) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], tasks: prev[activeDate].tasks.filter(t => t.id !== id) }
  })), [activeDate])

  // Drag-to-reorder by active/over task id
  const reorderTasks = useCallback((activeId, overId) => mut(prev => {
    const tasks = prev[activeDate].tasks
    const oi = tasks.findIndex(t => t.id === activeId)
    const ni = tasks.findIndex(t => t.id === overId)
    if (oi === -1 || ni === -1 || oi === ni) return prev
    return { ...prev, [activeDate]: { ...prev[activeDate], tasks: arrayMove(tasks, oi, ni) } }
  }), [activeDate])

  // ── School ─────────────────────────────────────────────────────────────
  const addSchoolTask = useCallback((classId, title) => mut(prev => {
    const d = prev[activeDate]
    const t = { id: `school-${classId}-${Date.now()}`, title, done: false, subtasks: [], subtaskProgress: [], note: '' }
    return { ...prev, [activeDate]: { ...d, school: { ...d.school, [classId]: [...(d.school[classId]||[]), t] } } }
  }), [activeDate])

  const updateSchoolTask = useCallback((classId, taskId, patch) => mut(prev => {
    const d = prev[activeDate]
    return { ...prev, [activeDate]: { ...d, school: { ...d.school, [classId]: d.school[classId].map(t => t.id === taskId ? { ...t, ...patch } : t) } } }
  }), [activeDate])

  const removeSchoolTask = useCallback((classId, taskId) => mut(prev => {
    const d = prev[activeDate]
    return { ...prev, [activeDate]: { ...d, school: { ...d.school, [classId]: d.school[classId].filter(t => t.id !== taskId) } } }
  }), [activeDate])

  const reorderSchoolTasks = useCallback((classId, activeId, overId) => mut(prev => {
    const d = prev[activeDate]
    const list = d.school[classId] || []
    const oi = list.findIndex(t => t.id === activeId)
    const ni = list.findIndex(t => t.id === overId)
    if (oi === -1 || ni === -1 || oi === ni) return prev
    return { ...prev, [activeDate]: { ...d, school: { ...d.school, [classId]: arrayMove(list, oi, ni) } } }
  }), [activeDate])

  // ── Personal ───────────────────────────────────────────────────────────
  const addPersonalTask = useCallback((item) => mut(prev => {
    const d = prev[activeDate]
    if (d.personal.find(p => p.templateId === item.id)) return prev
    const t = { ...item, id: `personal-${item.id}-${activeDate}`, templateId: item.id, done: false, subtasks: [], subtaskProgress: [], note: '' }
    return { ...prev, [activeDate]: { ...d, personal: [...d.personal, t] } }
  }), [activeDate])

  const updatePersonalTask = useCallback((id, patch) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], personal: prev[activeDate].personal.map(t => t.id === id ? { ...t, ...patch } : t) }
  })), [activeDate])

  const removePersonalTask = useCallback((id) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], personal: prev[activeDate].personal.filter(t => t.id !== id) }
  })), [activeDate])

  const reorderPersonalTasks = useCallback((activeId, overId) => mut(prev => {
    const list = prev[activeDate].personal
    const oi = list.findIndex(t => t.id === activeId)
    const ni = list.findIndex(t => t.id === overId)
    if (oi === -1 || ni === -1 || oi === ni) return prev
    return { ...prev, [activeDate]: { ...prev[activeDate], personal: arrayMove(list, oi, ni) } }
  }), [activeDate])

  // ── Breakfast ──────────────────────────────────────────────────────────
  const addBreakfastItem = useCallback((title) => mut(prev => {
    const d = prev[activeDate]
    const item = { id: `bf-${Date.now()}`, title, done: false }
    return { ...prev, [activeDate]: { ...d, breakfast: [...d.breakfast, item] } }
  }), [activeDate])

  const toggleBreakfastItem = useCallback((id) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], breakfast: prev[activeDate].breakfast.map(i => i.id === id ? { ...i, done: !i.done } : i) }
  })), [activeDate])

  const removeBreakfastItem = useCallback((id) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], breakfast: prev[activeDate].breakfast.filter(i => i.id !== id) }
  })), [activeDate])

  const injectAITasks = useCallback((dateStr, aiTasks, markGenerated = false) => mut(prev => {
    const base = ensureDay(prev, dateStr)
    const d = base[dateStr]
    return { ...base, [dateStr]: { ...d, tasks: [...d.tasks, ...aiTasks], aiGenerated: markGenerated || d.aiGenerated } }
  }), [])

  const updateNotes = useCallback((text) => mut(prev => ({
    ...prev,
    [activeDate]: { ...prev[activeDate], notes: text }
  })), [activeDate])

  // ── Move to next day ────────────────────────────────────────────────────
  // source: 'task' (day.tasks), 'school' (needs classId), 'personal' (day.personal)
  const moveToNextDay = useCallback((source, task, classId) => {
    const tomorrow = tomorrowStr()
    mut(prev => {
      let base = ensureDay(prev, tomorrow)
      const fromDay = base[activeDate]
      const toDay   = base[tomorrow]

      // Build the carried-over task landing in morning
      const carried = {
        ...task,
        id: `carried-${task.id}-${tomorrow}`,
        templateId: task.templateId,
        section: 'morning',
        done: false,
        subtaskProgress: (task.subtasks || []).map(() => false),
        addedByAI: false,
        note: task.note || '',
        carriedOver: true,
      }

      // Remove from source
      let newFromDay = { ...fromDay }
      if (source === 'task') {
        newFromDay.tasks = fromDay.tasks.filter(t => t.id !== task.id)
      } else if (source === 'school' && classId) {
        newFromDay.school = {
          ...fromDay.school,
          [classId]: (fromDay.school[classId] || []).filter(t => t.id !== task.id),
        }
      } else if (source === 'personal') {
        newFromDay.personal = fromDay.personal.filter(t => t.id !== task.id)
      }

      // Add to tomorrow morning (avoid duplicates)
      const alreadyThere = toDay.tasks.some(t => t.id === carried.id)
      const newToDay = alreadyThere
        ? toDay
        : { ...toDay, tasks: [carried, ...toDay.tasks] }

      return { ...base, [activeDate]: newFromDay, [tomorrow]: newToDay }
    })
  }, [activeDate])

  return {
    day, activeDate, setActiveDate, store,
    updateTask, addSectionTask, removeSectionTask, reorderTasks,
    addSchoolTask, updateSchoolTask, removeSchoolTask, reorderSchoolTasks,
    addPersonalTask, updatePersonalTask, removePersonalTask, reorderPersonalTasks,
    addBreakfastItem, toggleBreakfastItem, removeBreakfastItem,
    injectAITasks, moveToNextDay, updateNotes,
  }
}
