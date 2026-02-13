const supabase = require('../config/supabase');

class Doctor {
    static async create(doctorData) {
        const { data, error } = await supabase
            .from('doctors')
            .insert([doctorData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async findAll(limit = 10, offset = 0) {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    static async count() {
        const { count, error } = await supabase
            .from('doctors')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    }
}

module.exports = Doctor;
