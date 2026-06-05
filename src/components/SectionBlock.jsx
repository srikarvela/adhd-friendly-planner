import { useState } from 'react'

export default function SectionBlock({ icon, title, count, total, accentColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const allDone = total > 0 && count === total

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center w-full px-1 mb-3 gap-2.5"
      >
        <span className="text-[21px]">{icon}</span>
        <span
          className="flex-1 text-left text-[19px] font-bold tracking-tight"
          style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}
        >
          {title}
        </span>
        {total > 0 && (
          <span
            className="text-[13px] font-semibold mr-1 tabular-nums"
            style={{ color: allDone ? '#30D158' : accentColor }}
          >
            {count}/{total}
          </span>
        )}
        <svg
          width="15" height="15" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
        >
          <path d="M4 6L8 10L12 6" stroke="rgba(235,235,245,0.35)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}
