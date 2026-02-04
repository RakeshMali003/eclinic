const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const passport = require('./config/passport');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/database');
const supabase = require('./config/supabase');

const checkSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Supabase connection failed:', error.message);
        } else {
            console.log('✅ Supabase connection successful');
        }
    } catch (err) {
        console.error('❌ Supabase connection error:', err.message);
    }
};

checkSupabaseConnection();

// Import routes (Will be created next)
// const clinicRoutes = require('./routes/clinicRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const logger = require('./utils/logger');
const app = express();

// Custom request logger
app.use((req, res, next) => {
    logger.info('API_REQUEST', `${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        user: req.user ? req.user.id : 'unauthenticated'
    });
    next();
});

// Middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Passport middleware
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static('uploads'));

const ResponseHandler = require('./utils/responseHandler');

// Health check
app.get('/health', (req, res) => {
    ResponseHandler.success(res, { status: 'OK' }, 'Anti-Gravity Healthcare API is operational in orbit');
});

// API Routes (Commented until implemented to prevent crash)
// app.use('/api/clinics', clinicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Coordinate not found in star chart' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Anti-Gravity Healthcare Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, initiating landing sequence');
    pool.end(() => {
        console.log('💾 Database connection closed');
        process.exit(0);
    });
});
