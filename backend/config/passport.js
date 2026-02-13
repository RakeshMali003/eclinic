const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const supabase = require('./supabase');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { syncUserToAuth } = require('../utils/userSync');

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
        logger.info('AUTH_OAUTH', 'Processing Google OAuth login', { google_id: profile.id, email: profile.emails?.[0]?.value });

        // Search in users table by google_id
        let { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', profile.id);

        if (error) {
          logger.error('AUTH_DB_ERROR', 'Error searching for user by google_id', { error });
          throw error;
        }

        let user;

        if (!users || users.length === 0) {
          // Search by email
          const email = profile.emails[0].value;
          let { data: existingUsers, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

          if (emailError) {
            logger.error('AUTH_DB_ERROR', 'Error searching for user by email', { email, error: emailError });
            throw emailError;
          }

          if (!existingUsers || existingUsers.length === 0) {
            // Create new user
            const userId = uuidv4();
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: userId,
                  full_name: profile.displayName,
                  email: email,
                  google_id: profile.id,
                  role: 'PATIENT',
                  created_at: new Date().toISOString()
                }
              ])
              .select()
              .single();

            if (insertError) {
              logger.error('AUTH_SIGNUP_ERROR', 'Error creating new user in users table', { email, error: insertError });
              throw insertError;
            }

            user = newUser;
            logger.success('AUTH_SIGNUP', 'New user registered via Google', { user_id: userId, email });

            // Sync to auth_users table
            await syncUserToAuth(email, 'patient');

          } else {
            // Update existing user with google_id
            const { data: updatedUser, error: updateError } = await supabase
              .from('users')
              .update({ google_id: profile.id })
              .eq('id', existingUsers[0].id)
              .select()
              .single();

            if (updateError) {
              logger.error('AUTH_UPDATE_ERROR', 'Error updating user with google_id', { user_id: existingUsers[0].id, error: updateError });
              throw updateError;
            }
            user = updatedUser;
            logger.info('AUTH_LOGIN', 'Existing user logged in via Google (linked google_id)', { user_id: user.id, email });
          }
        } else {
          user = users[0];
          logger.info('AUTH_LOGIN', 'User logged in via Google', { user_id: user.id, email: user.email });
        }

        return done(null, user);
      } catch (error) {
        logger.error('AUTH_STRATEGY_ERROR', 'Passport strategy execution failed', { error: error.message });
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
