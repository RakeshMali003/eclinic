import { supabase } from '../lib/supabase';

export interface ClinicProfile {
    id: number;
    clinic_name: string;
    establishment_year?: number;
    tagline?: string;
    description?: string;
    address: string;
    landmark?: string;
    pin_code: string;
    city: string;
    state: string;
    mobile: string;
    email: string;
    website?: string;
    medical_council_reg_no: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    pan_number?: string;
    gstin?: string;
    verification_status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClinicStaff {
    id?: number;
    clinic_id: number;
    full_name: string;
    role: 'Admin' | 'Receptionist' | 'Nurse' | 'Lab Technician' | 'Pharmacist';
    email?: string;
    mobile?: string;
    is_active: boolean;
    created_at?: string;
}

export interface ClinicServiceItem {
    id?: number;
    clinic_id: number;
    service_type: string;
    consultation_mode?: string;
    fee_amount?: number;
}

export interface ClinicFacility {
    id?: number;
    clinic_id: number;
    facility_name: string;
}

export interface DashboardMetrics {
    metric_date: string;
    total_appointments: number;
    total_revenue: number;
    active_patients: number;
    pending_payments: number;
}

class ClinicService {
    // Get clinic by ID
    async getClinicById(clinicId: number): Promise<ClinicProfile | null> {
        const { data, error } = await supabase
            .from('clinics')
            .select('*')
            .eq('id', clinicId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    // Get clinic by auth user ID
    async getClinicByAuthId(authUserId: number): Promise<ClinicProfile | null> {
        const { data, error } = await supabase
            .from('clinics')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    // Get clinic by Email
    async getClinicByEmail(email: string): Promise<ClinicProfile | null> {
        // Step 1: Get auth_user_id from auth_users
        const { data: authUser, error: authError } = await supabase
            .from('auth_users')
            .select('auth_user_id')
            .eq('email', email)
            .single();

        if (authError || !authUser) {
            console.error("Error finding auth user by email:", authError);
            return null;
        }

        // Step 2: Get clinic by auth_user_id
        return this.getClinicByAuthId(authUser.auth_user_id);
    }

    // Update clinic profile
    async updateClinicProfile(clinicId: number, updates: Partial<ClinicProfile>): Promise<ClinicProfile> {
        const { data, error } = await supabase
            .from('clinics')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', clinicId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get clinic staff
    async getClinicStaff(clinicId: number, role?: string): Promise<ClinicStaff[]> {
        let query = supabase
            .from('clinic_staff')
            .select('*')
            .eq('clinic_id', clinicId);

        if (role) {
            query = query.eq('role', role);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Add clinic staff
    async addClinicStaff(staff: Omit<ClinicStaff, 'id'>): Promise<ClinicStaff> {
        const { data, error } = await supabase
            .from('clinic_staff')
            .insert(staff)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update clinic staff
    async updateClinicStaff(staffId: number, updates: Partial<ClinicStaff>): Promise<ClinicStaff> {
        const { data, error } = await supabase
            .from('clinic_staff')
            .update(updates)
            .eq('id', staffId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete clinic staff
    async deleteClinicStaff(staffId: number): Promise<void> {
        const { error } = await supabase
            .from('clinic_staff')
            .delete()
            .eq('id', staffId);

        if (error) throw error;
    }

    // Get clinic services
    async getClinicServices(clinicId: number): Promise<ClinicServiceItem[]> {
        const { data, error } = await supabase
            .from('clinic_services')
            .select('*')
            .eq('clinic_id', clinicId);

        if (error) throw error;
        return data || [];
    }

    // Add clinic service
    async addClinicService(service: Omit<ClinicServiceItem, 'id'>): Promise<ClinicServiceItem> {
        const { data, error } = await supabase
            .from('clinic_services')
            .insert(service)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete clinic service
    async deleteClinicService(serviceId: number): Promise<void> {
        const { error } = await supabase
            .from('clinic_services')
            .delete()
            .eq('id', serviceId);

        if (error) throw error;
    }

    // Get clinic facilities
    async getClinicFacilities(clinicId: number): Promise<ClinicFacility[]> {
        const { data, error } = await supabase
            .from('clinic_facilities')
            .select('*')
            .eq('clinic_id', clinicId);

        if (error) throw error;
        return data || [];
    }

    // Add clinic facility
    async addClinicFacility(facility: Omit<ClinicFacility, 'id'>): Promise<ClinicFacility> {
        const { data, error } = await supabase
            .from('clinic_facilities')
            .insert(facility)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete clinic facility
    async deleteClinicFacility(facilityId: number): Promise<void> {
        const { error } = await supabase
            .from('clinic_facilities')
            .delete()
            .eq('id', facilityId);

        if (error) throw error;
    }

    // Get dashboard metrics
    async getDashboardMetrics(clinicId: number, date?: string): Promise<DashboardMetrics | null> {
        const targetDate = date || new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('dashboard_metrics')
            .select('*')
            .eq('metric_date', targetDate)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Calculate metrics if not exists
                return this.calculateDashboardMetrics(clinicId, targetDate);
            }
            throw error;
        }

        return data;
    }

    // Calculate dashboard metrics
    private async calculateDashboardMetrics(clinicId: number, date: string): Promise<DashboardMetrics> {
        // This would need to aggregate data from appointments, invoices, etc.
        // For now, return basic structure
        const { data: appointments } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_date', date);

        const { data: invoices } = await supabase
            .from('invoices')
            .select('total_amount, status')
            .eq('invoice_date', date);

        const totalAppointments = appointments?.length || 0;
        const totalRevenue = invoices?.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0) || 0;
        const pendingPayments = invoices?.filter(inv => inv.status === 'Pending').length || 0;

        return {
            metric_date: date,
            total_appointments: totalAppointments,
            total_revenue: totalRevenue,
            active_patients: 0, // Would need to calculate unique patients
            pending_payments: pendingPayments
        };
    }

    // Get clinic analytics
    async getClinicAnalytics(clinicId: number, startDate: string, endDate: string) {
        // Get appointments in date range
        const { data: appointments } = await supabase
            .from('appointments')
            .select('*')
            .gte('appointment_date', startDate)
            .lte('appointment_date', endDate);

        // Get invoices in date range
        const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .gte('invoice_date', startDate)
            .lte('invoice_date', endDate);

        const totalAppointments = appointments?.length || 0;
        const completedAppointments = appointments?.filter(a => a.status === 'Completed').length || 0;
        const totalRevenue = invoices?.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0) || 0;
        const paidRevenue = invoices?.filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0) || 0;

        return {
            totalAppointments,
            completedAppointments,
            totalRevenue,
            paidRevenue,
            pendingRevenue: totalRevenue - paidRevenue
        };
    }
}

export const clinicService = new ClinicService();
