import { useState } from 'react'
import { CATEGORIES, BLOCKS } from '../data/defaultTasks'

export default function AddTaskSheet({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('school')
  const [block, setBlock] = useState('afternoon')
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtasks, setSubtasks] = useState([])

  function addSubtask() {
    if (subtaskInput.trim()) {
      setSubtasks(s => [...s, subtaskInput.trim()])
      setSubtaskInput('')
    }
  }

  function submit() {
    if (!title.trim()) return
    onAdd({ title: title.trim(), category, block, subtasks, recur: 'daily' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        <h2 className="text-[18px] font-bold text-gray-900 mb-5">Add Task</h2>

        <label className="block text-[13px] font-semibold text-gray-500 mb-1">Task name</label>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="e.g. Read chapter 5"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[15px] mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-[13px] font-semibold text-gray-500 mb-2">Category</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className="px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: category === key ? val.color : val.bg,
                color: category === key ? 'white' : val.color,
              }}
            >
              {val.label}
            </button>
          ))}
        </div>

        <label className="block text-[13px] font-semibold text-gray-500 mb-2">Time of day</label>
        <div className="flex gap-2 mb-4">
          {BLOCKS.map(b => (
            <button
              key={b.id}
              onClick={() => setBlock(b.id)}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: block === b.id ? '#007AFF' : '#F2F2F7',
                color: block === b.id ? 'white' : '#3C3C43',
              }}
            >
              {b.icon}
              <span className="ml-1">{b.label}</span>
            </button>
          ))}
        </div>

        <label className="block text-[13px] font-semibold text-gray-500 mb-2">Subtasks</label>
        {subtasks.map((s, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
            <span className="text-[14px] text-gray-700 flex-1">{s}</span>
            <button onClick={() => setSubtasks(p => p.filter((_, j) => j !== i))} className="text-red-400 text-[13px]">✕</button>
          </div>
        ))}
        <div className="flex gap-2 mb-6">
          <input
            value={subtaskInput}
            onChange={e => setSubtaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSubtask()}
            placeholder="Add subtask…"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={addSubtask} className="px-4 py-2 bg-gray-100 rounded-xl text-[14px] font-semibold text-blue-500">Add</button>
        </div>

        <button
          onClick={submit}
          className="w-full py-3.5 rounded-2xl text-[16px] font-semibold text-white"
          style={{ backgroundColor: '#007AFF' }}
        >
          Add Task
        </button>
      </div>
    </div>
  )
}
