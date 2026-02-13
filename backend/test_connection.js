const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Testing connection with:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('❌ Pool error:', err.message);
});

console.log('Connecting...');
pool.query('SELECT NOW()')
    .then(res => {
        console.log('✅ Connection successful:', res.rows[0]);
        pool.end();
    })
    .catch(err => {
        console.error('❌ Query failed:', err.message);
        pool.end();
    });

