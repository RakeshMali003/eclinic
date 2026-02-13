import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Create Patients Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        contact TEXT NOT NULL,
        email TEXT,
        address TEXT,
        abha_id TEXT,
        registration_date DATE DEFAULT CURRENT_DATE,
        last_visit DATE,
        total_visits INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created patients table');

        // Create Doctors Table (Sample schema based on typical needs)
        await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        contact TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created doctors table');

        // Create Appointments Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID REFERENCES patients(id),
        doctor_id UUID REFERENCES doctors(id),
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT DEFAULT 'scheduled',
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created appointments table');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
