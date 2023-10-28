const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'projetosistemabancario',
  user: 'SEU USUARIO AQUI',
  password: 'SUA SENHA AQUI'
});

module.exports = pool;
