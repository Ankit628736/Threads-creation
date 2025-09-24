const User = require('../../../models/user');
const bcrypt = require('bcrypt');

function userController() {
    return {
        async index(req, res) {
            try {
                const users = await User.find({}).sort({ createdAt: -1 });
                res.render('admin/users', { 
                    users: users,
                    moment: require('moment')
                });
            } catch (error) {
                console.error('Error fetching users:', error);
                req.flash('error', 'Failed to fetch users');
                res.redirect('/admin/orders');
            }
        },

        async create(req, res) {
            res.render('admin/user-create');
        },

        async store(req, res) {
            try {
                const { name, email, password, role } = req.body;
                
                if (!name || !email || !password) {
                    req.flash('error', 'All fields are required');
                    return res.redirect('/admin/users/create');
                }

                const normalizedEmail = email.toLowerCase().trim();
                
                // Check if email exists
                const existingUser = await User.findOne({ email: normalizedEmail });
                if (existingUser) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/admin/users/create');
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const user = new User({
                    name: name.trim(),
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: role || 'customer'
                });

                await user.save();
                req.flash('success', 'User created successfully');
                res.redirect('/admin/users');

            } catch (error) {
                console.error('Error creating user:', error);
                req.flash('error', 'Failed to create user');
                res.redirect('/admin/users/create');
            }
        },

        async updateRole(req, res) {
            try {
                const { userId, role } = req.body;
                
                await User.findByIdAndUpdate(userId, { role });
                req.flash('success', 'User role updated successfully');
                res.redirect('/admin/users');

            } catch (error) {
                console.error('Error updating user role:', error);
                req.flash('error', 'Failed to update user role');
                res.redirect('/admin/users');
            }
        },

        async resetPassword(req, res) {
            try {
                const { userId } = req.body;
                const newPassword = 'password123'; // Default password
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                
                await User.findByIdAndUpdate(userId, { password: hashedPassword });
                req.flash('success', `Password reset to: ${newPassword}`);
                res.redirect('/admin/users');

            } catch (error) {
                console.error('Error resetting password:', error);
                req.flash('error', 'Failed to reset password');
                res.redirect('/admin/users');
            }
        },

        async delete(req, res) {
            try {
                const userId = req.params.id;
                
                // Prevent deleting current user
                if (userId === req.user._id.toString()) {
                    req.flash('error', 'Cannot delete your own account');
                    return res.redirect('/admin/users');
                }

                await User.findByIdAndDelete(userId);
                req.flash('success', 'User deleted successfully');
                res.redirect('/admin/users');

            } catch (error) {
                console.error('Error deleting user:', error);
                req.flash('error', 'Failed to delete user');
                res.redirect('/admin/users');
            }
        }
    }
}

module.exports = userController;