const { pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5342,
  database: '',
  user: 'postgres',
  password: 'Davib2025b'
});

module.exports = pool;
