import { useEffect, useRef } from 'react'

export default function ContextMenu({ x, y, onDelete, onClose }) {
  const ref = useRef(null)

  // Close on any outside click or Escape
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('touchstart', handle)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  // Keep menu inside viewport
  const menuW = 160, menuH = 48
  const safeX = Math.min(x, window.innerWidth  - menuW - 8)
  const safeY = Math.min(y, window.innerHeight - menuH - 8)

  return (
    <div
      ref={ref}
      className="fixed z-[9999] rounded-2xl overflow-hidden shadow-2xl"
      style={{
        left: safeX, top: safeY,
        background: 'rgba(30,30,32,0.96)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.10)',
        minWidth: menuW,
      }}
    >
      <button
        onMouseDown={e => { e.stopPropagation(); onDelete(); onClose() }}
        className="flex items-center gap-2.5 w-full px-4 py-3 text-left text-[14px] font-medium transition-colors"
        style={{ color: '#FF453A', fontFamily: 'SF Pro Text, sans-serif' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,69,58,0.12)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M4 4l1 9h6l1-9" stroke="#FF453A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Delete task
      </button>
    </div>
  )
}
