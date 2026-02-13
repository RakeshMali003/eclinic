const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        const demoUsers = [
            { full_name: 'Dr. Sarah Johnson', email: 'admin@clinic.com', phone: '+91 98765 43210', role: 'admin', password: 'admin' },
            { full_name: 'Dr. Michael Chen', email: 'doctor@clinic.com', phone: '+91 98765 43211', role: 'doctor', password: 'doctor' },
            { full_name: 'Emma Wilson', email: 'reception@clinic.com', phone: '+91 98765 43212', role: 'receptionist', password: 'reception' },
            { full_name: 'John Doe', email: 'nurse@clinic.com', phone: '+91 98765 43213', role: 'nurse', password: 'nurse' },
            { full_name: 'Lisa Martinez', email: 'lab@clinic.com', phone: '+91 98765 43214', role: 'lab_technician', password: 'lab' },
            { full_name: 'Robert Brown', email: 'pharmacy@clinic.com', phone: '+91 98765 43215', role: 'pharmacist', password: 'pharmacy' },
            { full_name: 'Rahul Sharma', email: 'patient@clinic.com', phone: '+91 98765 43216', role: 'patient', password: 'patient' },
        ];

        for (const user of demoUsers) {
            // Check if user exists
            const check = await pool.query("SELECT * FROM users WHERE email = $1", [user.email]);
            if (check.rows.length > 0) {
                console.log(`⚠️ User ${user.email} already exists.`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(user.password, salt);

            // Create user
            const query = `
                INSERT INTO users (full_name, email, phone, role, password_hash)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING user_id, email, role;
            `;
            const res = await pool.query(query, [user.full_name, user.email, user.phone, user.role, passwordHash]);
            console.log('✅ User created:', res.rows[0]);
        }

    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        pool.end();
    }
}

seed();
