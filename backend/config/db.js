const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'habits-tracker.db');
const db = new Database(dbPath);

// Recommended pragma for better concurrency/performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const createHabitTable = `
CREATE TABLE IF NOT EXISTS habit (
  id     TEXT PRIMARY KEY NOT NULL,
  name   TEXT NOT NULL,
  time   TEXT NOT NULL,
  color  TEXT NOT NULL DEFAULT 'gold',
  status TEXT NOT NULL DEFAULT 'pending'
);
`;

const habitColumns = db.prepare('PRAGMA table_info(habit)').all();
const needsMigration = habitColumns.length > 0 && (
  habitColumns.find((column) => column.name === 'id')?.type !== 'TEXT' ||
  !habitColumns.some((column) => column.name === 'color')
);

if (needsMigration) {
  db.transaction(() => {
    db.exec('ALTER TABLE habit RENAME TO habit_legacy');
    db.exec(createHabitTable);
    db.exec(`
      INSERT INTO habit (id, name, time, color, status)
      SELECT CAST(id AS TEXT), name, time, 'gold', status
      FROM habit_legacy
    `);
    db.exec('DROP TABLE habit_legacy');
  })();
} else {
  db.exec(createHabitTable);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS habit_completion (
    habit_id       TEXT NOT NULL,
    completed_date TEXT NOT NULL,
    completed_at   TEXT NOT NULL,
    PRIMARY KEY (habit_id, completed_date),
    FOREIGN KEY (habit_id) REFERENCES habit(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_habit_completion_date
  ON habit_completion(completed_date);
`);

module.exports = db;