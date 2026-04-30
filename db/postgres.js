const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT) || 5432,
  database: process.env.PG_DB || 'Sw_auditoria',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || ''
});

async function initPostgres() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK(role IN ('admin','auditor')),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('PostgreSQL listo');

  const { rows } = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
  if (rows.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4)",
      ['admin', 'admin@municipio.cl', hash, 'admin']
    );
    console.log('Admin creado → usuario: admin  contraseña: admin123');
  }
}

module.exports = { pool, initPostgres };
