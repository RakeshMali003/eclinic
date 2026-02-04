const pool = require('./config/database');

async function checkSchema() {
    console.log('Checking auth_users table schema via pg...');
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'auth_users'
            ORDER BY ordinal_position;
        `);

        if (res.rows.length === 0) {
            console.log('Table auth_users not found or no columns.');
        } else {
            console.log('Columns found:');
            res.rows.forEach(row => {
                console.log(`${row.column_name}: ${row.data_type}`);
            });
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
    await pool.end();
    process.exit();
}

checkSchema();
