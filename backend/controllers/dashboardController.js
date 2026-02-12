const prisma = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const userRole = req.user.role;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Todays Appointments
        let todaysAppointmentsWhere = {
            appointment_date: {
                gte: today,
                lt: tomorrow
            }
        };

        if (userRole === 'doctor') {
            todaysAppointmentsWhere.doctor_id = userId;
        }

        const todaysAppointments = await prisma.appointments.count({
            where: todaysAppointmentsWhere
        });

        // Active Patients (distinct patients in last 30 days)
        const activePatientData = await prisma.appointments.findMany({
            where: {
                appointment_date: {
                    gte: last30Days
                }
            },
            select: {
                patient_id: true
            },
            distinct: ['patient_id']
        });

        const activePatientsCount = activePatientData.length;

        let stats = {
            todaysAppointments: todaysAppointments || 0,
            activePatients: activePatientsCount || 0,
            totalRevenue: '₹0',
            pendingPayments: 0
        };

        // Revenue and Pending Payments (Admin/Receptionist/Doctor)
        if (userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor') {
            let revenueWhere = {
                created_at: {
                    gte: last7Days
                }
            };

            let pendingWhere = {
                status: 'Pending'
            };

            if (userRole === 'doctor') {
                // Get appointment IDs for the doctor
                const doctorAppts = await prisma.appointments.findMany({
                    where: {
                        doctor_id: userId
                    },
                    select: {
                        appointment_id: true
                    }
                });
                const apptIds = doctorAppts.map(a => a.appointment_id);
                // Note: Since invoices table doesn't have appointment_id in schema, we'll skip doctor-specific revenue for now
                // revenueWhere.appointment_id = { in: apptIds };
            }

            const revenueData = await prisma.invoices.findMany({
                where: revenueWhere,
                select: {
                    total_amount: true
                }
            });

            const pendingCount = await prisma.invoices.count({
                where: pendingWhere
            });

            const totalRev = revenueData.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
            stats.totalRevenue = `₹${totalRev.toLocaleString()}`;
            stats.pendingPayments = pendingCount || 0;
        }

        ResponseHandler.success(res, stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getAppointmentData = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const userRole = req.user.role;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let whereClause = {
            appointment_date: {
                gte: today,
                lt: tomorrow
            }
        };

        if (userRole === 'doctor') {
            whereClause.doctor_id = userId;
        }

        const appointmentData = await prisma.appointments.findMany({
            where: whereClause,
            select: { appointment_time: true }
        });

        // Ensure we have data for all time slots (9 AM to 4 PM)
        const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '2 PM', '3 PM', '4 PM'];
        const filledData = timeSlots.map(slot => {
            // Very simple time matching - in real app would parse actual time
            const count = appointmentData.filter(a => {
                if (!a.appointment_time) return false;
                // Convert time to string format for matching
                const timeStr = a.appointment_time.toISOString().split('T')[1].substring(0, 5); // HH:MM
                const hour = parseInt(timeStr.split(':')[0]);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const displayTime = `${displayHour} ${ampm}`;
                return displayTime === slot;
            }).length;

            return { time: slot, count };
        });

        ResponseHandler.success(res, filledData, 'Appointment data retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getRevenueData = async (req, res, next) => {
    try {
        const last6Days = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

        const revenueData = await prisma.invoices.findMany({
            where: {
                created_at: {
                    gte: last6Days
                }
            },
            select: {
                total_amount: true,
                created_at: true
            }
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const filledData = days.map(day => {
            const dayRevenue = revenueData.filter(inv => {
                const date = new Date(inv.created_at);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                return dayName === day;
            }).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

            return { day, revenue: dayRevenue };
        });

        ResponseHandler.success(res, filledData, 'Revenue data retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getRecentAppointments = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const userRole = req.user.role;

        let whereClause = {};

        if (userRole === 'doctor') {
            whereClause.doctor_id = userId;
        }

        const appointments = await prisma.appointments.findMany({
            where: whereClause,
            select: {
                appointment_id: true,
                status: true,
                appointment_time: true,
                patient_id: true,
                doctor_id: true
            },
            orderBy: {
                appointment_time: 'desc'
            },
            take: 5
        });

        // Get patient and doctor names separately since Prisma doesn't support joins in select like Supabase
        const patientIds = appointments.map(a => a.patient_id).filter(id => id);
        const doctorIds = appointments.map(a => a.doctor_id).filter(id => id);

        const patients = await prisma.patients.findMany({
            where: {
                patient_id: {
                    in: patientIds
                }
            },
            select: {
                patient_id: true,
                full_name: true
            }
        });

        const doctors = await prisma.doctors.findMany({
            where: {
                id: {
                    in: doctorIds.map(id => parseInt(id))
                }
            },
            select: {
                id: true,
                full_name: true
            }
        });

        const patientMap = patients.reduce((map, p) => {
            map[p.patient_id] = p.full_name;
            return map;
        }, {});

        const doctorMap = doctors.reduce((map, d) => {
            map[d.id.toString()] = d.full_name;
            return map;
        }, {});

        const formattedAppts = appointments.map(a => ({
            appointment_id: a.appointment_id,
            patient: patientMap[a.patient_id] || 'Unknown',
            doctor: doctorMap[a.doctor_id] || 'Unknown',
            time: a.appointment_time,
            status: a.status
        }));

        ResponseHandler.success(res, formattedAppts, 'Recent appointments retrieved successfully');
    } catch (error) {
        next(error);
    }
};
