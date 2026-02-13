const supabase = require('../config/supabase');
const ResponseHandler = require('../utils/responseHandler');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const today = new Date().toISOString().split('T')[0];
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Todays Appointments
        let apptsCountQuery = supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('appointment_date', today);

        if (userRole === 'doctor') {
            apptsCountQuery = apptsCountQuery.eq('doctor_id', userId);
        }

        const { count: todaysAppointments, error: aError } = await apptsCountQuery;
        if (aError) throw aError;

        // Active Patients (distinct patients in last 30 days)
        const { data: activePatientData, error: apError } = await supabase
            .from('appointments')
            .select('patient_id')
            .gte('created_at', last30Days);

        if (apError) throw apError;
        const activePatientsCount = new Set(activePatientData.map(a => a.patient_id)).size;

        let stats = {
            todaysAppointments: todaysAppointments || 0,
            activePatients: activePatientsCount || 0,
            totalRevenue: '₹0',
            pendingPayments: 0
        };

        // Revenue and Pending Payments (Admin/Receptionist/Doctor)
        if (userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor') {
            let revenueQuery = supabase.from('invoices').select('total_amount').filter('created_at', 'gte', last7Days);
            let pendingQuery = supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'Pending');

            if (userRole === 'doctor') {
                // This join is tricky in Supabase without proper relations or rpc
                // For now, get appointment IDs for the doctor
                const { data: doctorAppts } = await supabase.from('appointments').select('appointment_id').eq('doctor_id', userId);
                const apptIds = doctorAppts.map(a => a.appointment_id);
                revenueQuery = revenueQuery.in('appointment_id', apptIds);
            }

            const { data: revenueData, error: rError } = await revenueQuery;
            const { count: pendingCount, error: pError } = await pendingQuery;

            if (rError) throw rError;
            if (pError) throw pError;

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
        const userId = req.user.id;
        const userRole = req.user.role;

        const today = new Date().toISOString().split('T')[0];

        let query = supabase
            .from('appointments')
            .select('appointment_time')
            .eq('appointment_date', today);

        if (userRole === 'doctor') {
            query = query.eq('doctor_id', userId);
        }

        const { data: appointmentData, error } = await query;
        if (error) throw error;

        // Ensure we have data for all time slots (9 AM to 4 PM)
        const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '2 PM', '3 PM', '4 PM'];
        const filledData = timeSlots.map(slot => {
            // Very simple time matching - in real app would parse actual time
            const count = appointmentData.filter(a => {
                if (!a.appointment_time) return false;
                return a.appointment_time.includes(slot);
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
        const last6Days = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();

        let query = supabase
            .from('invoices')
            .select('total_amount, created_at')
            .gte('created_at', last6Days);

        const { data: revenueData, error } = await query;
        if (error) throw error;

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
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = supabase
            .from('appointments')
            .select('appointment_id, status, appointment_time, patients(full_name), doctors(full_name)')
            .order('appointment_time', { ascending: false })
            .limit(5);

        if (userRole === 'doctor') {
            query = query.eq('doctor_id', userId);
        }

        const { data: appointments, error } = await query;
        if (error) throw error;

        const formattedAppts = appointments.map(a => ({
            appointment_id: a.appointment_id,
            patient: a.patients ? a.patients.full_name : 'Unknown',
            doctor: a.doctors ? a.doctors.full_name : 'Unknown',
            time: a.appointment_time,
            status: a.status
        }));

        ResponseHandler.success(res, formattedAppts, 'Recent appointments retrieved successfully');
    } catch (error) {
        next(error);
    }
};
