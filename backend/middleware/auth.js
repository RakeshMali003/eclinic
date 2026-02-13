const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
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

        // Use prisma to find user
        const user = await prisma.users.findUnique({
            where: {
                user_id: decoded.id
            },
            select: {
                user_id: true,
                full_name: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return ResponseHandler.unauthorized(res, 'User signature not found in registry');
        }

        req.user = user;
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
