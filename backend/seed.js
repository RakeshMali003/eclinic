const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const prisma = require('./config/database');

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // Seed clinic first
        const demoClinic = {
            clinic_name: 'Elinic Healthcare Center',
            establishment_year: 2020,
            tagline: 'Your Health, Our Priority',
            description: 'Leading healthcare provider',
            address: '123 Healthcare Avenue, Mumbai',
            landmark: 'Near Central Hospital',
            pin_code: '400001',
            city: 'Mumbai',
            state: 'Maharashtra',
            mobile: '9876543210',
            email: 'info@elinichealthcare.com',
            website: 'https://www.elinichealthcare.com',
            medical_council_reg_no: 'MCR123456789',
            terms_accepted: true,
            declaration_accepted: true,
            verification_status: 'VERIFIED'
        };

        const existingClinic = await prisma.clinics.findFirst({
            where: { clinic_name: demoClinic.clinic_name }
        });
        if (!existingClinic) {
            const newClinic = await prisma.clinics.create({
                data: demoClinic
            });
            console.log('✅ Clinic created:', { id: newClinic.id, clinic_name: newClinic.clinic_name });
        } else {
            console.log('⚠️ Clinic already exists.');
        }

        const demoUsers = [
            { full_name: 'Dr. Sarah Johnson', email: 'admin@clinic.com', mobile_number: '+91 98765 43210', role: 'admin', password: 'admin' },
            { full_name: 'Dr. Michael Chen', email: 'doctor@clinic.com', mobile_number: '+91 98765 43211', role: 'doctor', password: 'doctor' },
            { full_name: 'Emma Wilson', email: 'reception@clinic.com', mobile_number: '+91 98765 43212', role: 'reception', password: 'reception' },
            { full_name: 'John Doe', email: 'nurse@clinic.com', mobile_number: '+91 98765 43213', role: 'nurse', password: 'nurse' },
            { full_name: 'Lisa Martinez', email: 'lab@clinic.com', mobile_number: '+91 98765 43214', role: 'lab', password: 'lab' },
            { full_name: 'Robert Brown', email: 'pharmacy@clinic.com', mobile_number: '+91 98765 43215', role: 'pharmacy', password: 'pharmacy' },
            { full_name: 'Rahul Sharma', email: 'patient@clinic.com', mobile_number: '+91 98765 43216', role: 'patient', password: 'patient' },
        ];

        for (const user of demoUsers) {
            // Check if user exists
            const existingUser = await prisma.users.findUnique({
                where: { email: user.email }
            });
            if (existingUser) {
                console.log(`⚠️ User ${user.email} already exists.`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(user.password, salt);

            // Create user
            const newUser = await prisma.users.create({
                data: {
                    full_name: user.full_name,
                    email: user.email,
                    mobile_number: user.mobile_number,
                    role: user.role,
                    password_hash: passwordHash
                }
            });
            console.log('✅ User created:', { user_id: newUser.user_id, email: newUser.email, role: newUser.role });
        }

        // Seed doctors
        const demoDoctors = [
            {
                full_name: 'Dr. Sarah Johnson',
                date_of_birth: new Date('1980-05-15'),
                mobile: '+91 98765 43210',
                email: 'sarah.johnson@clinic.com',
                medical_council_reg_no: 'MC123456789',
                qualifications: 'MBBS, MD (Internal Medicine)',
                experience_years: 15,
                bio: 'Experienced internal medicine specialist with 15 years of practice.',
                verification_status: 'VERIFIED'
            },
            {
                full_name: 'Dr. Michael Chen',
                date_of_birth: new Date('1975-08-20'),
                mobile: '+91 98765 43211',
                email: 'michael.chen@clinic.com',
                medical_council_reg_no: 'MC987654321',
                qualifications: 'MBBS, MS (Surgery)',
                experience_years: 20,
                bio: 'Renowned surgeon with expertise in minimally invasive procedures.',
                verification_status: 'VERIFIED'
            },
            {
                full_name: 'Dr. Emma Wilson',
                date_of_birth: new Date('1985-03-10'),
                mobile: '+91 98765 43212',
                email: 'emma.wilson@clinic.com',
                medical_council_reg_no: 'MC456789123',
                qualifications: 'MBBS, DGO (Gynecology)',
                experience_years: 10,
                bio: 'Dedicated gynecologist focused on women\'s health and wellness.',
                verification_status: 'VERIFIED'
            }
        ];

        for (const doctor of demoDoctors) {
            // Skip checking for existing doctors since email is not unique in doctors table
            const newDoctor = await prisma.doctors.create({
                data: doctor
            });
            console.log('✅ Doctor created:', { id: newDoctor.id, full_name: newDoctor.full_name });
        }

        // Seed patients
        const demoPatients = [
            {
                patient_id: 'PAT-001',
                full_name: 'Rahul Sharma',
                age: 35,
                gender: 'Male',
                blood_group: 'O+',
                phone: '+91 98765 43216',
                address: '123 Main St, Mumbai, Maharashtra',
                medical_history: 'Hypertension, Diabetes'
            },
            {
                patient_id: 'PAT-002',
                full_name: 'Priya Patel',
                age: 28,
                gender: 'Female',
                blood_group: 'A+',
                phone: '+91 98765 43217',
                address: '456 Oak Ave, Delhi, Delhi',
                medical_history: 'Asthma'
            }
        ];

        for (const patient of demoPatients) {
            const existingPatient = await prisma.patients.findUnique({
                where: { patient_id: patient.patient_id }
            });
            if (existingPatient) {
                console.log(`⚠️ Patient ${patient.patient_id} already exists.`);
                continue;
            }

            const newPatient = await prisma.patients.create({
                data: patient
            });
            console.log('✅ Patient created:', { patient_id: newPatient.patient_id, full_name: newPatient.full_name });
        }

        // Seed appointments
        const doctors = await prisma.doctors.findMany();
        const patients = await prisma.patients.findMany();

        if (doctors.length > 0 && patients.length > 0) {
            const demoAppointments = [
                {
                    appointment_id: 'APT-20240101-1200-1234',
                    patient_id: patients[0].patient_id,
                    doctor_id: doctors[0].id,
                    appointment_date: new Date('2024-01-15T10:00:00Z'),
                    appointment_time: '10:00 AM',
                    type: 'Consultation',
                    mode: 'in-person',
                    status: 'scheduled'
                },
                {
                    appointment_id: 'APT-20240102-1400-5678',
                    patient_id: patients[0].patient_id,
                    doctor_id: doctors[1].id,
                    appointment_date: new Date('2024-01-20T14:00:00Z'),
                    appointment_time: '2:00 PM',
                    type: 'Follow-up',
                    mode: 'video',
                    status: 'completed'
                },
                {
                    appointment_id: 'APT-20240103-0900-9012',
                    patient_id: patients[1].patient_id,
                    doctor_id: doctors[2].id,
                    appointment_date: new Date('2024-01-25T09:00:00Z'),
                    appointment_time: '9:00 AM',
                    type: 'Consultation',
                    mode: 'in-person',
                    status: 'scheduled'
                }
            ];

            for (const appointment of demoAppointments) {
                const existingAppointment = await prisma.appointments.findUnique({
                    where: { appointment_id: appointment.appointment_id }
                });
                if (existingAppointment) {
                    console.log(`⚠️ Appointment ${appointment.appointment_id} already exists.`);
                    continue;
                }

                const newAppointment = await prisma.appointments.create({
                    data: appointment
                });
                console.log('✅ Appointment created:', { appointment_id: newAppointment.appointment_id, status: newAppointment.status });
            }
        }

    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
