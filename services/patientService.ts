// Patient Service - API implementation for backend
// Uses HTTP requests to backend API

const API_BASE_URL = 'http://localhost:5000';

export interface Patient {
    patient_id: string;
    full_name: string;
    age?: number;
    gender?: string;
    blood_group?: string;
    abha_id?: string;
    phone?: string;
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
    }
}

export const patientService = new PatientService();
