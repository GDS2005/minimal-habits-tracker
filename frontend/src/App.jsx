import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import Heatmap from './components/Heatmap'
import DayPanel from './components/DayPanel'
import { completeHabit, createHabit, deleteHabit, getCompletions, getHabits, uncompleteHabit } from './utils/api'
import { todayKey } from './utils/date'

export default function App() {
  const [habits, setHabits] = useState([])
  const [log, setLog] = useState({})
  const [selectedKey, setSelectedKey] = useState(todayKey())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getHabits(), getCompletions()])
      .then(([loadedHabits, completions]) => {
        const loadedLog = {}
        for (const entry of completions) {
          if (!loadedLog[entry.date]) loadedLog[entry.date] = []
          loadedLog[entry.date].push(entry)
        }
        setHabits(loadedHabits)
        setLog(loadedLog)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const today = todayKey()
  const todayEntries = log[today] || []
  const doneIds = useMemo(() => new Set(todayEntries.map((e) => e.habitId)), [todayEntries])

  const streak = useMemo(() => computeStreak(log, habits.length), [log, habits.length])

  async function handleAdd({ name, time, color }) {
    try {
      const habit = await createHabit({ name, time, color })
      setHabits((prev) => [...prev, habit])
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleRemove(id) {
    try {
      await deleteHabit(id)
      setHabits((prev) => prev.filter((h) => h.id !== id))
      setLog((prev) => Object.fromEntries(
        Object.entries(prev).map(([key, entries]) => [key, entries.filter((entry) => entry.habitId !== id)])
      ))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleToggle(id) {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const isDone = (log[today] || []).some((entry) => entry.habitId === id)

    try {
      if (isDone) {
        await uncompleteHabit(id, today)
        setLog((prev) => ({
          ...prev,
          [today]: (prev[today] || []).filter((entry) => entry.habitId !== id),
        }))
      } else {
        const entry = await completeHabit(id, today)
        setLog((prev) => ({ ...prev, [today]: [...(prev[today] || []), entry] }))
      }
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const selectedEntries = log[selectedKey] || []

  return (
    <div className="min-h-full">
      {error && <p className="max-w-6xl mx-auto px-5 pt-4 text-sm text-down">{error}</p>}
      {loading && <p className="max-w-6xl mx-auto px-5 pt-4 text-sm text-ink-500">Loading habits...</p>}
      <Header streak={streak} todayCount={todayEntries.length} totalHabits={habits.length} />

      <main className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        <aside className="flex flex-col gap-5 order-2 lg:order-1">
          <HabitForm onAdd={handleAdd} />
          <DayPanel selectedKey={selectedKey} entries={selectedEntries} totalHabits={habits.length} />
        </aside>

        <section className="flex flex-col gap-5 order-1 lg:order-2">
          <Heatmap
            log={log}
            totalHabits={habits.length}
            selectedKey={selectedKey}
            onSelectDay={setSelectedKey}
          />
          <HabitList habits={habits} doneIds={doneIds} onToggle={handleToggle} onRemove={handleRemove} />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-5 pb-8 pt-2">
        <p className="text-[11px] text-ink-500 font-mono">Data stored in the local SQLite database.</p>
      </footer>
    </div>
  )
}

function computeStreak(log, totalHabits) {
  if (totalHabits === 0) return 0
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // if today has nothing yet, don't break streak, just start check from yesterday
  const key = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const todaysCount = (log[key(cursor)] || []).length
  if (todaysCount === 0) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (true) {
    const entries = log[key(cursor)] || []
    if (entries.length > 0) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
