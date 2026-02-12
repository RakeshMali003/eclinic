const prisma = require('../config/database');

class Doctor {
    static async create(doctorData) {
        try {
            const data = await prisma.doctors.create({
                data: doctorData
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async insertSpecializations(doctorId, specializations) {
        // Note: The schema doesn't have doctor_specializations table
        // This might need to be handled differently or the table needs to be added
        console.log('insertSpecializations not implemented - table missing');
    }

    static async insertLanguages(doctorId, languages) {
        // Note: The schema doesn't have doctor_languages table
        // This might need to be handled differently or the table needs to be added
        console.log('insertLanguages not implemented - table missing');
    }

    static async insertConsultationModes(doctorId, modes) {
        // Note: The schema doesn't have doctor_consultation_modes table
        // This might need to be handled differently or the table needs to be added
        console.log('insertConsultationModes not implemented - table missing');
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const data = await prisma.doctors.findMany({
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
            const data = await prisma.doctors.findUnique({
                where: { id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async count() {
        try {
            const count = await prisma.doctors.count();
            return count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Doctor;
