require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectMongo } = require('./db/mongo');
const { initPostgres } = require('./db/postgres');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/users', require('./routes/users'));
app.use('/api/config', require('./routes/config'));

async function start() {
  try {
    await connectMongo();
    await initPostgres();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (e) {
    console.error('Error al iniciar:', e.message);
    process.exit(1);
  }
}

start();
