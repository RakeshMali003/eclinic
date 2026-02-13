const passport = require('passport');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=auth_failed`);
    }

    if (!user) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=no_user`);
    }

    try {
      // Create JWT token
      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }))}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect('http://localhost:5173?error=token_generation_failed');
    }
  })(req, res, next);
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    ResponseHandler.success(res, {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }, 'User data retrieved successfully');
  } catch (error) {
    next(error);
  }
};
