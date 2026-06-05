import { useState } from 'react'
import { CATEGORIES, BLOCKS, tomorrowStr } from '../data/defaultTasks'

const KEY_STORE = 'adhd_anthropic_key'

export default function AIPlanner({ todayTasks, onInject, onClose }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORE) || '')
  const [keyInput, setKeyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function saveKey() {
    const k = keyInput.trim()
    if (!k.startsWith('sk-ant')) { setError('Key should start with sk-ant…'); return }
    localStorage.setItem(KEY_STORE, k); setApiKey(k); setKeyInput(''); setError('')
  }

  async function generate() {
    setLoading(true); setError('')
    const tomorrow = tomorrowStr()
    const summary = todayTasks.map(t => {
      const done = t.subtasks?.length
        ? `${t.subtaskProgress?.filter(Boolean).length||0}/${t.subtasks.length} subtasks`
        : t.done ? 'done' : 'not done'
      return `- ${t.title} [${t.category}]: ${done}`
    }).join('\n')

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-calls': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: 'You are a daily planner assistant for someone with ADHD. Based on today\'s task completion, suggest additional tasks (not the daily recurring ones) for tomorrow. Return ONLY a JSON array: [{ "title": string, "category": "school"|"chores"|"personal"|"fitness"|"routine"|"prayer"|"health", "block": "morning"|"afternoon"|"evening"|"night", "subtasks": string[] }]. Max 8 tasks. No markdown.',
          messages: [{ role: 'user', content: `Today:\n${summary}\n\nSuggest tasks for tomorrow (${tomorrow}).` }],
        }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error') }
      const data = await res.json()
      const tasks = JSON.parse(data.content[0].text.trim()).map((t, i) => ({
        ...t, id: `ai-${tomorrow}-${i}`, templateId: null, section: t.block,
        done: false, subtaskProgress: (t.subtasks||[]).map(()=>false), note: '', addedByAI: true, recur: 'once',
      }))
      setResult({ tomorrow, tasks })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function confirm() { if (result) { onInject(result.tomorrow, result.tasks); onClose() } }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-sheet rounded-t-3xl p-6 pb-10 max-h-[88vh] overflow-y-auto">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[22px]" style={{ background: 'linear-gradient(135deg, #BF5AF2, #409CFF)', boxShadow: '0 4px 16px rgba(191,90,242,0.35)' }}>✨</div>
          <div>
            <h2 className="text-[18px] font-bold" style={{ fontFamily: 'SF Pro Display, sans-serif', color: 'rgba(255,255,255,0.95)' }}>AI Plan for Tomorrow</h2>
            <p className="text-[13px]" style={{ color: 'rgba(235,235,245,0.45)' }}>Based on today's progress</p>
          </div>
        </div>

        {!apiKey ? (
          <div>
            <p className="text-[14px] mb-4" style={{ color: 'rgba(235,235,245,0.6)', fontFamily: 'SF Pro Text, sans-serif' }}>
              Enter your Anthropic API key. Stored only on this device.
            </p>
            <input
              type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              placeholder="sk-ant-…"
              className="w-full rounded-xl px-4 py-3 text-[15px] mb-3 focus:outline-none font-mono"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
            />
            {error && <p className="text-[13px] mb-3" style={{ color: '#FF453A' }}>{error}</p>}
            <button onClick={saveKey} className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px]" style={{ background: 'linear-gradient(135deg, #BF5AF2, #409CFF)' }}>Save Key</button>
          </div>
        ) : result ? (
          <div>
            <p className="text-[14px] font-semibold mb-3" style={{ color: 'rgba(235,235,245,0.7)', fontFamily: 'SF Pro Text, sans-serif' }}>Suggested for tomorrow:</p>
            {result.tasks.map((t, i) => {
              const cat = CATEGORIES[t.category] || CATEGORIES.routine
              const blk = BLOCKS.find(b => b.id === t.block)
              return (
                <div key={i} className="rounded-2xl p-3 mb-2" style={{ backgroundColor: cat.bg, border: `1px solid ${cat.border}` }}>
                  <div className="flex items-center gap-2">
                    <span>{blk?.icon}</span>
                    <span className="font-semibold text-[14px]" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'SF Pro Text, sans-serif' }}>{t.title}</span>
                  </div>
                  <span className="text-[12px] font-semibold ml-6" style={{ color: cat.color }}>{cat.label} · {blk?.label}</span>
                  {t.subtasks?.length > 0 && <ul className="ml-6 mt-1">{t.subtasks.map((s,j) => <li key={j} className="text-[12px]" style={{ color: 'rgba(235,235,245,0.45)' }}>· {s}</li>)}</ul>}
                </div>
              )
            })}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setResult(null)} className="flex-1 py-3 rounded-2xl font-semibold text-[15px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(235,235,245,0.7)' }}>Retry</button>
              <button onClick={confirm} className="flex-1 py-3 rounded-2xl font-semibold text-white text-[15px]" style={{ background: 'linear-gradient(135deg, #BF5AF2, #409CFF)' }}>Add to Tomorrow</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[14px] mb-5" style={{ color: 'rgba(235,235,245,0.55)', fontFamily: 'SF Pro Text, sans-serif' }}>
              Claude will review today's {todayTasks.length} tasks and build a smart plan for tomorrow.
            </p>
            {error && <p className="text-[13px] mb-3" style={{ color: '#FF453A' }}>{error}</p>}
            <button
              onClick={generate} disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-[16px] transition-opacity"
              style={{ background: 'linear-gradient(135deg, #BF5AF2, #409CFF)', opacity: loading ? 0.6 : 1, fontFamily: 'SF Pro Display, sans-serif', boxShadow: '0 4px 20px rgba(191,90,242,0.35)' }}
            >
              {loading ? 'Thinking…' : 'Generate Tomorrow\'s Plan ✨'}
            </button>
            <button onClick={() => { localStorage.removeItem(KEY_STORE); setApiKey('') }} className="mt-3 text-[12px] w-full text-center" style={{ color: 'rgba(235,235,245,0.3)' }}>Remove API key</button>
          </div>
        )}
      </div>
    </div>
  )
}
