const prisma = require('../config/database');

class User {
    static async create(userData) {
        const { full_name, email, mobile_number, role, password_hash } = userData;
        return await prisma.users.create({
            data: {
                full_name,
                email,
                mobile_number,
                role: role || 'patient',
                password_hash
            }
        });
    }

    static async findByEmail(email) {
        return await prisma.users.findUnique({
            where: { email }
        });
    }

    static async findById(user_id) {
        return await prisma.users.findUnique({
            where: { user_id }
        });
    }

    static async update(user_id, updates) {
        return await prisma.users.update({
            where: { user_id },
            data: updates
        });
    }
}

module.exports = User;
