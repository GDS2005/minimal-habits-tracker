import { useMemo } from 'react'
import { buildWeekGrid, monthLabelsForGrid, toKey, todayKey } from '../utils/date'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function levelFor(count, total) {
  if (count === 0) return 0
  if (total > 0 && count >= total) return 4 // perfect day
  const ratio = total > 0 ? count / total : count / 3
  if (ratio <= 0.34) return 1
  if (ratio <= 0.67) return 2
  return 3
}

const LEVEL_CLASS = [
  'bg-base-800', // 0 empty
  'bg-up/25', // 1
  'bg-up/55', // 2
  'bg-up/85', // 3
  'bg-gold', // 4 perfect day
]

export default function Heatmap({ log, totalHabits, selectedKey, onSelectDay }) {
  const columns = useMemo(() => buildWeekGrid(53), [])
  const monthLabels = useMemo(() => monthLabelsForGrid(columns), [columns])
  const today = todayKey()

  return (
    <div className="bg-base-850 border border-base-700 rounded-lg p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink-100">Activity map</h2>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-500 font-mono">
          <span>Less</span>
          {LEVEL_CLASS.map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="inline-flex flex-col min-w-max">
        <div className="flex ml-8 mb-1 relative h-4">
          {monthLabels.map((m) => (
            <span
              key={`${m.label}-${m.colIndex}`}
              className="absolute text-[10px] text-ink-500 font-mono"
              style={{ left: `${m.colIndex * 13}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] mr-1.5 w-6">
            {DAY_LABELS.map((d, i) => (
              <span key={i} className="h-[10px] text-[9px] leading-[10px] text-ink-500 font-mono">
                {d}
              </span>
            ))}
          </div>

          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-[3px]">
              {col.map((date, di) => {
                const key = toKey(date)
                const entries = log[key] || []
                const level = levelFor(entries.length, totalHabits)
                const isFuture = date > new Date()
                const isToday = key === today
                const isSelected = key === selectedKey

                return (
                  <button
                    key={di}
                    disabled={isFuture}
                    onClick={() => onSelectDay(key)}
                    title={`${key} · ${entries.length} completed`}
                    className={`w-[10px] h-[10px] rounded-[2px] transition-transform ${
                      isFuture ? 'bg-base-900/40 cursor-default' : LEVEL_CLASS[level] + ' hover:scale-125'
                    } ${isToday ? 'ring-1 ring-gold' : ''} ${
                      isSelected ? 'ring-2 ring-ink-100' : ''
                    }`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
