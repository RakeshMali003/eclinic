const supabase = require('../config/supabase');

class Patient {
    static async create(patientData) {
        const { data, error } = await supabase
            .from('patients')
            .insert([patientData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async findAll(limit = 10, offset = 0) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('patient_id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    static async findByPhone(phone) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    static async update(id, updates) {
        const { data, error } = await supabase
            .from('patients')
            .update(updates)
            .eq('patient_id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { data, error } = await supabase
            .from('patients')
            .delete()
            .eq('patient_id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async count() {
        const { count, error } = await supabase
            .from('patients')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    }
}

module.exports = Patient;
