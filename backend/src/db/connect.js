import { DatabaseSync } from 'node:sqlite';

// Open a file-based database (creates it if it doesn't exist)
// Use ':memory:' instead of a filename for a temporary in-memory database
const db = new DatabaseSync('my_database.db');

// 1. Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  );
`);

// 2. Insert data using a prepared statement
const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
const result = insertUser.run('Alice Smith', 'alice@example.com');
console.log(`Inserted row ID: ${result.lastInsertRowid}`);

// 3. Query data
const selectUsers = db.prepare('SELECT * FROM users WHERE name = ?');
const users = selectUsers.all('Alice Smith');
