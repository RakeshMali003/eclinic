import { User, UserRole } from '../App';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getUserWithRole(): Promise<User | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired, try to get from cache
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                    try {
                        return JSON.parse(cachedUser);
                    } catch (parseError) {
                        console.error('Error parsing cached user:', parseError);
                    }
                }
                localStorage.removeItem('auth_token');
                return null;
            }
            throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        console.log("getUserWithRole raw data:", data);
        const user = {
            id: data.data.user_id,
            name: data.data.full_name,
            email: data.data.email,
            role: data.data.role as UserRole,
        };
        // Cache the user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        // Try to get from cache
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
            try {
                return JSON.parse(cachedUser);
            } catch (parseError) {
                console.error('Error parsing cached user:', parseError);
            }
        }
        localStorage.removeItem('auth_token');
        return null;
    }
}

export interface ClinicRegistrationData {
    name: string;
    type: string;
    establishedYear?: number;
    tagline?: string;
    description?: string;
    address: string;
    pinCode: string;
    city: string;
    state: string;
    mobile: string;
    email: string;
    website?: string;
    medicalCouncilRegNo: string;
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        ifsc: string;
        pan: string;
        gstin?: string;
    };
    services?: string[];
    facilities?: string[];
    paymentModes?: string[];
    bookingModes?: string[];
}

export interface DoctorRegistrationData {
    name: string;
    email: string;
    mobile: string;
    gender: string;
    dob: string;
    mciReg: string;
    councilName: string;
    regYear: number;
    degrees: string;
    university: string;
    gradYear: number;
    experience: number;
    specializations: string[];
    languages: string[];
    consultationModes: string[];
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        ifsc: string;
        pan: string;
        gstin?: string;
    };
}

export class AuthService {
    // Sign in with email and password
    async signInWithEmail(email: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        console.log("signInWithEmail response data:", data);
        localStorage.setItem('auth_token', data.token);

        return {
            id: data.user.user_id,
            name: data.user.full_name,
            email: data.user.email,
            role: data.user.role as UserRole,
        };
    }

    // Sign in with Google
    async signInWithGoogle() {
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    }

    // Sign up clinic
    async signUpClinic(data: ClinicRegistrationData, password: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/register/clinic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Clinic registration failed');
        }

        return await response.json();
    }

    // Sign up doctor
    async signUpDoctor(data: DoctorRegistrationData, password: string, files?: Record<string, File>) {
        const formData = new FormData();

        // Add all data fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        // Add password
        formData.append('password', password);

        // Add files if provided
        if (files) {
            Object.entries(files).forEach(([key, file]) => {
                formData.append(key, file);
            });
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/register/doctor`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Doctor registration failed');
        }

        return await response.json();
    }

    // Get current session
    async getSession() {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) return null;

            return await response.json();
        } catch (error) {
            return null;
        }
    }

    // Reset password
    async resetPassword(email: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Password reset failed');
        }
    }

    // Update password
    async updatePassword(newPassword: string): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Password update failed');
        }
    }

    // Get user profile from database
    async getUserProfile(userId: string) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch profile');
        }

        return await response.json();
    }

    // Update user profile in database
    async updateUserProfile(userId: string, updates: any) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }

        return await response.json();
    }

    // Verify OTP
    async verifyOtp(email: string, otp: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'OTP verification failed');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);

        return {
            id: data.user.user_id,
            name: data.user.full_name,
            email: data.user.email,
            role: data.user.role,
        };
    }

    // Sign out
    async signOut() {
        localStorage.removeItem('auth_token');
    }

    // Clinic registration
    async signUpClinic(clinicData: any, password: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/register/clinic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...clinicData, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Clinic registration failed');
        }

        const data = await response.json();
        return data;
    }

    // OTP verification
    async verifyOtp(email: string, otp: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'OTP verification failed');
        }

        const data = await response.json();
        // Store token
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }
}

export const authService = new AuthService();
