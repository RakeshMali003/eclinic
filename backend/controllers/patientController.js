const Patient = require('../models/patientModel');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');
const { syncUserToAuth } = require('../utils/userSync');

exports.createPatient = async (req, res, next) => {
    try {
        logger.info('PATIENT_CREATE_START', 'Initiating patient creation', { data: req.body });
        const { patient_id, full_name, age, gender, phone, email } = req.body;

        // Validation
        if (!patient_id || !full_name || !phone) {
            logger.warn('PATIENT_CREATE_BAD_REQUEST', 'Missing essential bio-data');
            return ResponseHandler.badRequest(res, 'Missing essential bio-data (ID, Name, Phone)');
        }

        // Check existing
        const existing = await Patient.findById(patient_id);
        if (existing) {
            logger.warn('PATIENT_CREATE_CONFLICT', 'Patient ID already exists', { patient_id });
            return ResponseHandler.badRequest(res, 'Patient identity integrity violation: ID already exists');
        }

        const newPatient = await Patient.create(req.body);

        // Sync to auth_users if email is provided
        if (email) {
            await syncUserToAuth(email, 'patient', phone);
        }

        logger.success('PATIENT_CREATE_SUCCESS', 'Patient created and synced', { patient_id, email });
        ResponseHandler.created(res, newPatient, 'Patient lifecycle initiated');
    } catch (error) {
        logger.error('PATIENT_CREATE_FAIL', 'Failed to create patient', { error: error.message });
        next(error);
    }
};

exports.getAllPatients = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const patients = await Patient.findAll(limit, offset);
        const total = await Patient.count();

        ResponseHandler.success(res, {
            patients,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        }, 'Patient registry scan complete');
    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return ResponseHandler.notFound(res, 'Patient bio-signature not found');
        }
        ResponseHandler.success(res, patient, 'Patient data retrieved');
    } catch (error) {
        next(error);
    }
};

exports.updatePatient = async (req, res, next) => {
    try {
        const updated = await Patient.update(req.params.id, req.body);
        if (!updated) {
            return ResponseHandler.notFound(res, 'Target not found for recalibration');
        }
        ResponseHandler.updated(res, updated, 'Patient metrics updated');
    } catch (error) {
        next(error);
    }
};

exports.deletePatient = async (req, res, next) => {
    try {
        const deleted = await Patient.delete(req.params.id);
        if (!deleted) {
            return ResponseHandler.notFound(res, 'Target vanished before termination');
        }
        ResponseHandler.deleted(res, 'Patient record purged from system');
    } catch (error) {
        next(error);
    }
};
