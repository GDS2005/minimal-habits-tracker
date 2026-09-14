export default function Header({ streak, todayCount, totalHabits }) {
  return (
    <header className="border-b border-base-700 bg-base-900/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[17px] font-bold tracking-tight">
            Habit<span className="text-gold">Exchange</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 font-mono text-sm">
          <Ticker label="Streak" value={`${streak}d`} tone={streak > 0 ? 'up' : 'muted'} />
          <div className="w-px h-8 bg-base-700" />
          <Ticker label="Done today" value={`${todayCount}/${totalHabits || 0}`} tone="gold" />
        </div>
      </div>
    </header>
  )
}

function Ticker({ label, value, tone }) {
  const toneClass =
    tone === 'up' ? 'text-up' : tone === 'gold' ? 'text-gold' : 'text-ink-500'
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-[10px] uppercase tracking-wider text-ink-500">{label}</span>
      <span className={`text-base font-semibold ${toneClass}`}>{value}</span>
    </div>
  )
}
