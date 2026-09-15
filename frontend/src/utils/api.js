const API_BASE = '/v1/habits'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error?.message || 'Request failed')
  }

  return response.status === 204 ? null : response.json()
}

export function getHabits() {
  return request('')
}

export function getCompletions() {
  return request('/completions')
}

export function createHabit(habit) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(habit),
  })
}

export function deleteHabit(id) {
  return request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function completeHabit(id, date) {
  return request(`/${encodeURIComponent(id)}/completions/${date}`, { method: 'POST' })
}

export function uncompleteHabit(id, date) {
  return request(`/${encodeURIComponent(id)}/completions/${date}`, { method: 'DELETE' })
}