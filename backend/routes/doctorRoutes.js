const express = require('express');
const { check } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const validate = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public registration endpoint (no auth required)
router.post(
    '/register',
    [
        check('full_name', 'Full name is required').not().isEmpty(),
        check('email', 'Valid email is required').isEmail(),
        check('mobile', 'Mobile number is required').not().isEmpty(),
        check('medical_council_reg_no', 'Council Registration Number is required').not().isEmpty(),
        validate
    ],
    doctorController.registerDoctor
);

// Admin-only doctor creation
router.post(
    '/',
    [
        protect,
        authorize('admin'),
        check('full_name', 'Full name is required').not().isEmpty(),
        check('email', 'Valid email is required').isEmail(),
        check('medical_council_reg_no', 'Council Registration Number is required').not().isEmpty(),
        validate
    ],
    doctorController.createDoctor
);

router.get('/', protect, doctorController.getAllDoctors);
router.get('/:id', protect, doctorController.getDoctorById);

module.exports = router;
