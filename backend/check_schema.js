const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' AND table_schema = \'public\' ORDER BY ordinal_position;')
  .then(res => {
    console.log('Users table schema:');
    res.rows.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
    pool.end();
  })
  .catch(err => {
    console.error('Error:', err.message);
    pool.end();
  });
