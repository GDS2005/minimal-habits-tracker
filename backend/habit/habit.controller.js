const db = require('../config/db');

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
  const { name, time, status } = req.body;

  if (!name || !time) {
    return res.status(400).json({ error: { message: 'name and time are required' } });
  }

  const stmt = db.prepare(
    'INSERT INTO habit (name, time, status) VALUES (?, ?, ?)'
  );
  const info = stmt.run(name, time, status || 'pending');

  const newHabit = db.prepare('SELECT * FROM habit WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newHabit);
}

// PUT /v1/habits/:id
function updateHabit(req, res) {
  const { name, time, status } = req.body;
  const existing = db.prepare('SELECT * FROM habit WHERE id = ?').get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  db.prepare(
    'UPDATE habit SET name = ?, time = ?, status = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    time ?? existing.time,
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

module.exports = {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
};