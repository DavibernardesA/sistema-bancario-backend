const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATA,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

module.exports = pool;
