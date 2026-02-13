const supabase = require('./config/supabase');

async function testSupabase() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(5);

        if (error) {
            console.error('❌ Supabase error:', error.message);
        } else {
            console.log('✅ Users fetched:', JSON.stringify(data, null, 2));
        }

        const { data: doctors, error: dError } = await supabase.from('doctors').select('*').limit(1);
        if (dError) console.error('❌ Doctors error:', dError.message);
        else console.log('✅ Doctors fetched:', JSON.stringify(doctors, null, 2));

        const { data: billing, error: bError } = await supabase.from('invoices').select('*').limit(1);
        if (bError) console.error('❌ Invoices error:', bError.message);
        else console.log('✅ Invoices fetched:', JSON.stringify(billing, null, 2));

        const { data: appts, error: aError } = await supabase.from('appointments').select('*').limit(1);
        if (aError) console.error('❌ Appointments error:', aError.message);
        else console.log('✅ Appointments fetched:', JSON.stringify(appts, null, 2));

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

testSupabase();
