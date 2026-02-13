const Appointment = require('../models/appointmentModel');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

exports.createAppointment = async (req, res, next) => {
    try {
        logger.info('APPOINTMENT_CREATE_START', 'Initiating appointment creation', { data: req.body });
        const { appointment_id, patient_id, doctor_id, appointment_date } = req.body;

        if (!appointment_id || !patient_id || !doctor_id || !appointment_date) {
            logger.warn('APPOINTMENT_CREATE_BAD_REQUEST', 'Missing flight parameters');
            return ResponseHandler.badRequest(res, 'Missing flight parameters for rendezvous');
        }

        const newAppointment = await Appointment.create(req.body);
        logger.success('APPOINTMENT_CREATE_SUCCESS', 'Appointment created', { appointment_id });
        ResponseHandler.created(res, newAppointment, 'Rendezvous confirmed');
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
