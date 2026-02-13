require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Prisma connected successfully');

        // Test a simple query
        const result = await prisma.$queryRaw`SELECT NOW()`;
        console.log('✅ Query successful:', result);

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Prisma connection failed:', error.message);
    }
}

testConnection();
