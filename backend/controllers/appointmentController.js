const Appointment = require('../models/appointmentModel');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

exports.createAppointment = async (req, res, next) => {
    try {
<<<<<<< HEAD
        const { patient_id, doctor_id, appointment_date } = req.body;

        if (!patient_id || !doctor_id || !appointment_date) {
            return ResponseHandler.badRequest(res, 'Missing required parameters for appointment');
        }

        // Generate unique appointment ID
        const generateAppointmentID = () => {
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const random = String(Math.floor(Math.random() * 9000) + 1000);
            return `APT-${year}${month}${day}-${hours}${minutes}-${random}`;
        };

        const appointment_id = generateAppointmentID();

        // Parse the appointment_date string to Date object for Prisma (treat as UTC date at midnight)
        const [year, month, day] = appointment_date.split('-').map(Number);
        const utcDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed in Date constructor
        const appointmentData = {
            appointment_id,
            ...req.body,
            appointment_date: utcDate
        };

        const newAppointment = await Appointment.create(appointmentData);
        ResponseHandler.created(res, newAppointment, 'Appointment created successfully');
=======
        logger.info('APPOINTMENT_CREATE_START', 'Initiating appointment creation', { data: req.body });
        const { appointment_id, patient_id, doctor_id, appointment_date } = req.body;

        if (!appointment_id || !patient_id || !doctor_id || !appointment_date) {
            logger.warn('APPOINTMENT_CREATE_BAD_REQUEST', 'Missing flight parameters');
            return ResponseHandler.badRequest(res, 'Missing flight parameters for rendezvous');
        }

        const newAppointment = await Appointment.create(req.body);
        logger.success('APPOINTMENT_CREATE_SUCCESS', 'Appointment created', { appointment_id });
        ResponseHandler.created(res, newAppointment, 'Rendezvous confirmed');
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
    } catch (error) {
        logger.error('APPOINTMENT_CREATE_FAIL', 'Failed to create appointment', { error: error.message });
        next(error);
    }
};

exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll();
        ResponseHandler.success(res, appointments, 'Scheduled encounters retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return ResponseHandler.notFound(res, 'Encounter coordinates not found');
        }
        ResponseHandler.success(res, appointment, 'Rendezvous details accessed');
    } catch (error) {
        next(error);
    }
};

exports.getAppointmentsByPatient = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        if (!patientId) {
            return ResponseHandler.badRequest(res, 'Patient ID is required');
        }

        const appointments = await Appointment.findByPatient(patientId);

        ResponseHandler.success(res, appointments, 'Patient appointments retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getUpcomingAppointments = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        if (!patientId) {
            return ResponseHandler.badRequest(res, 'Patient ID is required');
        }

        // Get today's date at start of day in local timezone
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await Appointment.findUpcomingByPatient(patientId, today);

        const response = {
            count: appointments.length,
            appointments: appointments
        };

        ResponseHandler.success(res, response, 'Upcoming appointments retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return ResponseHandler.badRequest(res, 'Status update required');

        const updated = await Appointment.updateStatus(req.params.id, status);
        if (!updated) {
            return ResponseHandler.notFound(res, 'Rendezvous target lost');
        }
        ResponseHandler.updated(res, updated, 'Encounter status recalibrated');
    } catch (error) {
        next(error);
    }
};

exports.getBookedSlots = async (req, res, next) => {
    try {
        const { doctorId, date } = req.params;

        console.log('getBookedSlots controller called with:', { doctorId, date });

        if (!doctorId || !date) {
            return ResponseHandler.badRequest(res, 'Doctor ID and date are required');
        }

        const bookedSlots = await Appointment.getBookedSlots(doctorId, date);
        console.log('Controller returning booked slots:', bookedSlots);
        ResponseHandler.success(res, { bookedSlots }, 'Booked time slots retrieved successfully');
    } catch (error) {
        console.error('Error in getBookedSlots controller:', error);
        next(error);
    }
};
