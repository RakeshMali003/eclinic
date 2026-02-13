const prisma = require('../config/database');

class Patient {
    static async create(patientData) {
        try {
            const data = await prisma.patients.create({
                data: patientData
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const data = await prisma.patients.findMany({
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
            const data = await prisma.patients.findUnique({
                where: { patient_id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findByPhone(phone) {
        try {
            const data = await prisma.patients.findFirst({
                where: { phone: phone }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updates) {
        try {
            const data = await prisma.patients.update({
                where: { patient_id: id },
                data: updates
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const data = await prisma.patients.delete({
                where: { patient_id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async count() {
        try {
            const count = await prisma.patients.count();
            return count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Patient;
