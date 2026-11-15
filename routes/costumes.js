const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT id, name, era FROM costumes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT id, name, era FROM costumes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Costume not found' });
    res.status(200).json(row);
  });
});

router.post('/', (req, res) => {
  const { name, era } = req.body;
  db.run('INSERT INTO costumes (name, era) VALUES (?, ?)', [name, era], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, era });
  });
});

router.put('/:id', (req, res) => {
  const { name, era } = req.body;
  db.run('UPDATE costumes SET name = ?, era = ? WHERE id = ?', [name, era, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Costume not found' });
    res.status(200).json({ id: Number(req.params.id), name, era });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM costumes WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Costume not found' });
    res.status(200).json({ message: 'Costume deleted' });
  });
});

module.exports = router;
