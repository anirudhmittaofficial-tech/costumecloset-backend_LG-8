const express = require('express');
const app = express();
app.use(express.json());

app.use('/actors', require('./routes/actors'));
app.use('/costumes', require('./routes/costumes'));
app.use('/hires', require('./routes/hires'));

app.get('/', (req, res) => res.json({ message: 'CostumeCloset API running' }));

// 404 handler (unknown route)
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Basic error handler (bad JSON, unexpected errors)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));

