// API Client - Mock implementation for frontend
// In production, this would connect to your backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class API {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async get(endpoint: string) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            // Return mock data for development
            return this.getMockData(endpoint);
        }
    }

    async post(endpoint: string, data: any) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API POST error:', error);
            return { success: true, data };
        }
    }

    async put(endpoint: string, data: any) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API PUT error:', error);
            return { success: true, data };
        }
    }

    async delete(endpoint: string) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API DELETE error:', error);
            return { success: true };
        }
    }

    // Mock data for development when backend is not available
    private getMockData(endpoint: string) {
        const mockData: Record<string, any> = {
            '/dashboard/stats': {
                totalPatients: 1234,
                todayAppointments: 45,
                pendingTests: 12,
                revenue: 125000,
                patientGrowth: 12.5,
                appointmentGrowth: 8.3,
                revenueGrowth: 15.2,
            },
            '/appointments': [
                {
                    id: '1',
                    patientName: 'John Doe',
                    time: '10:00 AM',
                    type: 'Consultation',
                    status: 'Confirmed',
                },
                {
                    id: '2',
                    patientName: 'Jane Smith',
                    time: '11:30 AM',
                    type: 'Follow-up',
                    status: 'Pending',
                },
            ],
            '/patients': [
                {
                    id: '1',
                    name: 'John Doe',
                    age: 35,
                    gender: 'Male',
                    lastVisit: '2024-01-25',
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    age: 28,
                    gender: 'Female',
                    lastVisit: '2024-01-20',
                },
            ],
        };

        return mockData[endpoint] || { message: 'Mock data not available for this endpoint' };
    }
}

const api = new API();
export default api;
