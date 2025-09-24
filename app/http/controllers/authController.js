const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },
        

        postLogin(req, res, next) {
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            
            console.log('🔐 Login attempt for email:', email);
            
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    console.error('❌ Authentication error:', err);
                    req.flash('error', 'Authentication failed. Please try again.')
                    return next(err)
                }
                if(!user) {
                    console.log('❌ Authentication failed:', info ? info.message : 'Unknown error');
                    req.flash('error', info ? info.message : 'Login failed')
                    return res.redirect('/login')
                }
                
                console.log('✅ User authenticated successfully:', user.email, 'Role:', user.role);
                
                req.logIn(user, (err) => {
                    if(err) {
                        console.error('❌ Login session error:', err);
                        req.flash('error', 'Failed to create session. Please try again.') 
                        return next(err)
                    }

                    const redirectUrl = _getRedirectUrl(req);
                    console.log('✅ User logged in successfully! Redirecting to:', redirectUrl);
                    req.flash('success', `Welcome back, ${user.name}!`);
                    return res.redirect(redirectUrl)
                   
                })
            })(req, res, next)
        },



        register(req, res) {
            res.render('auth/register')
        },



        async postRegister(req, res) {
            const { name, email, password } = req.body
            
            // Validate input
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // Additional validation
            if (password.length < 6) {
                req.flash('error', 'Password must be at least 6 characters long')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            try {
                const normalizedEmail = email.toLowerCase().trim();
                
                console.log('📝 Registration attempt for:', normalizedEmail);

                // Check if email already exists (case-insensitive)
                const emailExists = await User.exists({ email: normalizedEmail });
                if (emailExists) {
                    console.log('❌ Email already exists:', normalizedEmail);
                    req.flash('error', 'Email already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Hash password 
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a user 
                const user = new User({
                    name: name.trim(),
                    email: normalizedEmail,
                    password: hashedPassword
                });

                const savedUser = await user.save();
                console.log('✅ User created successfully:', {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role
                });

                // Automatically log in the user after registration
                req.logIn(savedUser, (err) => {
                    if (err) {
                        console.error('❌ Error auto-logging in user:', err);
                        req.flash('error', 'Account created successfully! Please login with your credentials.');
                        return res.redirect('/login');
                    }
                    
                    console.log('✅ Auto-login successful for new user:', savedUser.email);
                    req.flash('success', `Welcome to Threaded Creations, ${savedUser.name}!`);
                    return res.redirect(_getRedirectUrl(req));
                });
                
            } catch (error) {
                console.error('❌ Registration error:', error);
                
                // Handle specific MongoDB errors
                if (error.code === 11000) {
                    req.flash('error', 'Email already exists');
                } else if (error.name === 'ValidationError') {
                    req.flash('error', 'Please check your input and try again');
                } else {
                    req.flash('error', 'Registration failed. Please try again.');
                }
                
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }
        },
        logout(req, res) {
            req.logout(function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error occurred while logging out');
                }
                res.redirect('/login');
            });
        }
         
    }
}
module.exports = authController