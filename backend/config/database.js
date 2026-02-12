const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

prisma.$connect()
    .then(() => {
        console.log('✅ Prisma database connected successfully');
    })
    .catch((err) => {
        console.error('❌ Prisma database connection error:', err);
        process.exit(-1);
    });

module.exports = prisma;
