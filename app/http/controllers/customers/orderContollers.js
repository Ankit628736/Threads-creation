const Order = require('../../../models/order')
const moment = require('moment')

function orderContollers() {
    return {
        store(req, res) {
            //validate request
            const { phone, address } = req.body
            if (!phone || !address) {
                req.flash('error', 'All fiels are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                return Order.populate(result, { path: 'customerId' });
            }).then(placedOrder => {
                // req.flash('success', 'Order Placed successfully');
                delete req.session.cart;
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', placedOrder);
                return res.json({message:'Order Placed successfully'})
            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/cart');
            });

        },
        async index(req, res) {
            // If user is admin, redirect to admin orders
            if (req.user.role === 'admin') {
                req.flash('error', 'As an admin, please use the Admin Panel to view all orders.');
                return res.redirect('/admin/orders');
            }
            
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
            console.log(orders)
        },
        async show(req, res) {
            // If user is admin, redirect to admin orders
            if (req.user.role === 'admin') {
                req.flash('error', 'As an admin, please use the Admin Panel to manage orders.');
                return res.redirect('/admin/orders');
            }
            
            const order = await Order.findById(req.params.id)
            if (!order) {
                req.flash('error', 'Order not found.');
                return res.redirect('/customer/orders');
            }
            
            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            
            req.flash('error', 'You are not authorized to view this order.');
            return res.redirect('/customer/orders');
        }
    }
}

module.exports = orderContollers 