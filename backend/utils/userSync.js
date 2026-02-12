const supabase = require('../config/supabase');
const logger = require('./logger');

/**
 * Syncs a user to the public.auth_users table.
 * @param {string} email - User's email
 * @param {string} role - User's role (patient, doctor, clinic)
 * @param {string} mobile - User's mobile number
 * @returns {Promise<void>}
 */
const syncUserToAuth = async (email, role, mobile = '') => {
    try {
        logger.info('AUTH_SYNC_START', 'Syncing user to auth_users', { email, role });

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('auth_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
            // Update role/mobile if needed
            const { error: updateError } = await supabase
                .from('auth_users')
                .update({ role, mobile, is_active: true })
                .eq('email', email);

            if (updateError) throw updateError;
            logger.success('AUTH_SYNC_UPDATE', 'User record updated in auth_users', { email });
        } else {
            // Insert new record
            const { error: insertError } = await supabase
                .from('auth_users')
                .insert({
                    email,
                    role,
                    mobile,
                    password_hash: 'managed_by_system', // Placeholder for internal sync
                    is_active: true
                });

            if (insertError) throw insertError;
            logger.success('AUTH_SYNC_INSERT', 'New user record created in auth_users', { email });
        }
    } catch (error) {
        logger.error('AUTH_SYNC_ERROR', 'Failed to sync user to auth_users', { email, error: error.message });
        // We don't necessarily want to throw here and crash the primary registration flow, 
        // but we've logged the failure.
    }
};

module.exports = { syncUserToAuth };
