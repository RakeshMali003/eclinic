const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return ResponseHandler.unauthorized(res, 'Not authorized: No nav beacon found');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adapted query to use 'id' instead of 'user_id' if that's the standard, checking schema later
        const result = await pool.query(
            'SELECT user_id, full_name, email, role FROM users WHERE user_id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return ResponseHandler.unauthorized(res, 'User signature not found in registry');
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        return ResponseHandler.unauthorized(res, 'Not authorized: Signal lost');
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return ResponseHandler.forbidden(res, `Role ${req.user.role} is not authorized for this sector`);
        }
        next();
    };
};

module.exports = { protect, authorize };
