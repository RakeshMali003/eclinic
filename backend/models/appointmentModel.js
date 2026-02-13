const supabase = require('../config/supabase');

class Appointment {
    static async create(appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async findAll(limit = 10, offset = 0) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    static async findByDoctor(doctorId) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId)
            .order('appointment_date', { ascending: true });

        if (error) throw error;
        return data;
    }

    static async findByPatient(patientId) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patientId)
            .order('appointment_date', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('appointment_id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = Appointment;
