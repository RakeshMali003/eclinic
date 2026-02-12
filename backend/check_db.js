const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function checkDatabase() {
    try {
        console.log('Checking database...');

        // Check if users table exists
        const tableResult = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'users';
        `);

        if (tableResult.rows.length === 0) {
            console.log('❌ Users table does not exist');
            return;
        }

        console.log('✅ Users table exists');

        // Check columns in users table
        const columnResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'users'
            ORDER BY ordinal_position;
        `);

        console.log('Users table columns:');
        columnResult.rows.forEach(row => {
            console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${row.column_default ? 'DEFAULT ' + row.column_default : ''}`);
        });

        // Check constraints
        const constraintResult = await pool.query(`
            SELECT conname, contype, conkey, confkey
            FROM pg_constraint
            WHERE conrelid = 'users'::regclass;
        `);

        console.log('Users table constraints:');
        constraintResult.rows.forEach(row => {
            console.log(`  ${row.conname}: ${row.contype}`);
        });

    } catch (error) {
        console.error('❌ Database check failed:', error);
    } finally {
        await pool.end();
    }
}

checkDatabase();
