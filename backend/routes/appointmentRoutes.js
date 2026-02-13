const express = require('express');
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const validate = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post(
    '/',
    [
        check('appointment_id', 'ID is required').not().isEmpty(),
        check('patient_id', 'Patient ID is required').not().isEmpty(),
        check('doctor_id', 'Doctor ID is required').not().isEmpty(),
        check('appointment_date', 'Date is required').not().isEmpty(),
        validate
    ],
    appointmentController.createAppointment
);

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);

router.patch(
    '/:id/status',
    [
        authorize('admin', 'doctor', 'receptionist'),
        check('status', 'Status is required').isIn(['scheduled', 'completed', 'cancelled', 'no-show']),
        validate
    ],
    appointmentController.updateStatus
);

module.exports = router;
