const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderContollers')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const AdminMenuController = require('../app/http/controllers/admin/menuController')
const AdminUserController = require('../app/http/controllers/admin/userController')

//middleware
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')

function initRoute(app) {

    app.get('/', homeController().index)
    
    // Test route for shirts
    app.get('/test-shirts', async (req, res) => {
        const Menu = require('../app/models/menu');
        try {
            const shirts = await Menu.find();
            console.log('🧪 Test route: Found', shirts.length, 'shirts');
            res.render('test-shirts', { pizzas: shirts });
        } catch (error) {
            console.error('🧪 Test route error:', error);
            res.render('test-shirts', { pizzas: [] });
        }
    })
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().cart)
    app.post('/register', authController().postRegister)
    app.post('/update-cart', cartController().update)
    app.post('/remove-from-cart', cartController().remove);

    //customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index);
    app.get('/customer/orders/:id', auth, orderController().show);

    
    //admin routes
    app.get('/admin/orders', admin, AdminOrderController().index);
    app.post('/admin/orders/status', admin, statusController().update);
    
    // Admin menu management routes
    app.get('/admin/menu', admin, AdminMenuController().index);
    app.get('/admin/menu/create', admin, AdminMenuController().create);
    app.post('/admin/menu', admin, AdminMenuController().store);
    app.post('/admin/menu/:id/toggle-stock', admin, AdminMenuController().toggleStock);
    app.delete('/admin/menu/:id', admin, AdminMenuController().delete);

    // Admin user management routes
    app.get('/admin/users', admin, AdminUserController().index);
    app.get('/admin/users/create', admin, AdminUserController().create);
    app.post('/admin/users', admin, AdminUserController().store);
    app.post('/admin/users/role', admin, AdminUserController().updateRole);
    app.post('/admin/users/reset-password', admin, AdminUserController().resetPassword);
    app.post('/admin/users/:id', admin, AdminUserController().delete);

    // Debug route to view users (remove in production)
    app.get('/debug/users', async (req, res) => {
        try {
            const User = require('../app/models/user');
            const users = await User.find({}).select('-password'); // Don't show passwords
            res.json({
                totalUsers: users.length,
                users: users.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }))
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


}

module.exports = initRoute
