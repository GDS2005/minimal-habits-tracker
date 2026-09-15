import { useEffect, useState } from 'react'

const PRESET_COLORS = [
  { id: 'gold', dot: 'bg-gold' },
  { id: 'up', dot: 'bg-up' },
  { id: 'sky', dot: 'bg-sky-400' },
  { id: 'violet', dot: 'bg-violet-400' },
]

export default function HabitForm({ editingHabit, onAdd, onUpdate, onCancel, isSubmitting }) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('07:00')
  const [color, setColor] = useState('gold')

  useEffect(() => {
    if (!editingHabit) {
      setName('')
      setTime('07:00')
      setColor('gold')
      return
    }
    setName(editingHabit.name)
    setTime(editingHabit.time)
    setColor(editingHabit.color)
  }, [editingHabit])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const saved = editingHabit
      ? await onUpdate(editingHabit.id, { name: trimmed, time, color })
      : await onAdd({ name: trimmed, time, color })
    if (!saved) return
    setName('')
    setTime('07:00')
    setColor('gold')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-850 border border-base-700 rounded-lg p-4 flex flex-col gap-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-100">{editingHabit ? 'Edit habit' : 'New position'}</h2>
        <span className="text-[10px] uppercase tracking-wider text-ink-500 font-mono">
          {editingHabit ? 'update habit' : 'add habit'}
        </span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-ink-500">Habit</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. Run 5 km"
          className="bg-base-800 border border-base-700 rounded-md px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-gold transition-colors"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-ink-500">Scheduled time</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={isSubmitting}
          className="bg-base-800 border border-base-700 rounded-md px-3 py-2 text-sm text-ink-100 font-mono outline-none focus:border-gold transition-colors [color-scheme:dark]"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-ink-500">Tag color</span>
        <div className="flex gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setColor(c.id)}
              disabled={isSubmitting}
              className={`w-6 h-6 rounded-full ${c.dot} transition-all ${
                color === c.id ? 'ring-2 ring-offset-2 ring-offset-base-850 ring-ink-100' : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Color ${c.id}`}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 bg-gold hover:bg-gold-light text-base-950 font-semibold text-sm rounded-md py-2.5 transition-colors"
      >
        {isSubmitting ? 'Saving...' : editingHabit ? 'Save changes' : 'Open habit'}
      </button>
      {editingHabit && (
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="text-xs text-ink-500 hover:text-ink-100">
          Cancel
        </button>
      )}
    </form>
  )
}
