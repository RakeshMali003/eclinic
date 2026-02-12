const supabase = require('./config/supabase');

async function checkSchema() {
    console.log('Checking auth_users table...');
    try {
        const { data, error } = await supabase
            .from('auth_users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error querying auth_users:', error.message);
            if (error.code === '42P01') {
                console.log('Table auth_users does not exist.');
            }
        } else {
            console.log('auth_users table exists.');
            console.log('Columns found:', Object.keys(data[0] || {}));
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
    process.exit();
}

checkSchema();
