const Doctor = require('../models/doctorModel');
const ResponseHandler = require('../utils/responseHandler');

exports.registerDoctor = async (req, res, next) => {
    try {
        const {
            full_name,
            email,
            mobile,
            date_of_birth,
            gender,
            medical_council_reg_no,
            medical_council_name,
            registration_year,
            qualifications,
            university_name,
            graduation_year,
            experience_years,
            specializations,
            languages,
            consultation_modes,
            bank_account_name,
            bank_account_number,
            ifsc_code,
            pan_number,
            gstin,
            verification_status
        } = req.body;

        // Create doctor record
        const doctorData = {
            full_name,
            email,
            mobile,
            date_of_birth,
            gender,
            medical_council_reg_no,
            medical_council_name,
            registration_year,
            qualifications,
            university_name,
            graduation_year,
            experience_years,
            bank_account_name,
            bank_account_number,
            ifsc_code,
            pan_number,
            gstin,
            verification_status: verification_status || 'PENDING'
        };

        const newDoctor = await Doctor.create(doctorData);

        // Insert related data if provided
        if (specializations && specializations.length > 0) {
            await Doctor.insertSpecializations(newDoctor.id, specializations);
        }

        if (languages && languages.length > 0) {
            await Doctor.insertLanguages(newDoctor.id, languages);
        }

        if (consultation_modes && consultation_modes.length > 0) {
            await Doctor.insertConsultationModes(newDoctor.id, consultation_modes);
        }

        ResponseHandler.created(res, newDoctor, 'Doctor registered successfully');
    } catch (error) {
        next(error);
    }
};

exports.createDoctor = async (req, res, next) => {
    try {
        // Basic validation handled by middleware, robust checks here
        const { full_name, email, mobile, medical_council_reg_no } = req.body;

        // Could check duplicates here

        const newDoctor = await Doctor.create(req.body);
        ResponseHandler.created(res, newDoctor, 'Medical officer commissioned successfully');
    } catch (error) {
        next(error);
    }
};

exports.getAllDoctors = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const doctors = await Doctor.findAll(limit, offset);
        const total = await Doctor.count();

        ResponseHandler.success(res, {
            doctors,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        }, 'Medical personnel roster retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return ResponseHandler.notFound(res, 'Medical officer not found in database');
        }
        ResponseHandler.success(res, doctor, 'Doctor profile retrieved');
    } catch (error) {
        next(error);
    }
};
