const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // First, try to find user by email
        let user = await prisma.users.findUnique({
          where: { email: email }
        });

        if (!user) {
          // Create new user
          user = await prisma.users.create({
            data: {
              full_name: profile.displayName,
              email: email,
              password_hash: await bcrypt.hash(Math.random().toString(36), 10), // temporary password
              role: 'patient'
            }
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!user) throw new Error('User not found');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
