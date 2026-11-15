const express = require('express');
const db = require('../db');
const { isValidId, validateCostume } = require('../validators');
const router = express.Router();

// GET /costumes  (search: ?era=Victorian  or  ?name=gown)
router.get('/', (req, res) => {
  const { era, name } = req.query;
  let sql = 'SELECT id, name, era FROM costumes WHERE deleted = 0';
  const params = [];
  if (era)  { sql += ' AND era LIKE ?';  params.push('%' + era + '%'); }
  if (name) { sql += ' AND name LIKE ?'; params.push('%' + name + '%'); }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// GET /costumes/:id
router.get('/:id', (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'id must be a positive whole number' });

  db.get('SELECT id, name, era FROM costumes WHERE id = ? AND deleted = 0',
    [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Costume not found' });
      res.status(200).json(row);
    });
});

// POST /costumes
router.post('/', (req, res) => {
  const error = validateCostume(req.body);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  const era = req.body.era.trim();
  db.run('INSERT INTO costumes (name, era) VALUES (?, ?)', [name, era], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, era });
  });
});

// PUT /costumes/:id
router.put('/:id', (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'id must be a positive whole number' });
  const error = validateCostume(req.body);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  const era = req.body.era.trim();
  db.run('UPDATE costumes SET name = ?, era = ? WHERE id = ? AND deleted = 0',
    [name, era, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Costume not found' });
      res.status(200).json({ id: Number(req.params.id), name, era });
    });
});

// DELETE /costumes/:id  -> SOFT delete (only sets deleted = 1)
router.delete('/:id', (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'id must be a positive whole number' });

  db.run('UPDATE costumes SET deleted = 1 WHERE id = ? AND deleted = 0',
    [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Costume not found' });
      res.status(200).json({ message: 'Costume ' + req.params.id + ' deleted (hidden)' });
    });
});

// POST /costumes/:id/restore
router.post('/:id/restore', (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'id must be a positive whole number' });

  db.run('UPDATE costumes SET deleted = 0 WHERE id = ? AND deleted = 1',
    [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: 'Costume not found or not deleted' });
      db.get('SELECT id, name, era FROM costumes WHERE id = ?', [req.params.id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(200).json(row);
      });
    });
});

module.exports = router;
