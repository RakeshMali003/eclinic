import { supabase } from '../lib/supabase';
import { User, UserRole } from '../App';

export async function getUserWithRole(): Promise<User | null> {
    console.log("getUserWithRole: Starting auth check...");
    // get auth user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.log("getUserWithRole: No auth user found.");
        return null;
    }
    console.log("getUserWithRole: Auth user found:", user.id, user.email);

    // 1. Check if user is a CLINIC OWNER (Admin) - in 'clinics' table
    // Clinic owners are linked by auth_user_id (which is an int in legacy or uuid in new? 
    // Wait, previous code used auth_users table. Let's keep that pattern but verify clinic ownership.)

    // First, check 'auth_users' to get the numeric primary key if used, or properties.
    const { data: authUserData } = await supabase
        .from("auth_users")
        .select("*")
        .eq("email", user.email)
        .single();

    // Check CLINICS table using auth_user_id (assuming simple mapping or using the authUserData.auth_user_id)
    // If auth_users is the source of truth for role:
    if (authUserData) {
        let clinicId: number | undefined;

        if (authUserData.role === 'clinic') {
            const { data: clinic } = await supabase
                .from('clinics')
                .select('id')
                .eq('auth_user_id', authUserData.auth_user_id)
                .single();
            if (clinic) clinicId = clinic.id;
        }
        else if (authUserData.role === 'doctor') {
            // Check if doctor belongs to a clinic (assuming 'doctors' table has clinic_id or via practice locations)
            // For strict multi-tenancy, we assume doctors table might have clinic_id or we query junction.
            // Based on user prompt "All users belong to ONE clinic only", doctors table SHOULD have clinic_id.
            const { data: doctor } = await supabase
                .from('doctors')
                .select('id, clinic_id') // speculative column, will fallback if error
                .eq('auth_user_id', authUserData.auth_user_id)
                .single();
            if (doctor) clinicId = doctor.clinic_id;
        }

        if (authUserData.role !== 'patient') {
            return {
                id: user.id,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                role: authUserData.role as UserRole,
                avatar: user.user_metadata?.avatar_url,
                clinicId: clinicId,
                phone: authUserData.mobile
            };
        }
    }

    // 2. Check CLINIC_STAFF table (Reception, Nurse, Lab, Pharmacy)
    // Staff are created by admin, probably referenced by email.
    const { data: staffData } = await supabase
        .from("clinic_staff")
        .select("*")
        .eq("email", user.email)
        .eq("is_active", true)
        .single();

    if (staffData) {
        console.log("getUserWithRole: Found staff user:", staffData);
        // Map staff roles to UserRole
        const roleMap: Record<string, UserRole> = {
            'Receptionist': 'reception',
            'Nurse': 'nurse',
            'Lab Technician': 'lab',
            'Pharmacist': 'pharmacy',
            'Admin': 'clinic' // staff admin? or strictly main admin.
        };

        return {
            id: user.id,
            name: staffData.full_name,
            email: user.email || '',
            role: roleMap[staffData.role] || 'patient',
            avatar: user.user_metadata?.avatar_url,
            clinicId: staffData.clinic_id,
            phone: staffData.mobile
        };
    }

    // 3. Check PATIENTS table
    const { data: patientData } = await supabase
        .from("patients")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

    if (patientData) {
        return {
            id: user.id,
            name: patientData.full_name,
            email: user.email || '',
            role: 'patient',
            avatar: user.user_metadata?.avatar_url,
            phone: patientData.phone
        };
    }

    // 4. Fallback: Create Patient or Role-specific record
    console.log("getUserWithRole: User not found in db. Checking for role in URL or falling back to Patient...");

    // Extract role from URL if in callback
    let assignedRole: UserRole = 'patient';
    if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get('role');
        if (roleParam && ['patient', 'doctor', 'clinic'].includes(roleParam)) {
            assignedRole = roleParam as UserRole;
        }
    }

    if (assignedRole === 'patient') {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const patientId = `PAT${timestamp}${randomStr}`;

        const { data: newPatient } = await supabase
            .from("patients")
            .insert({
                patient_id: patientId,
                auth_user_id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                phone: user.user_metadata?.phone || user.phone || '',
            })
            .select()
            .single();

        if (newPatient) {
            // Sync to auth_users
            const { data: existingAuthUser } = await supabase
                .from('auth_users')
                .select('auth_user_id')
                .eq('email', user.email)
                .single();

            if (!existingAuthUser) {
                await supabase.from('auth_users').insert({
                    email: user.email,
                    mobile: user.user_metadata?.phone || user.phone || '',
                    password_hash: 'managed_by_system',
                    role: 'patient',
                    is_active: true
                });
            }

            return {
                id: user.id,
                name: newPatient.full_name,
                email: user.email || '',
                role: 'patient',
                avatar: user.user_metadata?.avatar_url,
                phone: newPatient.phone
            };
        }
    } else {
        // For Google Doc/Clinic registration, we might need a different flow 
        // but for now let's at least sync them to auth_users so they can be recognized.
        const { data: existingAuthUser } = await supabase
            .from('auth_users')
            .select('auth_user_id')
            .eq('email', user.email)
            .single();

        if (!existingAuthUser) {
            await supabase.from('auth_users').insert({
                email: user.email,
                mobile: user.user_metadata?.phone || user.phone || '',
                password_hash: 'managed_by_google',
                role: assignedRole,
                is_active: true
            });
        }

        return {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: assignedRole,
            avatar: user.user_metadata?.avatar_url,
            phone: user.user_metadata?.phone || user.phone || ''
        };
    }

    return null;
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
    clinicName?: string;
    clinicAddress?: string;
    inClinicFee?: number;
    onlineFee?: number;
    consultationModes: string[];
    conditionsTreated: string[];
    servicesOffered: string[];
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        ifsc: string;
        pan: string;
        gstin?: string;
    };
    bio?: string;
}

class AuthService {
    // Sign in with email and password
    async signInWithEmail(email: string, password: string): Promise<User> {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        const userWithRole = await getUserWithRole();
        if (!userWithRole) throw new Error('Failed to fetch user profile');

        return userWithRole;
    }

    // Sign in with Google OAuth
    async signInWithGoogle(role: UserRole = 'patient'): Promise<void> {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });

        if (error) throw error;
    }

    // Sign out
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    // Helper to upload document
    async uploadDocument(bucket: string, path: string, file: File): Promise<string> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    }

    // Sign up a clinic
    async signUpClinic(data: ClinicRegistrationData, password: string, documents?: Record<string, File>): Promise<void> {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password,
            options: {
                data: {
                    full_name: data.name,
                    role: 'clinic'
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create auth user');

        // Check if user already exists in auth_users (to prevent unique constraint error)
        const { data: existingUser } = await supabase
            .from('auth_users')
            .select('auth_user_id')
            .eq('email', data.email)
            .single();

        let authUserId: number;

        if (existingUser) {
            console.log("User already exists in auth_users, using existing ID:", existingUser.auth_user_id);
            authUserId = existingUser.auth_user_id;
        } else {
            // Insert into public.auth_users
            const { data: authUser, error: authUserError } = await supabase.from('auth_users').insert({
                email: data.email,
                mobile: data.mobile,
                password_hash: 'supabase_auth',
                role: 'clinic',
                is_active: true
            }).select('auth_user_id').single();

            if (authUserError) {
                console.error('Auth user insert error:', authUserError);
                throw new Error(`Database error saving new user: ${authUserError.message}`);
            }
            if (!authUser) throw new Error('Failed to create auth user record');
            authUserId = authUser.auth_user_id;
        }

        // Insert into public.clinics using the integer auth_user_id
        const { data: clinic, error: clinicError } = await supabase.from('clinics').insert({
            auth_user_id: authUserId,
            clinic_name: data.name,
            establishment_year: data.establishedYear,
            tagline: data.tagline,
            description: data.description,
            address: data.address,
            pin_code: data.pinCode,
            city: data.city,
            state: data.state,
            mobile: data.mobile,
            email: data.email,
            website: data.website,
            medical_council_reg_no: data.medicalCouncilRegNo,
            bank_account_name: data.bankDetails?.accountName,
            bank_account_number: data.bankDetails?.accountNumber,
            ifsc_code: data.bankDetails?.ifsc,
            pan_number: data.bankDetails?.pan,
            gstin: data.bankDetails?.gstin,
        }).select('id').single();

        if (clinicError) {
            console.error('Clinic insert error:', clinicError);
            throw new Error(`Database error saving clinic: ${clinicError.message}`);
        }
        if (!clinic) throw new Error('Failed to create clinic record');

        // Insert related data
        if (data.services?.length) {
            await supabase.from('clinic_services').insert(
                data.services.map(s => ({ clinic_id: clinic.id, service_type: s }))
            );
        }
        if (data.facilities?.length) {
            await supabase.from('clinic_facilities').insert(
                data.facilities.map(f => ({ clinic_id: clinic.id, facility_name: f }))
            );
        }
        if (data.paymentModes?.length) {
            await supabase.from('clinic_payment_modes').insert(
                data.paymentModes.map(m => ({ clinic_id: clinic.id, payment_mode: m }))
            );
        }

        // Upload and insert documents
        if (documents) {
            for (const [key, file] of Object.entries(documents)) {
                try {
                    const path = `${authData.user.id}/${key}_${Date.now()}_${file.name}`;
                    const url = await this.uploadDocument('documents', path, file);

                    await supabase.from('clinic_documents').insert({
                        clinic_id: clinic.id,
                        document_type: key,
                        file_url: url
                    });
                } catch (docError) {
                    console.error(`Failed to upload document ${key}:`, docError);
                    // Decide whether to fail completely or continue. Continuing allows user to re-upload later.
                }
            }
        }
    }

    // Sign up a doctor
    async signUpDoctor(data: DoctorRegistrationData, password: string, documents?: Record<string, File>): Promise<void> {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password,
            options: {
                data: {
                    full_name: data.name,
                    role: 'doctor'
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create auth user');

        // Check if user already exists in auth_users
        const { data: existingUser } = await supabase
            .from('auth_users')
            .select('auth_user_id')
            .eq('email', data.email)
            .single();

        let authUserId: number;

        if (existingUser) {
            console.log("User already exists in auth_users, using existing ID:", existingUser.auth_user_id);
            authUserId = existingUser.auth_user_id;
        } else {
            // Insert into public.auth_users to get integer ID
            const { data: authUser, error: authUserError } = await supabase.from('auth_users').insert({
                email: data.email,
                mobile: data.mobile,
                password_hash: 'supabase_auth',
                role: 'doctor',
                is_active: true
            }).select('auth_user_id').single();

            if (authUserError) {
                console.error('Auth user insert error:', authUserError);
                throw new Error(`Database error saving new user: ${authUserError.message}`);
            }
            if (!authUser) throw new Error('Failed to create auth user record');
            authUserId = authUser.auth_user_id;
        }

        // Insert into public.doctors using the integer auth_user_id
        const { data: doctor, error: doctorError } = await supabase.from('doctors').insert({
            auth_user_id: authUserId,
            full_name: data.name,
            date_of_birth: data.dob,
            medical_council_reg_no: data.mciReg,
            medical_council_name: data.councilName,
            registration_year: data.regYear,
            qualifications: data.degrees,
            university_name: data.university,
            graduation_year: data.gradYear,
            experience_years: data.experience,
            bio: data.bio,
            bank_account_name: data.bankDetails?.accountName,
            bank_account_number: data.bankDetails?.accountNumber,
            ifsc_code: data.bankDetails?.ifsc,
            pan_number: data.bankDetails?.pan,
            gstin: data.bankDetails?.gstin,
        }).select('id').single();

        if (doctorError) {
            console.error('Doctor insert error:', doctorError);
            throw new Error(`Database error saving doctor: ${doctorError.message}`);
        }
        if (!doctor) throw new Error('Failed to create doctor record');

        // Insert related data
        if (data.specializations?.length) {
            await supabase.from('doctor_specializations').insert(
                data.specializations.map(s => ({ doctor_id: doctor.id, specialization: s }))
            );
        }
        if (data.languages?.length) {
            await supabase.from('doctor_languages').insert(
                data.languages.map(l => ({ doctor_id: doctor.id, language: l }))
            );
        }
        if (data.consultationModes?.length) {
            await supabase.from('doctor_consultation_modes').insert(
                data.consultationModes.map(m => ({ doctor_id: doctor.id, mode: m }))
            );
        }
        // Doctor practice locations if applicable
        if (data.clinicName || data.clinicAddress) {
            await supabase.from('doctor_practice_locations').insert({
                doctor_id: doctor.id,
                clinic_name: data.clinicName,
                address: data.clinicAddress,
                // Add city/state if available in formData
            });
        }

        // Doctor services
        if (data.servicesOffered?.length) {
            await supabase.from('doctor_services').insert(
                data.servicesOffered.map(s => ({ doctor_id: doctor.id, service_name: s }))
            );
        }

        // Upload and insert documents
        if (documents) {
            for (const [key, file] of Object.entries(documents)) {
                try {
                    const path = `${authData.user.id}/${key}_${Date.now()}_${file.name}`;
                    const url = await this.uploadDocument('documents', path, file);

                    await supabase.from('doctor_documents').insert({
                        doctor_id: doctor.id,
                        document_type: key,
                        file_url: url
                    });
                } catch (docError) {
                    console.error(`Failed to upload document ${key}:`, docError);
                }
            }
        }
    }

    // Sign up a patient
    async signUpPatient(email: string, password: string, fullName: string, mobile: string): Promise<void> {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: mobile,
                    role: 'patient'
                }
            }
        });

        if (authError) throw authError;

        // Manual sync to auth_users for patients registered via email/password
        if (authData.user) {
            const { error: syncError } = await supabase.from('auth_users').upsert({
                email,
                mobile,
                password_hash: 'managed_by_system',
                role: 'patient',
                is_active: true
            }, { onConflict: 'email' });

            if (syncError) {
                console.warn('Sync to auth_users failed but continuing:', syncError);
            }
        }
    }

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    }

    // Reset password
    async resetPassword(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    }

    // Update password
    async updatePassword(newPassword: string): Promise<void> {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    }

    // Get user profile from database
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    // Update user profile in database
    async updateUserProfile(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

export const authService = new AuthService();
