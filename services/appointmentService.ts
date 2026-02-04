import { supabase } from '../lib/supabase';

export interface Appointment {
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    type?: string;
    mode?: string;
    status: string;
    ai_risk_level?: string;
    consult_duration?: number;
    earnings?: number;
}

export interface AppointmentWithDetails extends Appointment {
    patient_name?: string;
    doctor_name?: string;
    doctor_specialization?: string;
}

export interface AppointmentHistory {
    id?: number;
    appointment_id: string;
    old_status: string;
    new_status: string;
    changed_by?: string;
    changed_at?: string;
}

export interface Vitals {
    patient_id: string;
    bp?: string;
    heart_rate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    reading_time?: string;
}

class AppointmentService {
    // Generate unique appointment ID
    private generateAppointmentId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        return `APT${timestamp}${random}`.toUpperCase();
    }

    // Create new appointment
    async createAppointment(data: Omit<Appointment, 'appointment_id'>): Promise<Appointment> {
        const appointmentId = this.generateAppointmentId();

        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                appointment_id: appointmentId,
                ...data,
                status: data.status || 'Booked'
            })
            .select()
            .single();

        if (error) throw error;

        // Log appointment creation
        await this.logAppointmentHistory({
            appointment_id: appointmentId,
            old_status: '',
            new_status: data.status || 'Booked',
            changed_by: data.patient_id
        });

        return appointment;
    }

    // Get appointments with filters
    async getAppointments(filters?: {
        clinic_id?: number | string; // ADDED: Required for clinic-wide view
        patient_id?: string;
        doctor_id?: string;
        date?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<AppointmentWithDetails[]> {
        let query = supabase
            .from('appointments')
            .select(`
        *,
        patients(full_name),
        doctors(full_name)
      `);

        // Enforce Clinic Isolation
        if (filters?.clinic_id) {
            query = query.eq('clinic_id', filters.clinic_id);
        }

        if (filters?.patient_id) {
            query = query.eq('patient_id', filters.patient_id);
        }
        if (filters?.doctor_id) {
            query = query.eq('doctor_id', filters.doctor_id);
        }
        if (filters?.date) {
            query = query.eq('appointment_date', filters.date);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.startDate) {
            query = query.gte('appointment_date', filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte('appointment_date', filters.endDate);
        }

        const { data, error } = await query.order('appointment_date', { ascending: false });

        if (error) throw error;

        return (data || []).map((apt: any) => ({
            ...apt,
            patient_name: apt.patients?.full_name,
            doctor_name: apt.doctors?.full_name
        }));
    }

    // Get appointment by ID
    async getAppointmentById(appointmentId: string): Promise<AppointmentWithDetails | null> {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patients(*),
        doctors(*)
      `)
            .eq('appointment_id', appointmentId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return {
            ...data,
            patient_name: data.patients?.full_name,
            doctor_name: data.doctors?.full_name
        };
    }

    // Update appointment status
    async updateAppointmentStatus(
        appointmentId: string,
        newStatus: string,
        changedBy?: string
    ): Promise<Appointment> {
        // Get current appointment
        const current = await this.getAppointmentById(appointmentId);
        if (!current) throw new Error('Appointment not found');

        // Update status
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('appointment_id', appointmentId)
            .select()
            .single();

        if (error) throw error;

        // Log status change
        await this.logAppointmentHistory({
            appointment_id: appointmentId,
            old_status: current.status,
            new_status: newStatus,
            changed_by: changedBy
        });

        return data;
    }

    // Cancel appointment
    async cancelAppointment(appointmentId: string, cancelledBy?: string): Promise<void> {
        await this.updateAppointmentStatus(appointmentId, 'Cancelled', cancelledBy);
    }

    // Reschedule appointment
    async rescheduleAppointment(
        appointmentId: string,
        newDate: string,
        newTime: string,
        changedBy?: string
    ): Promise<Appointment> {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                appointment_date: newDate,
                appointment_time: newTime,
                status: 'Rescheduled'
            })
            .eq('appointment_id', appointmentId)
            .select()
            .single();

        if (error) throw error;

        // Log reschedule
        await this.logAppointmentHistory({
            appointment_id: appointmentId,
            old_status: 'Booked',
            new_status: 'Rescheduled',
            changed_by: changedBy
        });

        return data;
    }

    // Get appointment history
    async getAppointmentHistory(appointmentId: string): Promise<AppointmentHistory[]> {
        const { data, error } = await supabase
            .from('appointment_history')
            .select('*')
            .eq('appointment_id', appointmentId)
            .order('changed_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Log appointment history
    private async logAppointmentHistory(history: AppointmentHistory): Promise<void> {
        const { error } = await supabase
            .from('appointment_history')
            .insert(history);

        if (error) console.error('Failed to log appointment history:', error);
    }

    // Record patient vitals
    async recordVitals(vitals: Vitals): Promise<Vitals> {
        const { data, error } = await supabase
            .from('vitals')
            .insert({
                ...vitals,
                reading_time: vitals.reading_time || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get patient vitals history
    async getVitalsHistory(patientId: string, limit?: number): Promise<Vitals[]> {
        let query = supabase
            .from('vitals')
            .select('*')
            .eq('patient_id', patientId)
            .order('reading_time', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    // Get today's appointments for a doctor
    async getTodayAppointments(doctorId: string): Promise<AppointmentWithDetails[]> {
        const today = new Date().toISOString().split('T')[0];
        return this.getAppointments({
            doctor_id: doctorId,
            date: today
        });
    }

    // Get upcoming appointments for a patient
    async getUpcomingAppointments(patientId: string): Promise<AppointmentWithDetails[]> {
        const today = new Date().toISOString().split('T')[0];
        return this.getAppointments({
            patient_id: patientId,
            startDate: today
        });
    }

    // Check slot availability
    async checkSlotAvailability(
        doctorId: string,
        date: string,
        time: string
    ): Promise<boolean> {
        const { data, error } = await supabase
            .from('appointments')
            .select('appointment_id')
            .eq('doctor_id', doctorId)
            .eq('appointment_date', date)
            .eq('appointment_time', time)
            .neq('status', 'Cancelled');

        if (error) throw error;
        return !data || data.length === 0;
    }

    // Get appointment statistics
    async getAppointmentStats(filters?: {
        doctor_id?: string;
        patient_id?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const appointments = await this.getAppointments(filters);

        const stats = {
            total: appointments.length,
            booked: appointments.filter(a => a.status === 'Booked').length,
            confirmed: appointments.filter(a => a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length,
            totalEarnings: appointments
                .filter(a => a.status === 'Completed')
                .reduce((sum, a) => sum + (a.earnings || 0), 0)
        };

        return stats;
    }
}

export const appointmentService = new AppointmentService();
