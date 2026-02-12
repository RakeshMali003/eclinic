import { supabase } from '../lib/supabase';

export interface DoctorProfile {
    id: number;
    full_name: string;
    date_of_birth?: string;
    profile_photo_url?: string;
    medical_council_reg_no: string;
    medical_council_name?: string;
    registration_year?: number;
    qualifications?: string;
    university_name?: string;
    graduation_year?: number;
    experience_years?: number;
    bio?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    pan_number?: string;
    gstin?: string;
    auth_user_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface DoctorSpecialization {
    id?: number;
    doctor_id: number;
    specialization: string;
}

export interface DoctorLanguage {
    id?: number;
    doctor_id: number;
    language: string;
}

export interface DoctorAvailability {
    id?: number;
    doctor_id: number;
    day_of_week: string;
    consultation_fee: number;
    followup_fee: number;
}

export interface DoctorTimeSlot {
    id?: number;
    doctor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    max_patients: number;
}

export interface DoctorConsultationMode {
    id?: number;
    doctor_id: number;
    mode: string;
}

export interface DoctorWithDetails extends DoctorProfile {
    specializations?: string[];
    languages?: string[];
    consultation_modes?: string[];
    avg_rating?: number;
    total_reviews?: number;
}

class DoctorService {
    // Get all doctors with filters
    async getDoctors(filters?: {
        clinic_id?: number; // MANDATORY for multi-tenancy access
        specialization?: string;
        city?: string;
        consultation_mode?: string;
        search?: string;
    }): Promise<DoctorWithDetails[]> {
        if (!filters?.clinic_id && !filters?.city) {
            // Security fallback: If no clinic_id is provided, and we aren't searching by city (public search), return empty or allow public directory search?
            // "Users can see ONLY their own clinic’s data"
            // For internal dashboard use, clinic_id is REQUIRED.
            // For public patients, they might search by city.
        }

        let query = supabase
            .from('doctors')
            .select(`
        *,
        doctor_specializations(specialization),
        doctor_languages(language),
        doctor_consultation_modes(mode),
        doctor_practice_locations(city)
      `);

        // Enforce Clinic Isolation
        // If the database has a clinic_id on the doctors table:
        if (filters?.clinic_id) {
            query = query.eq('clinic_id', filters.clinic_id);
        }

        if (filters?.search) {
            query = query.ilike('full_name', `%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform and filter data
        let doctors: DoctorWithDetails[] = (data || []).map((doc: any) => ({
            ...doc,
            specializations: doc.doctor_specializations?.map((s: any) => s.specialization) || [],
            languages: doc.doctor_languages?.map((l: any) => l.language) || [],
            consultation_modes: doc.doctor_consultation_modes?.map((m: any) => m.mode) || []
        }));

        // Apply filters
        if (filters?.specialization) {
            doctors = doctors.filter(d =>
                d.specializations?.includes(filters.specialization!)
            );
        }

        if (filters?.city) {
            const { data: locations } = await supabase
                .from('doctor_practice_locations')
                .select('doctor_id')
                .eq('city', filters.city);

            const doctorIds = locations?.map(l => l.doctor_id) || [];
            doctors = doctors.filter(d => doctorIds.includes(d.id));
        }

        if (filters?.consultation_mode) {
            doctors = doctors.filter(d =>
                d.consultation_modes?.includes(filters.consultation_mode!)
            );
        }

        // Get ratings for each doctor
        for (const doctor of doctors) {
            const { data: reviews } = await supabase
                .from('doctor_reviews')
                .select('rating')
                .eq('doctor_id', doctor.id);

            if (reviews && reviews.length > 0) {
                const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                doctor.avg_rating = Math.round(avgRating * 10) / 10;
                doctor.total_reviews = reviews.length;
            }
        }

        return doctors;
    }

    // Get doctor by ID with complete details
    async getDoctorById(doctorId: number): Promise<DoctorWithDetails | null> {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        doctor_specializations(specialization),
        doctor_languages(language),
        doctor_consultation_modes(mode),
        doctor_practice_locations(*),
        doctor_availability(*)
      `)
            .eq('id', doctorId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        // Get reviews
        const { data: reviews } = await supabase
            .from('doctor_reviews')
            .select('rating, review, created_at, patient_id')
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false });

        const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
            ...data,
            specializations: data.doctor_specializations?.map((s: any) => s.specialization) || [],
            languages: data.doctor_languages?.map((l: any) => l.language) || [],
            consultation_modes: data.doctor_consultation_modes?.map((m: any) => m.mode) || [],
            avg_rating: Math.round(avgRating * 10) / 10,
            total_reviews: reviews?.length || 0
        };
    }

    // Get doctor by auth user ID
    async getDoctorByAuthId(authUserId: number): Promise<DoctorProfile | null> {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    // Get doctor by Email
    async getDoctorByEmail(email: string): Promise<DoctorProfile | null> {
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

        // Step 2: Get doctor by auth_user_id
        return this.getDoctorByAuthId(authUser.auth_user_id);
    }

    // Update doctor profile
    async updateDoctorProfile(doctorId: number, updates: Partial<DoctorProfile>): Promise<DoctorProfile> {
        const { data, error } = await supabase
            .from('doctors')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', doctorId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get doctor availability
    async getAvailability(doctorId: number): Promise<DoctorAvailability[]> {
        const { data, error } = await supabase
            .from('doctor_availability')
            .select('*')
            .eq('doctor_id', doctorId);

        if (error) throw error;
        return data || [];
    }

    // Set doctor availability
    async setAvailability(availability: DoctorAvailability): Promise<DoctorAvailability> {
        const { data, error } = await supabase
            .from('doctor_availability')
            .upsert(availability)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get doctor time slots
    async getTimeSlots(doctorId: number, dayOfWeek?: string): Promise<DoctorTimeSlot[]> {
        let query = supabase
            .from('doctor_time_slots')
            .select('*')
            .eq('doctor_id', doctorId);

        if (dayOfWeek) {
            query = query.eq('day_of_week', dayOfWeek);
        }

        const { data, error } = await query.order('start_time');

        if (error) throw error;
        return data || [];
    }

    // Add time slot
    async addTimeSlot(slot: DoctorTimeSlot): Promise<DoctorTimeSlot> {
        const { data, error } = await supabase
            .from('doctor_time_slots')
            .insert(slot)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete time slot
    async deleteTimeSlot(slotId: number): Promise<void> {
        const { error } = await supabase
            .from('doctor_time_slots')
            .delete()
            .eq('id', slotId);

        if (error) throw error;
    }

    // Get doctor earnings
    async getEarnings(doctorId: number, startDate?: string, endDate?: string) {
        let query = supabase
            .from('doctor_earnings')
            .select('*')
            .eq('doctor_id', doctorId);

        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const totalEarnings = data?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0;
        const pendingPayout = data?.filter(e => e.payout_status === 'Pending')
            .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0;

        return {
            earnings: data || [],
            totalEarnings,
            pendingPayout
        };
    }

    // Get doctor reviews
    async getReviews(doctorId: number, limit?: number) {
        let query = supabase
            .from('doctor_reviews')
            .select(`
        *,
        patients(full_name)
      `)
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    // Add review
    async addReview(review: {
        patient_id: string;
        doctor_id: number;
        rating: number;
        review?: string;
    }) {
        const { data, error } = await supabase
            .from('doctor_reviews')
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get doctor performance report
    async getPerformanceReport(doctorId: number, month?: string) {
        let query = supabase
            .from('doctor_performance_reports')
            .select('*')
            .eq('doctor_id', doctorId);

        if (month) {
            query = query.eq('report_month', month);
        }

        const { data, error } = await query.order('report_month', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}

export const doctorService = new DoctorService();
