const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'habits-tracker.db');
const db = new Database(dbPath);

// Recommended pragma for better concurrency/performance
db.pragma('journal_mode = WAL');

const createHabitTable = `
CREATE TABLE IF NOT EXISTS habit (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT NOT NULL,
  time   TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);
`;

db.exec(createHabitTable);

module.exports = db;