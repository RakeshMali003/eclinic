const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log the error with request context
    logger.error('SERVER_ERROR', err.message || 'Internal system failure', {
        method: req.method,
        path: req.originalUrl,
        user: req.user ? req.user.id : 'unauthenticated',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        error_details: err
    });

    // PostgreSQL errors
    if (err.code === '23505') {
        return ResponseHandler.badRequest(res, 'Duplicate entry detected in spacetime continuum', err.detail);
    }

    if (err.code === '23503') {
        return ResponseHandler.badRequest(res, 'Foreign key constraint violation: Tether broken', err.detail);
    }

    if (err.code === '22P02') {
        return ResponseHandler.badRequest(res, 'Invalid input syntax: Signal corrupted');
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return ResponseHandler.badRequest(res, 'Validation failed: Protocol mismatch', err.errors);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.unauthorized(res, 'Invalid token: Identification failed');
    }

    if (err.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'Token expired: Session terminated');
    }

    // Default error
    return ResponseHandler.error(res, err.message || 'Internal system failure', err.statusCode || 500);
};

module.exports = errorHandler;
