const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('costumecloset.db', (err) => {
  if (err) console.error('Database error:', err.message);
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS costumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    era TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id INTEGER NOT NULL,
    costume_id INTEGER NOT NULL,
    hire_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    returned_date TEXT,
    FOREIGN KEY (actor_id) REFERENCES actors(id),
    FOREIGN KEY (costume_id) REFERENCES costumes(id)
  )`);
});

module.exports = db;
