import { useState } from 'react'

export default function InlineAdd({ placeholder = 'Add…', onAdd, accentColor = '#409CFF' }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')

  function submit() {
    if (val.trim()) { onAdd(val.trim()); setVal('') }
    setOpen(false)
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full mb-2 text-left"
      style={{ border: `1px dashed rgba(255,255,255,0.12)`, backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      <span className="text-[19px] font-light leading-none" style={{ color: accentColor }}>+</span>
      <span className="text-[14px] font-medium" style={{ color: accentColor }}>Add</span>
    </button>
  )

  return (
    <div className="flex gap-2 mb-2">
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setOpen(false) }}
        placeholder={placeholder}
        className="flex-1 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: `1px solid ${accentColor}55`,
          color: 'rgba(255,255,255,0.9)',
          fontFamily: 'SF Pro Text, sans-serif',
        }}
      />
      <button
        onClick={submit}
        className="px-4 py-2.5 rounded-xl text-[14px] font-semibold text-white"
        style={{ backgroundColor: accentColor }}
      >Add</button>
      <button
        onClick={() => setOpen(false)}
        className="px-3 py-2 rounded-xl text-[14px]"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(235,235,245,0.5)' }}
      >✕</button>
    </div>
  )
}
