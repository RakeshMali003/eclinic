const User = require('./models/userModel');

async function testGoogleAuthUserCreation() {
    try {
        console.log('Testing Google auth user creation...');

        // Simulate Google profile data
        const profile = {
            displayName: 'Test User',
            emails: [{ value: 'test@example.com' }]
        };

        // Check if user already exists
        let user = await User.findByEmail(profile.emails[0].value);
        if (user) {
            console.log('User already exists:', user);
            return;
        }

        // Create new user
        const userData = {
            full_name: profile.displayName,
            email: profile.emails[0].value,
            role: 'patient',
            password_hash: 'dummy_hash' // Dummy password for test
        };

        user = await User.create(userData);
        console.log('✅ User created successfully:', user);

        // Verify by finding again
        const foundUser = await User.findByEmail(profile.emails[0].value);
        console.log('✅ User found in database:', foundUser);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testGoogleAuthUserCreation();
