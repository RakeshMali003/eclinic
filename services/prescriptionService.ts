import { supabase } from '../lib/supabase';

export interface Prescription {
    prescription_id: string;
    patient_id: string;
    doctor_id: number;
    appointment_id?: number;
    diagnosis?: string;
    follow_up_date?: string;
    notes?: string;
    created_at?: string;
}

export interface PrescriptionMedicine {
    id?: number;
    prescription_id: string;
    medicine_name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

export interface PrescriptionLabTest {
    id?: number;
    prescription_id: string;
    test_name: string;
}

export interface Followup {
    id?: number;
    prescription_id: string;
    scheduled_date: string;
    status: 'Pending' | 'Completed' | 'Missed';
    created_at?: string;
}

export interface PrescriptionWithDetails extends Prescription {
    medicines?: PrescriptionMedicine[];
    lab_tests?: PrescriptionLabTest[];
    followup?: Followup;
    doctor_name?: string;
    patient_name?: string;
}

class PrescriptionService {
    // Generate unique prescription ID
    private generatePrescriptionId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        return `RX${timestamp}${random}`.toUpperCase();
    }

    // Create prescription
    async createPrescription(data: {
        patient_id: string;
        doctor_id: number;
        appointment_id?: number;
        diagnosis?: string;
        notes?: string;
        medicines?: Omit<PrescriptionMedicine, 'prescription_id'>[];
        lab_tests?: Omit<PrescriptionLabTest, 'prescription_id'>[];
        follow_up_date?: string;
    }): Promise<PrescriptionWithDetails> {
        const prescriptionId = this.generatePrescriptionId();

        // Create prescription
        const { data: prescription, error: prescriptionError } = await supabase
            .from('prescriptions')
            .insert({
                prescription_id: prescriptionId,
                patient_id: data.patient_id,
                doctor_id: data.doctor_id,
                appointment_id: data.appointment_id,
                diagnosis: data.diagnosis,
                notes: data.notes,
                follow_up_date: data.follow_up_date
            })
            .select()
            .single();

        if (prescriptionError) throw prescriptionError;

        // Add medicines
        if (data.medicines && data.medicines.length > 0) {
            const medicines = data.medicines.map(m => ({
                ...m,
                prescription_id: prescriptionId
            }));

            const { error: medicinesError } = await supabase
                .from('prescription_medicines')
                .insert(medicines);

            if (medicinesError) throw medicinesError;
        }

        // Add lab tests
        if (data.lab_tests && data.lab_tests.length > 0) {
            const labTests = data.lab_tests.map(t => ({
                ...t,
                prescription_id: prescriptionId
            }));

            const { error: labTestsError } = await supabase
                .from('prescription_lab_tests')
                .insert(labTests);

            if (labTestsError) throw labTestsError;
        }

        // Create follow-up if date provided
        if (data.follow_up_date) {
            await this.scheduleFollowup({
                prescription_id: prescriptionId,
                scheduled_date: data.follow_up_date,
                status: 'Pending'
            });
        }

        return this.getPrescriptionById(prescriptionId) as Promise<PrescriptionWithDetails>;
    }

    // Get prescription by ID
    async getPrescriptionById(prescriptionId: string): Promise<PrescriptionWithDetails | null> {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
        *,
        doctors(full_name),
        patients(full_name)
      `)
            .eq('prescription_id', prescriptionId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        // Get medicines
        const { data: medicines } = await supabase
            .from('prescription_medicines')
            .select('*')
            .eq('prescription_id', prescriptionId);

        // Get lab tests
        const { data: labTests } = await supabase
            .from('prescription_lab_tests')
            .select('*')
            .eq('prescription_id', prescriptionId);

        // Get follow-up
        const { data: followup } = await supabase
            .from('followups')
            .select('*')
            .eq('prescription_id', prescriptionId)
            .single();

        return {
            ...data,
            medicines: medicines || [],
            lab_tests: labTests || [],
            followup: followup || undefined,
            doctor_name: data.doctors?.full_name,
            patient_name: data.patients?.full_name
        };
    }

    // Get prescriptions by patient
    async getPrescriptionsByPatient(patientId: string): Promise<PrescriptionWithDetails[]> {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
        *,
        doctors(full_name)
      `)
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Get details for each prescription
        const prescriptions = await Promise.all(
            (data || []).map(async (p: any) => {
                const details = await this.getPrescriptionById(p.prescription_id);
                return details;
            })
        );

        return prescriptions.filter(p => p !== null) as PrescriptionWithDetails[];
    }

    // Get prescriptions by doctor
    async getPrescriptionsByDoctor(doctorId: number): Promise<PrescriptionWithDetails[]> {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
        *,
        patients(full_name)
      `)
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const prescriptions = await Promise.all(
            (data || []).map(async (p: any) => {
                const details = await this.getPrescriptionById(p.prescription_id);
                return details;
            })
        );

        return prescriptions.filter(p => p !== null) as PrescriptionWithDetails[];
    }

    // Add medicine to prescription
    async addMedicine(medicine: PrescriptionMedicine): Promise<PrescriptionMedicine> {
        const { data, error } = await supabase
            .from('prescription_medicines')
            .insert(medicine)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Add lab test to prescription
    async addLabTest(labTest: PrescriptionLabTest): Promise<PrescriptionLabTest> {
        const { data, error } = await supabase
            .from('prescription_lab_tests')
            .insert(labTest)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Schedule follow-up
    async scheduleFollowup(followup: Followup): Promise<Followup> {
        const { data, error } = await supabase
            .from('followups')
            .insert(followup)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update follow-up status
    async updateFollowupStatus(followupId: number, status: 'Pending' | 'Completed' | 'Missed'): Promise<Followup> {
        const { data, error } = await supabase
            .from('followups')
            .update({ status })
            .eq('id', followupId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get pending follow-ups for patient
    async getPendingFollowups(patientId: string): Promise<Followup[]> {
        const { data: prescriptions } = await supabase
            .from('prescriptions')
            .select('prescription_id')
            .eq('patient_id', patientId);

        if (!prescriptions || prescriptions.length === 0) return [];

        const prescriptionIds = prescriptions.map(p => p.prescription_id);

        const { data, error } = await supabase
            .from('followups')
            .select('*')
            .in('prescription_id', prescriptionIds)
            .eq('status', 'Pending')
            .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    // Upload external prescription
    async uploadExternalPrescription(data: {
        patient_id: string;
        file_url: string;
        file_type: string;
        notes?: string;
    }) {
        const { data: prescription, error } = await supabase
            .from('external_prescriptions')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return prescription;
    }

    // Get external prescriptions
    async getExternalPrescriptions(patientId: string) {
        const { data, error } = await supabase
            .from('external_prescriptions')
            .select('*')
            .eq('patient_id', patientId)
            .order('uploaded_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}

export const prescriptionService = new PrescriptionService();
