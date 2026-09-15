const db = require('../config/db');
const { randomUUID } = require('node:crypto');

const VALID_COLORS = new Set(['gold', 'up', 'sky', 'violet']);
const VALID_STATUSES = new Set(['pending', 'done', 'skipped']);

function isDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// GET /v1/habits
function getAllHabits(req, res) {
  const habits = db.prepare('SELECT * FROM habit').all();
  res.json(habits);
}

// GET /v1/habits/:id
function getHabitById(req, res) {
  const habit = db.prepare('SELECT * FROM habit WHERE id = ?').get(req.params.id);

  if (!habit) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  res.json(habit);
}

// POST /v1/habits
function createHabit(req, res) {
  const { id, name, time, color, status } = req.body;

  if (!name || !time) {
    return res.status(400).json({ error: { message: 'name and time are required' } });
  }

  if (color && !VALID_COLORS.has(color)) {
    return res.status(400).json({ error: { message: 'invalid color' } });
  }

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: { message: 'invalid status' } });
  }

  const stmt = db.prepare(
    'INSERT INTO habit (id, name, time, color, status) VALUES (?, ?, ?, ?, ?)'
  );
  const habitId = id || randomUUID();
  stmt.run(habitId, name.trim(), time, color || 'gold', status || 'pending');

  const newHabit = db.prepare('SELECT * FROM habit WHERE id = ?').get(habitId);
  res.status(201).json(newHabit);
}

// PUT /v1/habits/:id
function updateHabit(req, res) {
  const { name, time, color, status } = req.body;
  const existing = db.prepare('SELECT * FROM habit WHERE id = ?').get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  if (color && !VALID_COLORS.has(color)) {
    return res.status(400).json({ error: { message: 'invalid color' } });
  }

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: { message: 'invalid status' } });
  }

  db.prepare(
    'UPDATE habit SET name = ?, time = ?, color = ?, status = ? WHERE id = ?'
  ).run(
    name?.trim() || existing.name,
    time ?? existing.time,
    color ?? existing.color,
    status ?? existing.status,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM habit WHERE id = ?').get(req.params.id);
  res.json(updated);
}

// DELETE /v1/habits/:id
function deleteHabit(req, res) {
  const existing = db.prepare('SELECT * FROM habit WHERE id = ?').get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  db.prepare('DELETE FROM habit WHERE id = ?').run(req.params.id);
  res.status(204).send();
}

// GET /v1/completions
function getAllCompletions(req, res) {
  const completions = db.prepare(`
    SELECT
      c.habit_id AS habitId,
      c.completed_date AS date,
      c.completed_at AS completedAt,
      h.name,
      h.time,
      h.color
    FROM habit_completion c
    JOIN habit h ON h.id = c.habit_id
    ORDER BY c.completed_date DESC, c.completed_at DESC
  `).all();
  res.json(completions);
}

// POST /v1/habits/:id/completions/:date
function completeHabit(req, res) {
  const { id, date } = req.params;
  if (!isDateKey(date)) {
    return res.status(400).json({ error: { message: 'date must use YYYY-MM-DD' } });
  }

  const habit = db.prepare('SELECT * FROM habit WHERE id = ?').get(id);
  if (!habit) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  const completedAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO habit_completion (habit_id, completed_date, completed_at)
    VALUES (?, ?, ?)
    ON CONFLICT (habit_id, completed_date) DO UPDATE SET completed_at = excluded.completed_at
  `).run(id, date, completedAt);

  res.status(201).json({
    habitId: id,
    date,
    completedAt,
    name: habit.name,
    time: habit.time,
    color: habit.color,
  });
}

// DELETE /v1/habits/:id/completions/:date
function uncompleteHabit(req, res) {
  const { id, date } = req.params;
  if (!isDateKey(date)) {
    return res.status(400).json({ error: { message: 'date must use YYYY-MM-DD' } });
  }

  const result = db.prepare(
    'DELETE FROM habit_completion WHERE habit_id = ? AND completed_date = ?'
  ).run(id, date);

  if (result.changes === 0) {
    return res.status(404).json({ error: { message: 'Completion not found' } });
  }

  res.status(204).send();
}

module.exports = {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  getAllCompletions,
  completeHabit,
  uncompleteHabit,
};