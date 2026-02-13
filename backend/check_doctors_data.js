require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const doctors = await prisma.doctors.findMany();
        console.log('Doctors found:', doctors.length);
        if (doctors.length > 0) {
            console.log('Sample Doctor:', JSON.stringify(doctors[0], null, 2));
        } else {
            console.log('No doctors found.');
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
