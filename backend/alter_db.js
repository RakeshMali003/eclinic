const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function alterDatabase() {
    try {
        console.log('Altering database...');

        // Check if unique constraint exists
        const constraintCheck = await pool.query(`
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'users'::regclass AND conname = 'users_email_key';
        `);

        if (constraintCheck.rows.length === 0) {
            // Add unique constraint to email in users table
            await pool.query(`
                ALTER TABLE public.users
                ADD CONSTRAINT users_email_key UNIQUE (email);
            `);
            console.log('✅ Added unique constraint on email');
        } else {
            console.log('ℹ️ Unique constraint on email already exists');
        }

        // Rename phone to mobile_number if needed
        const columnCheck = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone';
        `);

        if (columnCheck.rows.length > 0) {
            await pool.query(`
                ALTER TABLE public.users
                RENAME COLUMN phone TO mobile_number;
            `);
            console.log('✅ Renamed phone to mobile_number');
        } else {
            console.log('ℹ️ Column already named mobile_number');
        }

        console.log('✅ Database alteration completed successfully');
    } catch (error) {
        console.error('❌ Database alteration failed:', error);
    } finally {
        await pool.end();
    }
}

alterDatabase();
