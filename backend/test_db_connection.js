const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

        // Test basic connection
        const client = await pool.connect();
        console.log('✅ Connected to database');

        // Test query
        const result = await client.query('SELECT NOW()');
        console.log('✅ Query successful, current time:', result.rows[0].now);

        // Check users table
        const tableResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'users'
        `);

        if (tableResult.rows.length > 0) {
            console.log('✅ Users table exists');

            // Check columns
            const columnResult = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'users'
                ORDER BY ordinal_position
            `);

            console.log('Users table columns:');
            columnResult.rows.forEach(row => {
                console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
            });

            // Test a simple user query
            try {
                const userResult = await client.query('SELECT COUNT(*) as count FROM users');
                console.log(`✅ Users table query successful, ${userResult.rows[0].count} users`);
            } catch (userError) {
                console.log('❌ Users table query failed:', userError.message);
            }

        } else {
            console.log('❌ Users table does not exist');
        }

        client.release();
        console.log('✅ Database connection test completed successfully');

    } catch (error) {
        console.error('❌ Database connection test failed:', error);
    } finally {
        await pool.end();
    }
}

testConnection();
