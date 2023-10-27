const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'projetosistemabancario',
  user: 'postgres',
  password: 'Davib2025b'
});

module.exports = pool;
