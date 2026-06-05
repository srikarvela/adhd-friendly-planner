import { useEffect, useRef } from 'react'
import { tomorrowStr } from '../data/defaultTasks'

const KEY_STORE = 'adhd_anthropic_key'

export function useAutoAI(todayTasks, store, injectAITasks, onDone) {
  const firedRef = useRef(false)

  useEffect(() => {
    async function tryGenerate() {
      const apiKey = localStorage.getItem(KEY_STORE)
      if (!apiKey) return

      const tomorrow = tomorrowStr()
      const alreadyDone = store[tomorrow]?.aiGenerated
      if (alreadyDone || firedRef.current) return

      const now = new Date()
      // Fire at or after 22:00 local time
      if (now.getHours() < 22) return

      firedRef.current = true

      const summary = todayTasks
        .map(t => {
          const done = t.subtasks?.length
            ? `${t.subtaskProgress?.filter(Boolean).length || 0}/${t.subtasks.length} subtasks`
            : t.done ? 'done' : 'not done'
          return `- ${t.title} [${t.category}]: ${done}`
        })
        .join('\n')

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
            system: `You are a daily planner assistant for someone with ADHD. Based on today's task completion, suggest additional tasks (not the daily recurring ones) for tomorrow. Return ONLY a JSON array: [{ "title": string, "category": "school"|"chores"|"personal"|"fitness"|"routine"|"prayer"|"health", "block": "morning"|"afternoon"|"evening"|"night", "subtasks": string[] }]. Max 6 tasks. No markdown.`,
            messages: [{ role: 'user', content: `Today:\n${summary}\n\nSuggest tasks for tomorrow (${tomorrow}).` }],
          }),
        })

        if (!res.ok) return

        const data = await res.json()
        const tasks = JSON.parse(data.content[0].text.trim()).map((t, i) => ({
          ...t,
          id: `ai-${tomorrow}-${i}`,
          templateId: null,
          section: t.block || 'morning',
          done: false,
          subtaskProgress: (t.subtasks || []).map(() => false),
          note: '',
          addedByAI: true,
          recur: 'once',
        }))

        injectAITasks(tomorrow, tasks, true)
        onDone?.()
      } catch {
        firedRef.current = false // allow retry
      }
    }

    tryGenerate()
    const interval = setInterval(tryGenerate, 60_000)
    return () => clearInterval(interval)
  }, [todayTasks, store, injectAITasks, onDone])
}
