const Order = require('../../../models/order')
const moment = require('moment')

function orderController() {
    return {
        index(req, res) {
            // Get all orders (not just non-completed ones) for better admin visibility
            Order.find({}, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password')
                .then(orders => {
                    console.log(`Admin viewing ${orders.length} orders`);
                    
                    if (req.xhr) {
                        return res.json(orders)
                    } else {
                        // Pass orders data to the view
                        return res.render('admin/orders', { 
                            orders: orders,
                            moment: moment 
                        })
                    }
                })
                .catch(err => {
                    console.error('Error fetching orders:', err);
                    res.status(500).render('admin/orders', { 
                        orders: [],
                        moment: moment,
                        error: 'Failed to load orders'
                    });
                });
        }
    }
}

module.exports = orderController;
