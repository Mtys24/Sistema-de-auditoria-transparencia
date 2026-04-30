const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../db/postgres');
const { auth } = require('../middleware/auth');

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, email, role, active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!['admin', 'auditor'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, username, email, role, active',
      [username, email, hash, role]
    );
    res.json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Usuario o email ya existe' });
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id/toggle', auth(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET active = NOT active WHERE id=$1 RETURNING id, username, active',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (role && !['admin', 'auditor'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    let query = 'UPDATE users SET username=$1, email=$2, role=$3 WHERE id=$4';
    let params = [username, email, role, req.params.id];

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET username=$1, email=$2, role=$3, password_hash=$5 WHERE id=$4';
      params.push(hash);
    }

    await pool.query(query, params);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1 AND role != $2', [req.params.id, 'admin']);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
