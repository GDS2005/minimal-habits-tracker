function formatKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function DayPanel({ selectedKey, entries, totalHabits }) {
  if (!selectedKey) {
    return (
      <div className="bg-base-850 border border-base-700 rounded-lg p-4">
        <p className="text-sm text-ink-500">Select a day on the activity map to see what was completed.</p>
      </div>
    )
  }

  return (
    <div className="bg-base-850 border border-base-700 rounded-lg p-4 animate-rise-fade">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink-100">{formatKey(selectedKey)}</h3>
        <span className="text-xs font-mono text-ink-500">
          {entries.length}/{totalHabits || 0}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-ink-500">No habits completed this day.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-up shrink-0">✓</span>
                <span className="text-ink-100 truncate">{e.name}</span>
              </span>
              <span className="text-xs font-mono text-ink-500 shrink-0">{e.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
