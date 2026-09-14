export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toKey(new Date())
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Builds a Sun->Sat column-major grid covering the last `weeks` weeks,
// ending on the current week, GitHub-contribution-graph style.
export function buildWeekGrid(weeks = 53) {
  const today = startOfDay(new Date())
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay())) // Saturday of this week

  const totalDays = weeks * 7
  const start = new Date(endOfWeek)
  start.setDate(endOfWeek.getDate() - totalDays + 1)

  const columns = []
  let cursor = new Date(start)
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      col.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    columns.push(col)
  }
  return columns
}

export function monthLabelsForGrid(columns) {
  const labels = []
  let lastMonth = -1
  columns.forEach((col, i) => {
    const firstOfCol = col[0]
    const month = firstOfCol.getMonth()
    if (month !== lastMonth) {
      labels.push({ colIndex: i, label: firstOfCol.toLocaleString('en-US', { month: 'short' }) })
      lastMonth = month
    }
  })
  return labels
}
