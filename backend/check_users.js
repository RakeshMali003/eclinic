const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function checkUsers() {
    try {
        console.log('Checking users in database...');
        const result = await pool.query('SELECT user_id, full_name, email, role FROM users');
        console.log('Users:');
        result.rows.forEach(user => {
            console.log(`ID: ${user.user_id}, Name: ${user.full_name}, Email: ${user.email}, Role: ${user.role}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkUsers();
