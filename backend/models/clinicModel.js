const prisma = require('../config/database');

class Clinic {
    static async create(clinicData) {
        try {
            const data = await prisma.clinics.create({
                data: clinicData
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const data = await prisma.clinics.findMany({
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
            const data = await prisma.clinics.findUnique({
                where: { id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async count() {
        try {
            const count = await prisma.clinics.count();
            return count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Clinic;
