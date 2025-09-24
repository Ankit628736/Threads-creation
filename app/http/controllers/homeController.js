const Menu = require('../../models/menu')
function homeController() {
    return {
        async index(req, res) {
            try {
                // Set cache headers to ensure fresh data
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', '0');
                
                // Fetch all shirts from database
                const shirts = await Menu.find({ inStock: { $ne: false } }).sort({ createdAt: -1 });
                console.log(`✅ Loaded ${shirts.length} shirts from database`);
                
                // Log first few shirts for debugging
                if (shirts.length > 0) {
                    console.log('📦 Sample shirts being passed to template:');
                    shirts.slice(0, 3).forEach(shirt => {
                        console.log(`- ${shirt.name}: ₹${shirt.price}, Image: ${shirt.image}, Size: ${shirt.size}`);
                    });
                } else {
                    console.log('❌ No shirts found in database');
                }
                
                return res.render('home', { 
                    pizzas: shirts, // Keep variable name for compatibility with existing template
                    shirtsCount: shirts.length,
                    timestamp: Date.now() // Add timestamp to force refresh
                });
            } catch (error) {
                console.error('❌ Error fetching shirts from database:', error);
                // Return empty array if database error
                return res.render('home', { 
                    pizzas: [],
                    shirtsCount: 0,
                    error: 'Unable to load shirts at the moment. Please try again later.',
                    timestamp: Date.now()
                });
            }
        }
    }
}

module.exports = homeController