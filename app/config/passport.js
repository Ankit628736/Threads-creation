const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log('🔍 Passport: Looking for user with email:', email);
            
            // Check if email exists (case-insensitive)
            const user = await User.findOne({ email: email.toLowerCase().trim() });
            
            if (!user) {
                console.log('❌ Passport: No user found with email:', email);
                return done(null, false, { message: 'No user found with this email address' });
            }

            console.log('✅ Passport: User found:', user.email, 'Name:', user.name);

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                console.log('✅ Passport: Password match successful for:', user.email);
                return done(null, user, { message: 'Login successful' });
            } else {
                console.log('❌ Passport: Password mismatch for:', user.email);
                return done(null, false, { message: 'Incorrect password' });
            }
            
        } catch (err) {
            console.error('❌ Passport: Error during authentication:', err);
            return done(err, false, { message: 'Authentication failed due to server error' });
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                done(err, null)
            })
    })
}

module.exports = init