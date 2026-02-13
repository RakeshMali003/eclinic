import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function setupSchema() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Read the schema.sql file
        const schemaSQL = fs.readFileSync('schema.sql', 'utf8');

        // Split the SQL into individual statements (basic split by semicolon)
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            if (statement.trim()) {
                await client.query(statement);
            }
        }

        console.log('Schema setup completed successfully');

    } catch (err) {
        console.error('Error setting up schema:', err);
    } finally {
        await client.end();
    }
}

setupSchema();
