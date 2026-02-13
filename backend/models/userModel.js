const supabase = require('../config/supabase');

class User {
    static async create(userData) {
        const { full_name, email, mobile_number, role, password_hash } = userData;
        const { data, error } = await supabase
            .from('users')
            .insert([
                { full_name, email, mobile_number, role: role || 'PATIENT', password_hash }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, email, mobile_number, role')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }
}

module.exports = User;
