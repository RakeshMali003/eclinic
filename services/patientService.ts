<<<<<<< HEAD
// Patient Service - API implementation for backend
// Uses HTTP requests to backend API

const API_BASE_URL = 'http://localhost:5000';

export interface Patient {
=======
import { supabase } from '../lib/supabase';

export interface PatientProfile {
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
    patient_id: string;
    full_name: string;
    age?: number;
    gender?: string;
    blood_group?: string;
    abha_id?: string;
    phone?: string;
<<<<<<< HEAD
    address?: string;
    medical_history?: string;
    insurance_id?: string;
}

class PatientService {
    private async getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async getPatients(): Promise<Patient[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }

    async getPatientById(id: string): Promise<Patient | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching patient:', error);
            return null;
        }
    }

    async createPatient(patient: Patient): Promise<Patient> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(patient),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    }

    async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }

    async deletePatient(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting patient:', error);
            return false;
        }
=======
    insurance_id?: string;
    auth_user_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PatientAddress {
    id?: number;
    patient_id: string;
    address: string;
    city: string;
    state: string;
    pin_code: string;
    is_primary: boolean;
}

export interface EmergencyContact {
    id?: number;
    patient_id: string;
    name: string;
    relation: string;
    phone: string;
}

export interface PatientAllergy {
    id?: number;
    patient_id: string;
    allergy_name: string;
    severity?: string;
}

export interface PatientCondition {
    id?: number;
    patient_id: string;
    condition_name: string;
    diagnosed_date?: string;
    is_chronic: boolean;
}

export interface PatientSurgery {
    id?: number;
    patient_id: string;
    surgery_name: string;
    surgery_date?: string;
    notes?: string;
}

class PatientService {
    // Create a new patient
    async createPatient(data: Partial<PatientProfile>): Promise<PatientProfile> {
        const { data: patient, error } = await supabase
            .from('patients')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return patient;
    }

    // Get patient by ID
    async getPatientById(patientId: string): Promise<PatientProfile | null> {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    // Get patient by auth user ID
    async getPatientByAuthId(authUserId: string): Promise<PatientProfile | null> {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    // Update patient profile
    async updatePatient(patientId: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
        const { data, error } = await supabase
            .from('patients')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get patient addresses
    async getPatientAddresses(patientId: string): Promise<PatientAddress[]> {
        const { data, error } = await supabase
            .from('patient_addresses')
            .select('*')
            .eq('patient_id', patientId)
            .order('is_primary', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Add patient address
    async addPatientAddress(address: PatientAddress): Promise<PatientAddress> {
        const { data, error } = await supabase
            .from('patient_addresses')
            .insert(address)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update patient address
    async updatePatientAddress(addressId: number, updates: Partial<PatientAddress>): Promise<PatientAddress> {
        const { data, error } = await supabase
            .from('patient_addresses')
            .update(updates)
            .eq('id', addressId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete patient address
    async deletePatientAddress(addressId: number): Promise<void> {
        const { error } = await supabase
            .from('patient_addresses')
            .delete()
            .eq('id', addressId);

        if (error) throw error;
    }

    // Get emergency contacts
    async getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
        const { data, error } = await supabase
            .from('patient_emergency_contacts')
            .select('*')
            .eq('patient_id', patientId);

        if (error) throw error;
        return data || [];
    }

    // Add emergency contact
    async addEmergencyContact(contact: EmergencyContact): Promise<EmergencyContact> {
        const { data, error } = await supabase
            .from('patient_emergency_contacts')
            .insert(contact)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete emergency contact
    async deleteEmergencyContact(contactId: number): Promise<void> {
        const { error } = await supabase
            .from('patient_emergency_contacts')
            .delete()
            .eq('id', contactId);

        if (error) throw error;
    }

    // Get patient allergies
    async getAllergies(patientId: string): Promise<PatientAllergy[]> {
        const { data, error } = await supabase
            .from('patient_allergies')
            .select('*')
            .eq('patient_id', patientId);

        if (error) throw error;
        return data || [];
    }

    // Add allergy
    async addAllergy(allergy: PatientAllergy): Promise<PatientAllergy> {
        const { data, error } = await supabase
            .from('patient_allergies')
            .insert(allergy)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete allergy
    async deleteAllergy(allergyId: number): Promise<void> {
        const { error } = await supabase
            .from('patient_allergies')
            .delete()
            .eq('id', allergyId);

        if (error) throw error;
    }

    // Get patient conditions
    async getConditions(patientId: string): Promise<PatientCondition[]> {
        const { data, error } = await supabase
            .from('patient_conditions')
            .select('*')
            .eq('patient_id', patientId);

        if (error) throw error;
        return data || [];
    }

    // Add condition
    async addCondition(condition: PatientCondition): Promise<PatientCondition> {
        const { data, error } = await supabase
            .from('patient_conditions')
            .insert(condition)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete condition
    async deleteCondition(conditionId: number): Promise<void> {
        const { error } = await supabase
            .from('patient_conditions')
            .delete()
            .eq('id', conditionId);

        if (error) throw error;
    }

    // Get patient surgeries
    async getSurgeries(patientId: string): Promise<PatientSurgery[]> {
        const { data, error } = await supabase
            .from('patient_surgeries')
            .select('*')
            .eq('patient_id', patientId)
            .order('surgery_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Add surgery
    async addSurgery(surgery: PatientSurgery): Promise<PatientSurgery> {
        const { data, error } = await supabase
            .from('patient_surgeries')
            .insert(surgery)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete surgery
    async deleteSurgery(surgeryId: number): Promise<void> {
        const { error } = await supabase
            .from('patient_surgeries')
            .delete()
            .eq('id', surgeryId);

        if (error) throw error;
    }

    // Get patient wallet balance
    async getWalletBalance(patientId: string): Promise<number> {
        const { data, error } = await supabase
            .from('patient_wallet')
            .select('balance')
            .eq('patient_id', patientId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return 0;
            throw error;
        }
        return data?.balance || 0;
    }

    // Get complete patient profile with all related data
    async getCompleteProfile(patientId: string) {
        const [
            profile,
            addresses,
            emergencyContacts,
            allergies,
            conditions,
            surgeries,
            walletBalance
        ] = await Promise.all([
            this.getPatientById(patientId),
            this.getPatientAddresses(patientId),
            this.getEmergencyContacts(patientId),
            this.getAllergies(patientId),
            this.getConditions(patientId),
            this.getSurgeries(patientId),
            this.getWalletBalance(patientId)
        ]);

        return {
            profile,
            addresses,
            emergencyContacts,
            allergies,
            conditions,
            surgeries,
            walletBalance
        };
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
    }
}

export const patientService = new PatientService();
