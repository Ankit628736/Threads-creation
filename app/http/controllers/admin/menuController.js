const Menu = require('../../../models/menu');

function adminMenuController() {
    return {
        // Display all menu items
        async index(req, res) {
            try {
                const menuItems = await Menu.find().sort({ createdAt: -1 });
                console.log(`Admin menu: Found ${menuItems.length} menu items`);
                res.render('admin/menu', { 
                    pizzas: menuItems || [],  // Ensure it's always an array
                    totalItems: menuItems ? menuItems.length : 0
                });
            } catch (error) {
                console.error('Error fetching menu items:', error);
                req.flash('error', 'Error loading menu items');
                res.render('admin/menu', { 
                    pizzas: [],  // Always provide empty array as fallback
                    totalItems: 0, 
                    error: 'Error loading menu items' 
                });
            }
        },

        // Show form to add new item
        create(req, res) {
            res.render('admin/menu-create', {
                name: '',
                price: '',
                size: '',
                category: 'shirt',
                image: '',
                description: ''
            });
        },

        // Store new menu item
        async store(req, res) {
            try {
                const { name, price, size, category, description, image } = req.body;
                
                if (!name || !price || !size) {
                    req.flash('error', 'Name, price, and size are required');
                    return res.render('admin/menu-create', {
                        name: name || '',
                        price: price || '',
                        size: size || '',
                        category: category || 'shirt',
                        image: image || '',
                        description: description || ''
                    });
                }

                const menuItem = new Menu({
                    name: name.trim(),
                    image: image.trim() || 'shirt1.png',  // Default shirt image
                    price: parseFloat(price),
                    size: size.toUpperCase(),
                    category: category || 'shirt',
                    description: description ? description.trim() : '',
                    inStock: true
                });

                await menuItem.save();
                req.flash('success', `Menu item "${name}" added successfully! It will appear on the home page immediately.`);
                res.redirect('/admin/menu');
            } catch (error) {
                console.error('Error creating menu item:', error);
                req.flash('error', 'Error adding menu item: ' + error.message);
                return res.render('admin/menu-create', {
                    name: req.body.name || '',
                    price: req.body.price || '',
                    size: req.body.size || '',
                    category: req.body.category || 'shirt',
                    image: req.body.image || '',
                    description: req.body.description || ''
                });
            }
        },

        // Toggle stock status
        async toggleStock(req, res) {
            try {
                const { id } = req.params;
                const menuItem = await Menu.findById(id);
                
                if (!menuItem) {
                    return res.json({ success: false, message: 'Menu item not found' });
                }

                menuItem.inStock = !menuItem.inStock;
                await menuItem.save();

                res.json({ 
                    success: true, 
                    message: `${menuItem.name} is now ${menuItem.inStock ? 'in stock' : 'out of stock'}`,
                    inStock: menuItem.inStock 
                });
            } catch (error) {
                console.error('Error toggling stock:', error);
                res.json({ success: false, message: 'Error updating stock status' });
            }
        },

        // Delete menu item
        async delete(req, res) {
            try {
                const { id } = req.params;
                const deleted = await Menu.findByIdAndDelete(id);
                
                if (!deleted) {
                    res.json({ success: false, message: 'Menu item not found' });
                } else {
                    res.json({ success: true, message: `${deleted.name} has been deleted` });
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                res.json({ success: false, message: 'Error deleting menu item' });
            }
        }
    };
}

module.exports = adminMenuController;