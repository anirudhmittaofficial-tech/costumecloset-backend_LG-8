const express = require('express');
const db = require('../db');
const { validateActor } = require('../validators');
const router = express.Router();

// GET /actors
router.get('/', (req, res) => {
  db.all('SELECT * FROM actors', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// POST /actors
router.post('/', (req, res) => {
  const error = validateActor(req.body);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  const phone = req.body.phone || null;
  db.run('INSERT INTO actors (name, phone) VALUES (?, ?)', [name, phone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, phone });
  });
});

module.exports = router;
