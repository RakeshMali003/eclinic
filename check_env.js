import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL value:', process.env.DATABASE_URL);
}
