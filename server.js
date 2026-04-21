const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, seed } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize and seed database
const db = initDB();
seed(db);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── API ROUTES ───────────────────────────────────────────────

// GET /api/items — list items with optional filters
app.get('/api/items', (req, res) => {
  const { status, area, section, search } = req.query;

  let sql = `
    SELECT DISTINCT i.id, i.name, i.section, i.section_name,
           i.status, i.tag, i.detail, i.prev_observation,
           i.deadline, i.created_at, i.updated_at
    FROM items i
    LEFT JOIN item_areas ia ON i.id = ia.item_id
    LEFT JOIN areas a ON ia.area_id = a.id
    WHERE 1=1
  `;
  const params = [];

  if (status && status !== 'all') {
    sql += ' AND i.status = ?';
    params.push(status);
  }

  if (area && area !== 'all') {
    sql += ' AND a.name = ?';
    params.push(area);
  }

  if (section && section !== 'all') {
    sql += ' AND i.section = ?';
    params.push(section);
  }

  if (search) {
    sql += ' AND (LOWER(i.name) LIKE ? OR LOWER(i.section_name) LIKE ?)';
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
  }

  sql += ' ORDER BY i.section ASC, i.id ASC';

  const items = db.prepare(sql).all(...params);

  // Attach areas to each item
  const getAreas = db.prepare(`
    SELECT a.name FROM areas a
    JOIN item_areas ia ON a.id = ia.area_id
    WHERE ia.item_id = ?
  `);

  const result = items.map(item => ({
    ...item,
    areas: getAreas.all(item.id).map(a => a.name)
  }));

  res.json(result);
});

// GET /api/stats — aggregate counts with optional filters
app.get('/api/stats', (req, res) => {
  const { area, section } = req.query;

  let conditions = [];
  const params = [];

  if (area && area !== 'all') {
    conditions.push(`i.id IN (
      SELECT ia.item_id FROM item_areas ia
      JOIN areas a ON ia.area_id = a.id
      WHERE a.name = ?
    )`);
    params.push(area);
  }

  if (section && section !== 'all') {
    conditions.push('i.section = ?');
    params.push(section);
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN i.status = 'ok' THEN 1 ELSE 0 END) as ok,
      SUM(CASE WHEN i.status = 'warn' THEN 1 ELSE 0 END) as warn,
      SUM(CASE WHEN i.status = 'bad' THEN 1 ELSE 0 END) as bad,
      SUM(CASE WHEN i.deadline IS NOT NULL AND i.status != 'ok' THEN 1 ELSE 0 END) as pending_deadline
    FROM items i
    ${whereClause}
  `).get(...params);

  res.json(stats);
});

// GET /api/areas — list all areas
app.get('/api/areas', (req, res) => {
  const areas = db.prepare('SELECT id, name FROM areas ORDER BY name ASC').all();
  res.json(areas);
});

// GET /api/sections — list all sections with counts
app.get('/api/sections', (req, res) => {
  const sections = db.prepare(`
    SELECT 
      section,
      section_name,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'ok' THEN 1 ELSE 0 END) as ok,
      SUM(CASE WHEN status = 'warn' THEN 1 ELSE 0 END) as warn,
      SUM(CASE WHEN status = 'bad' THEN 1 ELSE 0 END) as bad
    FROM items
    GROUP BY section, section_name
    ORDER BY section ASC
  `).all();

  res.json(sections);
});

// GET /api/deadlines — deadline summary
app.get('/api/deadlines', (req, res) => {
  const deadlines = db.prepare(`
    SELECT 
      deadline,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'ok' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status != 'ok' THEN 1 ELSE 0 END) as pending
    FROM items
    WHERE deadline IS NOT NULL
    GROUP BY deadline
    ORDER BY deadline ASC
  `).all();

  res.json(deadlines);
});

// GET /api/items/:id — single item detail
app.get('/api/items/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const areas = db.prepare(`
    SELECT a.name FROM areas a
    JOIN item_areas ia ON a.id = ia.area_id
    WHERE ia.item_id = ?
  `).all(item.id).map(a => a.name);

  res.json({ ...item, areas });
});

// PUT /api/items/:id — update item status/detail
app.put('/api/items/:id', (req, res) => {
  const { status, tag, detail } = req.body;
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  db.prepare(`
    UPDATE items SET
      status = COALESCE(?, status),
      tag = COALESCE(?, tag),
      detail = COALESCE(?, detail),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status || null, tag || null, detail || null, req.params.id);

  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  const areas = db.prepare(`
    SELECT a.name FROM areas a
    JOIN item_areas ia ON a.id = ia.area_id
    WHERE ia.item_id = ?
  `).all(updated.id).map(a => a.name);

  res.json({ ...updated, areas });
});

// ─── START SERVER ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  ✦ Auditoría Dashboard Server`);
  console.log(`  ➜ http://localhost:${PORT}\n`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
