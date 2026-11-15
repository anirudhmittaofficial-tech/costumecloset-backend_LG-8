const express = require('express');
const db = require('../db');
const { isValidId, validateHire } = require('../validators');
const router = express.Router();

// GET /hires  -> JOIN: hires with actor name and costume name
router.get('/', (req, res) => {
  const sql = `
    SELECT h.id, a.name AS actor_name, c.name AS costume_name,
           h.hire_date, h.due_date, h.returned_date
    FROM hires h
    JOIN actors a ON h.actor_id = a.id
    JOIN costumes c ON h.costume_id = c.id`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// POST /hires
router.post('/', (req, res) => {
  const error = validateHire(req.body);
  if (error) return res.status(400).json({ error });

  const { actor_id, costume_id, hire_date, due_date } = req.body;

  db.get('SELECT id FROM actors WHERE id = ?', [actor_id], (err, actor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!actor) return res.status(404).json({ error: 'Actor not found' });

    db.get('SELECT id FROM costumes WHERE id = ? AND deleted = 0', [costume_id], (err2, costume) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (!costume) return res.status(404).json({ error: 'Costume not found' });

      db.run('INSERT INTO hires (actor_id, costume_id, hire_date, due_date) VALUES (?, ?, ?, ?)',
        [actor_id, costume_id, hire_date, due_date], function (err3) {
          if (err3) return res.status(500).json({ error: err3.message });
          res.status(201).json({ id: this.lastID, actor_id, costume_id, hire_date, due_date, returned_date: null });
        });
    });
  });
});

// PUT /hires/:id/return  -> mark a costume as returned today
router.put('/:id/return', (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'id must be a positive whole number' });

  const today = new Date().toISOString().slice(0, 10);
  db.run('UPDATE hires SET returned_date = ? WHERE id = ? AND returned_date IS NULL',
    [today, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: 'Hire not found or already returned' });
      res.status(200).json({ message: 'Hire ' + req.params.id + ' returned on ' + today });
    });
});

module.exports = router;
