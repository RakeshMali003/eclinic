const prisma = require('../config/database');

class Appointment {
    static async create(appointmentData) {
        try {
            const data = await prisma.appointments.create({
                data: appointmentData
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const data = await prisma.appointments.findMany({
                orderBy: { appointment_date: 'desc' },
                take: limit,
                skip: offset
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const data = await prisma.appointments.findUnique({
                where: { appointment_id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findByDoctor(doctorId) {
        try {
            const data = await prisma.appointments.findMany({
                where: { doctor_id: doctorId },
                orderBy: { appointment_date: 'asc' }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findByPatient(patientId) {
        try {
            const data = await prisma.appointments.findMany({
                where: { patient_id: patientId },
                orderBy: { appointment_date: 'desc' }
            });

            // Fetch clinic information from database
            const clinic = await prisma.clinics.findFirst();
            const clinicInfo = clinic ? {
                clinic_name: clinic.clinic_name
            } : {
                clinic_name: 'Clinic'
            };

            // Fetch doctors separately to handle cases where doctor_id is invalid or missing
            const appointmentsWithDoctor = await Promise.all(data.map(async (appointment) => {
                let doctor = null;
                if (appointment.doctor_id) {
                    try {
                        doctor = await prisma.doctors.findUnique({
                           where: { id: Number(appointment.doctor_id) }

                        });
                    } catch (err) {
                        console.error('Error fetching doctor for appointment:', appointment.appointment_id, err);
                        doctor = null;
                    }
                }

                return {
                    ...appointment,
                    doctor: doctor ? {
                        full_name: doctor.full_name,
                        qualifications: doctor.qualifications
                    } : {
                        full_name: 'Unknown Doctor',
                        qualifications: 'N/A'
                    },
                    clinic: clinicInfo
                };
            }));

            return appointmentsWithDoctor;
        } catch (error) {
            console.error('Error in findByPatient:', error);
            throw error;
        }
    }

    static async findUpcomingByPatient(patientId, today) {
        try {
            // Create today's date at UTC midnight for consistent comparison
            const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

            const data = await prisma.appointments.findMany({
                where: {
                    patient_id: patientId,
                    appointment_date: {
                        gte: todayUTC
                    }
                },
                orderBy: { appointment_date: 'asc' }
            });

            // Fetch clinic information from database
            const clinic = await prisma.clinics.findFirst();
            const clinicInfo = clinic ? {
                clinic_name: clinic.clinic_name
            } : {
                clinic_name: 'Clinic'
            };

            // Fetch doctors separately to handle cases where doctor_id is invalid or missing
            const appointmentsWithDoctor = await Promise.all(data.map(async (appointment) => {
                let doctor = null;
                if (appointment.doctor_id) {
                    try {
                        doctor = await prisma.doctors.findUnique({
                           where: { id: Number(appointment.doctor_id) }
                        });
                    } catch (err) {
                        console.error('Error fetching doctor for appointment:', appointment.appointment_id, err);
                        doctor = null;
                    }
                }

                return {
                    ...appointment,
                    doctor: doctor ? {
                        full_name: doctor.full_name,
                        qualifications: doctor.qualifications
                    } : {
                        full_name: 'Unknown Doctor',
                        qualifications: 'N/A'
                    },
                    clinic: clinicInfo
                };
            }));

            return appointmentsWithDoctor;
        } catch (error) {
            console.error('Error in findUpcomingByPatient:', error);
            throw error;
        }
    }

    static async updateStatus(id, status) {
        try {
            const data = await prisma.appointments.update({
                where: { appointment_id: id },
                data: { status }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findByDoctorAndDateTime(doctorId, date, time) {
        try {
            // Parse the date string to Date object for Prisma (treat as UTC date at midnight)
            const [year, month, day] = date.split('-').map(Number);
            const utcDate = new Date(Date.UTC(year, month - 1, day));

            const data = await prisma.appointments.findMany({
                where: {
                    doctor_id: parseInt(doctorId),
                    appointment_date: utcDate,
                    appointment_time: time,
                    status: {
                        not: 'cancelled'
                    }
                }
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getBookedSlots(doctorId, date) {
        try {
            console.log('getBookedSlots called with:', { doctorId, date });

            // Parse the date string to Date object for Prisma (treat as UTC date at midnight)
            const [year, month, day] = date.split('-').map(Number);
            const utcDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed in Date constructor

            console.log('Parsed date:', utcDate);

            const nextDay = new Date(utcDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

            const data = await prisma.appointments.findMany({
                where: {
                    doctor_id: parseInt(doctorId),
                    appointment_date: {
                        gte: utcDate,
                        lt: nextDay
                    },
                    status: {
                        not: 'cancelled'
                    }
                },
                select: {
                    appointment_time: true
                }
            });

            console.log('Found appointments:', data.length);
            console.log('Appointment times:', data.map(a => a.appointment_time));

            // Convert time format to 12-hour format, handling both HH:MM:SS and HH:MM AM/PM formats
            const bookedSlots = data.map(appointment => {
                const timeStr = appointment.appointment_time;
                if (!timeStr) return null;

                console.log('Processing time:', timeStr);

                // Check if time is already in 12-hour format (contains AM/PM)
                if (timeStr.includes('AM') || timeStr.includes('PM')) {
                    // Normalize the format to ensure consistent padding
                    const [time, modifier] = timeStr.trim().split(' ');
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours, 10);
                    const displayHour = hour.toString().padStart(2, '0');
                    const result = `${displayHour}:${minutes} ${modifier}`;
                    console.log('Converted existing 12h format:', timeStr, '->', result);
                    return result;
                }

                // Convert from HH:MM:SS format to 12-hour format
                const [hours, minutes] = timeStr.split(':');
                const hour = parseInt(hours, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                const result = `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                console.log('Converted 24h format:', timeStr, '->', result);
                return result;
            }).filter(Boolean);

            console.log('Final booked slots:', bookedSlots);
            return bookedSlots;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Appointment;
