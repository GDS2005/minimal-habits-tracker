const HABITS_KEY = 'habitx.habits'
const LOG_KEY = 'habitx.log' // { 'YYYY-MM-DD': [{ habitId, name, time, completedAt }] }

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function loadLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveLog(log) {
  localStorage.setItem(LOG_KEY, JSON.stringify(log))
}
