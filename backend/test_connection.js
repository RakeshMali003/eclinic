const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('Password starts with:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.substring(0, 3) : 'N/A');
console.log('Password ends with:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.slice(-3) : 'N/A');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
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

