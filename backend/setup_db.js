const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function setupDatabase() {
    try {
        console.log('Setting up database...');

        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split the schema into individual statements
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.trim().substring(0, 50) + '...');
                await pool.query(statement);
            }
        }

        console.log('✅ Database setup completed successfully');
    } catch (error) {
        console.error('❌ Database setup failed:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase();
