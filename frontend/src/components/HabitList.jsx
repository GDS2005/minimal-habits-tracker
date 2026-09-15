const COLOR_DOT = {
  gold: 'bg-gold',
  up: 'bg-up',
  sky: 'bg-sky-400',
  violet: 'bg-violet-400',
}

export default function HabitList({ habits, doneIds, onToggle, onRemove, onEdit, pendingAction }) {
  if (habits.length === 0) {
    return (
      <div className="bg-base-850 border border-base-700 border-dashed rounded-lg p-8 text-center">
        <p className="text-sm text-ink-500">No open positions yet.</p>
        <p className="text-xs text-ink-500 mt-1">Add a habit on the left to start tracking today.</p>
      </div>
    )
  }

  return (
    <div className="bg-base-850 border border-base-700 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2.5 border-b border-base-700 text-[10px] uppercase tracking-wider text-ink-500 font-mono">
        <span>Habit</span>
        <span className="text-right">Time</span>
        <span className="text-right pr-1">Status</span>
      </div>
      <ul>
        {habits.map((habit) => {
          const done = doneIds.has(habit.id)
          return (
            <li
              key={habit.id}
              className="group grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3 border-b border-base-700 last:border-b-0 hover:bg-base-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[habit.color] || COLOR_DOT.gold}`} />
                <span className={`text-sm truncate ${done ? 'text-ink-500 line-through' : 'text-ink-100'}`}>
                  {habit.name}
                </span>
              </div>

              <span className="text-xs font-mono text-ink-500 text-right">{habit.time}</span>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => onEdit(habit)}
                  disabled={Boolean(pendingAction)}
                  className="text-xs text-ink-500 hover:text-ink-100 disabled:opacity-50"
                  aria-label={`Edit ${habit.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggle(habit.id)}
                  disabled={Boolean(pendingAction)}
                  className={`text-xs font-semibold rounded-md px-3 py-1.5 transition-colors ${
                    done
                      ? 'bg-up/15 text-up border border-up/40'
                      : 'bg-base-800 text-ink-300 border border-base-700 hover:border-gold hover:text-gold'
                  }`}
                >
                  {done ? 'Done ✓' : 'Mark done'}
                </button>
                <button
                  onClick={() => onRemove(habit.id)}
                  disabled={Boolean(pendingAction)}
                  className="opacity-0 group-hover:opacity-100 text-ink-500 hover:text-down transition-opacity text-xs px-1.5"
                  aria-label={`Remove ${habit.name}`}
                  title="Remove habit"
                >
                  ✕
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
